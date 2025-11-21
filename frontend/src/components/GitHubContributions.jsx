// frontend/src/components/GitHubContributions.jsx
import React, { useEffect, useRef, useState } from "react";
import { GitHubCalendar } from "react-github-calendar";   
import { motion } from "framer-motion";

export default function GitHubContributions({
  username,
  className = "",
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
      setScale(containerWidth / actualWidth);
    } else {
      setScale(1);
    }
  };

  useEffect(() => {
    if (!calendarRef.current) return;

    const ro = new ResizeObserver(() => updateScale());
    ro.observe(calendarRef.current);

    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  /** EXACT GitHub Color Palette */
  const githubTheme = {
    light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
    dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden ${className}`}
    >
      {/* Hides scroll container */}
      <style>{`
        .react-activity-calendar__scroll-container {
          overflow: hidden !important;
        }
      `}</style>

      <motion.div
        className="w-full flex justify-center"
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
            hideColorLegend={true}  
            showWeekdayLabels={true}
            weekStart={0}           
            onLoad={updateScale}
          />
        </div>
      </motion.div>
    </div>
  );
}
