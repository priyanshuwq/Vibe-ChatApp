import { motion } from "framer-motion";
import { useThemeStore } from "../store/useThemeStore";
import { Moon, Sun } from "lucide-react";

// Touch button theme toggle with smooth animation
const ThemeToggle = () => {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === "dark";

  return (
    <motion.button
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      onClick={toggleTheme}
      whileTap={{ scale: 0.92 }}
      initial={false}
      animate={{
        backgroundColor: isDark ? "#111827" : "#F3F4F6",
        borderColor: isDark ? "#374151" : "#E5E7EB",
      }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="relative inline-flex items-center justify-center w-10 h-10 sm:w-9 sm:h-9 rounded-full border shadow-md overflow-hidden"
    >
      {/* Soft glow */}
      <motion.span
        className="absolute inset-0 pointer-events-none rounded-full"
        animate={{
          boxShadow: isDark
            ? "0 0 24px rgba(59,130,246,0.35) inset, 0 0 10px rgba(59,130,246,0.25)"
            : "0 0 24px rgba(251,191,36,0.35) inset, 0 0 10px rgba(251,191,36,0.25)",
          opacity: 0.65,
        }}
        transition={{ duration: 0.4 }}
      />

      {/* Icon with smooth rotate/crossfade */}
      <motion.div
        key={isDark ? "moon" : "sun"}
        initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
        className="flex items-center justify-center"
      >
        {isDark ? (
          <Moon className="w-5 h-5 text-blue-400" />
        ) : (
          <Sun className="w-5 h-5 text-yellow-500" />
        )}
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
