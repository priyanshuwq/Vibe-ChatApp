import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext.jsx";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  return (
    <motion.button
      onClick={toggleTheme}
      whileTap={{ scale: 0.9 }}
      className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer shadow-md border transition-colors duration-300 ${
        isDark
          ? "bg-gray-800 border-gray-600 justify-end"
          : "bg-yellow-300 border-yellow-400 justify-start"
      }`}
    >
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="w-6 h-6 flex items-center justify-center rounded-full bg-white shadow-md"
      >
        {isDark ? (
          <Moon className="w-4 h-4 text-indigo-500" />
        ) : (
          <Sun className="w-4 h-4 text-yellow-500" />
        )}
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
