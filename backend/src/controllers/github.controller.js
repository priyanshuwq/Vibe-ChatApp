import axios from "axios";

// Fetch raw contribution calendar data via GitHub GraphQL API (for live graph rendering)
export const getRawContributions = async (req, res) => {
  try {
    const { username } = req.params;
    const token = process.env.GITHUB_API_TOKEN;

    if (!token) {
      return res.status(500).json({ error: "GITHUB_API_TOKEN not configured on server" });
    }

    const query = `query($login:String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }`;

    const resp = await axios.post(
      "https://api.github.com/graphql",
      { query, variables: { login: username } },
      { headers: { Authorization: `bearer ${token}` } }
    );

    // Return the full GraphQL response for the frontend to parse
    res.json(resp.data);
  } catch (error) {
    console.error("Error fetching GitHub contributions:", error?.response?.data || error.message || error);
    res.status(500).json({ error: "Failed to fetch contributions" });
  }
};

// Fetch contribution calendar via GitHub GraphQL API and compute simple stats
// Requires env var GITHUB_API_TOKEN to be set on the server (do NOT expose this token to the client)
export const getContributions = async (req, res) => {
  try {
    const { username } = req.params;
    const token = process.env.GITHUB_API_TOKEN;

    if (!token) {
      return res.status(500).json({ error: "GITHUB_API_TOKEN not configured on server" });
    }

    const query = `query($login:String!) {\n  user(login: $login) {\n    contributionsCollection {\n      contributionCalendar {\n        totalContributions\n        weeks {\n          contributionDays {\n            date\n            contributionCount\n          }\n        }\n      }\n    }\n  }\n}`;

    const resp = await axios.post(
      "https://api.github.com/graphql",
      { query, variables: { login: username } },
      { headers: { Authorization: `bearer ${token}` } }
    );

    const calendar = resp.data.data?.user?.contributionsCollection?.contributionCalendar;
    if (!calendar) return res.status(404).json({ error: "No contributions data" });

    const totalContributions = calendar.totalContributions || 0;

    // Flatten days
    const days = [];
    for (const week of calendar.weeks || []) {
      for (const day of week.contributionDays || []) days.push(day);
    }

    // Sort by date ascending
    days.sort((a, b) => new Date(a.date) - new Date(b.date));

    let longestStreak = 0;
    let currentStreak = 0;
    let running = 0;
    let lastContributionDate = null;

    for (let i = 0; i < days.length; i++) {
      if (days[i].contributionCount > 0) {
        running += 1;
        lastContributionDate = days[i].date;
      } else {
        if (running > longestStreak) longestStreak = running;
        running = 0;
      }
    }
    if (running > longestStreak) longestStreak = running;

    // Compute current streak from the end backwards
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].contributionCount > 0) currentStreak += 1;
      else break;
    }

    res.json({ totalContributions, longestStreak, currentStreak, lastContributionDate });
  } catch (error) {
    console.error("Error fetching GitHub contributions:", error?.response?.data || error.message || error);
    res.status(500).json({ error: "Failed to fetch contributions" });
  }
};
