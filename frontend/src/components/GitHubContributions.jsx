// frontend/src/components/GitHubContributions.jsx
import React, { useEffect, useRef, useState } from "react";
import { GitHubCalendar } from "react-github-calendar";   
import { motion } from "framer-motion";

export default function GitHubContributions({
  username,
  className = "",
  totalContributions,
}) {
  const containerRef = useRef(null);
  const calendarRef = useRef(null);

  const [scale, setScale] = useState(1);
  const [theme, setTheme] = useState(
    typeof document !== "undefined"
      ? document.documentElement.getAttribute("data-theme") || "light"
      : "light"
  );

  // Detect theme changes
  useEffect(() => {
    const html = document.documentElement;
    const obs = new MutationObserver(() => {
      setTheme(html.getAttribute("data-theme") || "light");
    });

    obs.observe(html, { attributes: true });
    return () => obs.disconnect();
  }, []);

  /** --- SCALE LOGIC (perfect fit like GitHub) --- */
  const updateScale = () => {
    if (!containerRef.current || !calendarRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const actualWidth = calendarRef.current.scrollWidth;

    if (actualWidth > containerWidth) {
      const newScale = containerWidth / actualWidth;
      setScale(Math.max(newScale, 0.5)); // Minimum scale of 0.5 for readability
    } else {
      setScale(1);
    }
  };

  useEffect(() => {
    if (!calendarRef.current) return;

    // Initial scale calculation
    setTimeout(() => updateScale(), 100);

    const ro = new ResizeObserver(() => updateScale());
    ro.observe(calendarRef.current);

    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    window.addEventListener("resize", updateScale);
    // Trigger on mount
    updateScale();
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  /** EXACT GitHub Color Palette */
  const githubTheme = {
    light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
    dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
  };

  // Keep only the most recent 365 days so it matches GitHub's "last year" view
  const transformData = (contributions) => {
    if (!Array.isArray(contributions) || contributions.length === 0) return contributions;

    const sorted = [...contributions].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    const endDate = new Date(sorted[sorted.length - 1].date);
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 364); // 365-day window

    return sorted.filter((day) => {
      const d = new Date(day.date);
      return d >= startDate && d <= endDate;
    });
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-x-auto overflow-y-hidden ${className}`}
    >
      {/* Hides scroll container and contribution count + responsive styling */}
      <style>{`
        .react-activity-calendar__scroll-container {
          overflow-x: auto !important;
          overflow-y: hidden !important;
          -webkit-overflow-scrolling: touch;
        }
        .react-activity-calendar__count {
          display: none !important;
        }
        /* Style the footer to match the desired layout */
        .react-activity-calendar__footer {
          display: flex !important;
          flex-wrap: wrap !important;
          align-items: center !important;
          gap: 4px 16px !important;
          white-space: nowrap !important;
          margin-left: 34px !important;
        }
        .contribution-total {
          margin-right: auto;
          font-weight: normal;
          color: currentColor;
        }
        /* Hide scrollbar but keep functionality */
        .react-activity-calendar__scroll-container::-webkit-scrollbar {
          display: none;
        }
        .react-activity-calendar__scroll-container {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        /* Responsive font sizes */
        @media (max-width: 640px) {
          .react-activity-calendar text {
            font-size: 10px !important;
          }
        }
        /* Smooth transitions */
        .react-activity-calendar {
          transition: transform 0.2s ease-in-out;
        }
      `}</style>
      {totalContributions && (
        <style>{`
          .react-activity-calendar__footer::before {
            content: "Total: ${totalContributions} contributions";
            margin-right: auto;
            font-weight: normal;
            color: currentColor;
          }
        `}</style>
      )}

      <motion.div
        className="w-full overflow-hidden"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div
          ref={calendarRef}
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            width: scale < 1 ? `${100 / scale}%` : "100%",
            height: scale < 1 ? `${100 / scale}%` : "100%",
          }}
        >
          <GitHubCalendar
            username={username}
            theme={githubTheme}
            colorScheme={theme === "dark" ? "dark" : "light"}
            blockSize={11}          
            blockMargin={2}         
            fontSize={12}           
            hideMonthLabels={false}
            hideColorLegend={false}  
            hideTotalCount={true}
            showWeekdayLabels={true}
            weekStart={0}
            transformData={transformData}
            onLoad={updateScale}
          />
        </div>
      </motion.div>
    </div>
  );
}
