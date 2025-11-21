import { motion } from "framer-motion";
import { useAuthStore } from "../store/useAuthStore";
import ThemeToggle from "../components/ThemeToggle";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Github, ExternalLink, Calendar, Info } from "lucide-react";
import Lottie from "lottie-react";
import GitHubContributions from "../components/GitHubContributions";

const SettingsPage = () => {
  const { authUser, updateProfile } = useAuthStore();
  const [preview, setPreview] = useState(authUser?.profilePic);
  const [loading, setLoading] = useState(false);
  const [githubData, setGithubData] = useState(null);
  const [githubLoading, setGithubLoading] = useState(false);
  const [coffeeAnimation, setCoffeeAnimation] = useState(null);

  const GITHUB_USERNAME = "priyanshuwq"; // Replace with your actual GitHub username

  // Get the current theme for proper styling
  const [theme, setTheme] = useState(
    document.documentElement.getAttribute("data-theme") || "light"
  );

  // Listen for theme changes
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "data-theme") {
          setTheme(document.documentElement.getAttribute("data-theme") || "light");
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  // Load coffee animation
  useEffect(() => {
    fetch("/Hot Smiling Coffee _ Good Morning.json")
      .then((response) => response.json())
      .then((data) => setCoffeeAnimation(data))
      .catch((error) => console.error("Error loading animation:", error));
  }, []);

  useEffect(() => {
    // Fetch GitHub profile
    const fetchGithubData = async () => {
      setGithubLoading(true);
      try {
        const profileRes = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}`
        );
        const profile = await profileRes.json();
        setGithubData(profile);
      } catch (error) {
        console.error("Error fetching GitHub data:", error);
      } finally {
        setGithubLoading(false);
      }
    };

    fetchGithubData();
  }, []);

  //  Handle file change and convert to base64
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // only allow image types
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      const base64Image = reader.result;
      setPreview(base64Image);
      handleUpload(base64Image); // auto-upload after selecting
    };
  };

  // Upload base64 to backend
  const handleUpload = async (base64Image) => {
    try {
      setLoading(true);
      await updateProfile({ profilePic: base64Image });
      // toast.success("Profile updated!");
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 sm:pt-24 px-3 sm:px-4 flex justify-center pb-10">
      <div className="w-full max-w-3xl space-y-4 sm:space-y-6">
        {/* Title */}
        {/* <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-xl sm:text-2xl font-bold text-center bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent"
        >
          Account Settings
        </motion.h2> */}

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-base-200/50 dark:bg-base-200/30 backdrop-blur-lg border border-base-300 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 shadow-md"
        >
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <img
              src={
                preview ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="Profile"
              className="w-24 h-24 rounded-full border-2 border-gray-900 dark:border-gray-100 object-cover shadow"
            />

            {/* Hidden file input */}
            <input
              type="file"
              id="file-upload"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="file-upload"
              className="px-4 py-1 text-sm bg-base-300 rounded-lg cursor-pointer hover:bg-base-100 transition"
            >
              Change Photo
            </label>

            {loading && <p className="text-xs text-gray-500">Uploading...</p>}
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h3 className="text-lg font-semibold">{authUser?.fullName}</h3>
              {authUser?.isAdmin && (
                <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-semibold bg-black text-yellow-400 border border-yellow-400 rounded-full shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-yellow-400">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
                  </svg>
                  Admin
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">{authUser?.email}</p>

            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 rounded-lg border border-base-300 bg-base-100/40">
                <p className="text-gray-500">Member Since</p>
                <p className="font-medium">
                  {new Date(authUser?.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="p-3 rounded-lg border border-base-300 bg-base-100/40">
                <p className="text-gray-500">Status</p>
                <p className="font-medium text-green-500">Active</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* GitHub Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-base-200/50 dark:bg-base-200/30 backdrop-blur-lg border border-base-300 rounded-2xl p-4 sm:p-6 shadow-md"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <div className="flex items-center gap-2">
              <Github className="text-gray-500" size={20} />
              <h3 className="text-lg font-semibold">GitHub Profile</h3>
            </div>
            <a
              href={`https://github.com/${GITHUB_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-gray-900 dark:text-gray-100 hover:underline"
            >
              View Profile <ExternalLink size={14} />
            </a>
          </div>

          {githubLoading ? (
            <div className="flex justify-center py-8">
              <span className="loading loading-spinner loading-md text-gray-900 dark:text-gray-100"></span>
            </div>
          ) : githubData ? (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0 flex justify-center md:justify-start">
                  <img
                    src={githubData.avatar_url}
                    alt={githubData.name || GITHUB_USERNAME}
                    className="w-24 h-24 rounded-lg border border-base-300 shadow-md"
                  />
                </div>

                <div className="flex-1">
                  <h4 className="font-semibold text-lg text-center md:text-left">
                    {githubData.name || GITHUB_USERNAME}
                  </h4>
                  <p className="text-gray-500 text-sm mb-2 text-center md:text-left">
                    @{githubData.login}
                  </p>
                  {githubData.bio && (
                    <p className="text-sm mb-3 text-center md:text-left">
                      {githubData.bio}
                    </p>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 text-sm">
                    <div className="flex flex-col items-center p-2 rounded-lg border border-base-300 bg-base-100/40">
                      <span className="font-semibold">{githubData.public_repos}</span>
                      <span className="text-gray-500 text-xs">Repositories</span>
                    </div>
                    <div className="flex flex-col items-center p-2 rounded-lg border border-base-300 bg-base-100/40">
                      <span className="font-semibold">{githubData.followers}</span>
                      <span className="text-gray-500 text-xs">Followers</span>
                    </div>
                    <div className="flex flex-col items-center p-2 rounded-lg border border-base-300 bg-base-100/40 col-span-2 sm:col-span-1">
                      <span className="font-semibold">{githubData.following}</span>
                      <span className="text-gray-500 text-xs">Following</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* GitHub Contribution Graph */}
              <div className="mt-4 pt-4 border-t border-base-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-500" />
                    <h4 className="font-medium text-sm">Contribution Activity</h4>
                  </div>
                  <div
                    className="tooltip tooltip-left"
                    data-tip="Real-time contribution data from GitHub GraphQL API"
                  >
                    <Info size={14} className="text-gray-500" />
                  </div>
                </div>

                {/* GitHub Calendar - Full Width, No Scroll */}
                <div className="rounded-xl border border-base-300 overflow-hidden bg-base-100">
                  <div className="p-3 sm:p-4 overflow-hidden">
                    <style>{`
                      .github-calendar {
                        width: 100% !important;
                        max-width: 100% !important;
                        overflow: hidden !important;
                      }
                      .github-calendar svg {
                        width: 100% !important;
                        max-width: 100% !important;
                        height: auto !important;
                      }
                      .github-calendar > div {
                        overflow: hidden !important;
                      }
                      /* Hide the scrollbar from react-activity-calendar */
                      .react-activity-calendar__scroll-container {
                        overflow: hidden !important;
                        max-width: 100% !important;
                      }
                      .react-activity-calendar__scroll-container::-webkit-scrollbar {
                        display: none !important;
                      }
                      .react-activity-calendar__scroll-container {
                        -ms-overflow-style: none !important;
                        scrollbar-width: none !important;
                      }
                    `}</style>
                    <GitHubContributions 
                      username={githubData.login} 
                      compact={false}
                    />
                  </div>
                  {/* Small note and CTA */}
                  <div className="p-3 border-t border-base-300 text-center text-xs text-gray-500">
                    If you love my work, consider giving a star on <a href="https://github.com/priyanshuwq/Vibe-ChatApp" target="_blank" rel="noreferrer" className="underline">VibeChat</a>.
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              Failed to load GitHub profile.
            </div>
          )}
        </motion.div>

        {/* Coffee Support Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-base-200/50 dark:bg-base-200/30 backdrop-blur-lg border border-base-300 rounded-2xl p-4 sm:p-6 shadow-md flex flex-col items-center text-center space-y-3 sm:space-y-4"
        >
          {/* Coffee Animation */}
          {coffeeAnimation ? (
            <Lottie
              animationData={coffeeAnimation}
              loop={true}
              autoplay={true}
              style={{ width: 120, height: 120 }}
            />
          ) : (
            <div className="w-[120px] h-[120px] flex items-center justify-center">
              <div className="animate-pulse text-4xl">☕</div>
            </div>
          )}

          <h3 className="text-lg font-semibold">Support the Developer</h3>
          <p className="text-sm text-gray-500 max-w-md">
            If you enjoy using{" "}
            <span className="font-medium">Vibe Chat</span>, consider buying me a
            coffee.
          </p>

          <motion.a
            href="https://www.buymeacoffee.com/priyanshuo4"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-5 py-2 rounded-lg bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-medium shadow hover:shadow-lg transition"
          >
            Buy Me a Coffee
          </motion.a>
        </motion.div>

        {/* Footer credits - Moved to the bottom of the page */}
        <div className="text-center pt-3 mt-8 border-t border-base-300">
          <p className="text-sm">
            Design & Developed by{" "}
            <a
              href={`https://github.com/${GITHUB_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold hover:underline"
            >
              Priyanshu
            </a>
          </p>
          <div className="text-xs mt-1 opacity-70">
            © {new Date().getFullYear()}. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
