import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import ThemeToggle from "./ThemeToggle";
import { LogOut, Settings, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const location = useLocation();

  // Hide settings on login and signup pages
  const hideSettings = ["/login", "/signup"].includes(location.pathname);

  // Default Avatar if user hasn't uploaded one
  const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  return (
    <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg shadow-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo + Brand Name */}
        <Link
          to="/"
          className="flex items-center gap-3 hover:opacity-80 transition-all"
        >
          {/* Animated Logo */}
          <motion.div
            initial={{ rotate: -10, scale: 0.8, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-primary/10 p-2 rounded-xl shadow-md"
          >
            <MessageSquare className="w-7 h-7 text-primary" />
          </motion.div>

          {/* Brand Name */}
          <motion.h1
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-xl font-extrabold tracking-wide text-primary"
          >
            Vibe Chat
          </motion.h1>
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Dark Mode Toggle */}
          <ThemeToggle />

          {/* Profile Image */}
          {authUser && (
            <Link to="/profile" className="relative group">
              <motion.img
                src={authUser.profilePic || defaultAvatar}
                alt="User Avatar"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="w-10 h-10 rounded-full border-2 border-primary shadow-md cursor-pointer hover:scale-110 transition-transform"
              />
              {/* Tooltip for Profile */}
              <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-base-300 text-xs text-base-content px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg">
                {authUser.fullName || "My Profile"}
              </span>
            </Link>
          )}

          {/* Settings Icon → hidden on login & signup */}
          {!hideSettings && (
            <Link
              to="/settings"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-base-200 border border-base-300 hover:bg-base-300 hover:scale-110 transition-all shadow-md"
            >
              <Settings className="w-5 h-5 text-primary" />
            </Link>
          )}

          {/* Logout Button */}
          {authUser && (
            <button
              onClick={logout}
              className="btn btn-sm btn-error gap-2 hover:scale-105 transition-transform"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
