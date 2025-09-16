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

  const { login } = useAuthStore();

  // rotating heading texts
  const texts = ["Welcome to Vibe Chat.", "Let’s Connect.", "Start Messaging."];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    fetch("/Chat.json")
      .then((res) => res.json())
      .then((data) => setChatAnim(data));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ email, password });
      window.location.href = "/";
    } catch (error) {
      alert(error.response?.data?.message || "Invalid email or password!");
    } finally {
      setLoading(false);
    }
  };

  return (
    //  Force dark theme for login only
    <div
      data-theme="dark"
      className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/wallpaper.jpg')" }}
      ></div>

      {/* Dark overlay (no light mode fallback) */}
      <div className="absolute inset-0 bg-black/85"></div>

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
              className="mb-5 font-bold text-3xl drop-shadow-lg text-indigo-400"
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
          className="mt-8 space-y-6 bg-gray-900/95 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-gray-700"
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
              className="input input-bordered w-full bg-gray-800 text-white border-gray-600"
              placeholder="example@gmail.com"
              required
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
              className="input input-bordered w-full pr-12 bg-gray-800 text-white border-gray-600"
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-200"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn btn-primary w-full text-white font-semibold bg-gradient-to-r from-indigo-600 to-indigo-700 border-none hover:from-indigo-700 hover:to-indigo-800"
          >
            {loading ? (
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
                className="text-indigo-400 font-medium hover:underline transition-colors"
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
