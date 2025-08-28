import { motion } from "framer-motion";
import { useThemeStore } from "../store/useThemeStore";
import { Moon, Sun } from "lucide-react";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === "dark";

  return (
    <motion.button
      onClick={toggleTheme}
      initial={false}
      animate={{ backgroundColor: isDark ? "#1f2937" : "#f3f4f6" }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-between w-16 h-8 rounded-full px-1 shadow-md border border-base-300 relative"
    >
      {/* Sliding Knob */}
      <motion.div
        className="absolute w-6 h-6 bg-white rounded-full shadow-md"
        layout
        transition={{
          type: "spring",
          stiffness: 700,
          damping: 30,
        }}
        style={{
          left: isDark ? "36px" : "2px",
        }}
      />

      {/* Icons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isDark ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <Moon className="size-4 text-yellow-400" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isDark ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      >
        <Sun className="size-4 text-yellow-500" />
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
