import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff } from "lucide-react";
import Lottie from "lottie-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [chatAnim, setChatAnim] = useState(null);

  const { login, isLoggingIn } = useAuthStore();

  // rotating heading texts
  const texts = ["Welcome to Vibe Chat.", "Let's Connect.", "Start Messaging."];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    fetch("/Chat.json")
      .then((res) => res.json())
      .then((data) => setChatAnim(data))
      .catch((err) => console.log("Animation loading error:", err));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    await login({ email, password });
  };

  // Force dark mode on mount, restore previous theme on unmount
  useEffect(() => {
    const html = document.documentElement;
    const prevTheme = html.getAttribute("data-theme");
    html.setAttribute("data-theme", "dark");
    return () => {
      if (prevTheme && prevTheme !== "dark") {
        html.setAttribute("data-theme", prevTheme);
      } else {
        html.removeAttribute("data-theme");
      }
    };
  }, []);

  return (
    <div
      data-theme="dark"
      className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/wallpaper.jpg')" }}
      ></div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/90"></div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-md w-full space-y-8"
      >
        <div className="text-center">
          {chatAnim && (
            <div className="mx-auto w-32 h-32">
              <Lottie animationData={chatAnim} loop={true} />
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.h2
              key={texts[index]}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.8 }}
              className="mb-5 font-bold text-3xl drop-shadow-lg text-gray-200"
            >
              {texts[index]}
            </motion.h2>
          </AnimatePresence>

          <p className="mt-4 text-sm text-gray-300">
            Sign in to your account and start chatting!
          </p>
        </div>

        <motion.form
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mt-8 space-y-6 backdrop-blur-3xl backdrop-saturate-200 p-8 rounded-2xl shadow-2xl border border-white/20"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(50px) saturate(200%)',
            WebkitBackdropFilter: 'blur(50px) saturate(200%)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
          }}
          onSubmit={handleSubmit}
        >
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered w-full bg-white/10 backdrop-blur-lg text-white border-white/20 focus:border-white/40 focus:outline-none placeholder:text-gray-400 transition-all"
              placeholder="example@gmail.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered w-full pr-12 bg-white/10 backdrop-blur-lg text-white border-white/20 focus:border-white/40 focus:outline-none placeholder:text-gray-400 transition-all"
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-200 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <motion.button
            type="submit"
            disabled={isLoggingIn}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 px-4 text-white font-semibold rounded-lg bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/15 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {isLoggingIn ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Sign In"
            )}
          </motion.button>

          <div className="text-center">
            <span className="text-sm text-gray-400">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-gray-300 font-medium hover:underline transition-colors"
              >
                Create one
              </Link>
            </span>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
}
