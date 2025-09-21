import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff } from "lucide-react";
import Lottie from "lottie-react";
import { useGoogleLogin } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios"; // Add this import

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [chatAnim, setChatAnim] = useState(null);

  const { login, googleLogin } = useAuthStore();

  // rotating heading texts
  const texts = ["Welcome to Vibe Chat.", "Let's Connect.", "Start Messaging."];
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

  // Google login handler
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        // Use the imported axios directly
        const googleAuthResponse = await axios.post("/api/auth/google", {
          access_token: response.access_token,
        });

        // Store the token and user info
        if (googleAuthResponse.data.token) {
          localStorage.setItem("token", googleAuthResponse.data.token);
          // Update auth store
          googleLogin(googleAuthResponse.data);
          window.location.href = "/";
        }
      } catch (error) {
        console.error("Google login error:", error);
        alert(
          "Google login failed: " +
            (error.response?.data?.message || error.message)
        );
      }
    },
    onError: (error) => {
      console.error("Google OAuth error:", error);
      alert("Google login failed. Please try again.");
    },
  });

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
    <GoogleOAuthProvider clientId="615843781614-h4ajfhm419b04qdq98h42jf49mqlvsi4.apps.googleusercontent.com">
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

            {/* <div className="relative flex items-center justify-center">
              <div className="h-px flex-1 bg-gray-700"></div>
              <span className="px-4 text-sm text-gray-400">or</span>
              <div className="h-px flex-1 bg-gray-700"></div>
            </div> */}

            {/* <motion.button
              type="button"
              onClick={() => handleGoogleLogin()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn w-full bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 flex items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 48 48"
                className="shrink-0"
              >
                <path
                  fill="#FFC107"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                />
                <path
                  fill="#4CAF50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                />
              </svg>
              Continue with Google
            </motion.button> */}

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
    </GoogleOAuthProvider>
  );
}
