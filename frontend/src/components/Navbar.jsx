import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import ThemeToggle from "./ThemeToggle";
import { LogOut, Settings, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  // Hide ThemeToggle & Settings on login and signup pages
  const hideUI = ["/login", "/signup"].includes(location.pathname);

  // Default Avatar if user hasn't uploaded one
  const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  return (
    <header className="bg-base-200/30 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-sm">
      <div className="container mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
        {/* Logo + Brand Name */}
        <Link
          to="/"
          className="flex items-center gap-1 sm:gap-1.5 hover:opacity-80 transition-all"
        >
          {/* Animated Logo */}
          <motion.div
            initial={{ rotate: -10, scale: 0.8, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-primary/10 p-1.5 sm:p-2 rounded-xl shadow-md"
          >
            <MessageSquare className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
          </motion.div>

          {/* Brand Name */}
          <motion.h1
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-lg sm:text-xl font-extrabold tracking-wide text-primary"
          >
            Vibe Chat
          </motion.h1>
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Dark Mode Toggle → hidden on login & signup */}
          {!hideUI && <ThemeToggle />}

          {/* Profile Image (non-interactive) */}
          {authUser && (
            <div className="relative group">
              <motion.img
                src={authUser.profilePic || defaultAvatar}
                alt="User Avatar"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-primary shadow-md"
              />
              <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-base-300 text-[10px] sm:text-xs text-base-content px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg whitespace-nowrap">
                {authUser.fullName || "My Profile"}
              </span>
            </div>
          )}

          {/* Settings Icon → hidden on login & signup */}
          {!hideUI && (
            <Link
              to="/settings"
              className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-base-200 border border-base-300 hover:bg-base-300 hover:scale-110 transition-all shadow-md"
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </Link>
          )}

          {/* Logout Button */}
          {authUser && (
            <>
              {/* Desktop Logout */}
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="hidden sm:flex btn btn-sm btn-error gap-2 hover:scale-105 transition-transform"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>

              {/* Mobile Logout Icon */}
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="sm:hidden flex items-center justify-center w-9 h-9 rounded-full bg-error text-white hover:bg-red-600 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
