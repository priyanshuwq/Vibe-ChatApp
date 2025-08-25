import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Import login function from store
  const { login } = useAuthStore();

  // ✅ Handle Login Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ Pass email & password as an OBJECT
      await login({ email, password });

      // ✅ Redirect to homepage on success
      window.location.href = "/";
    } catch (error) {
      console.error("Login failed:", error);
      alert(error.response?.data?.message || "Invalid email or password!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black items-center justify-center px-4 relative">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(88,28,135,0.2),transparent_60%)] pointer-events-none"></div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 items-center gap-10 z-10">
        {/* Left Section - Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-base-100/10 backdrop-blur-2xl shadow-xl rounded-2xl p-8 sm:p-10 border border-gray-700"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-center bg-gradient-to-r from-purple-400 via-blue-400 to-purple-600 bg-clip-text text-transparent">
            Welcome Back.
          </h1>
          <p className="mt-2 text-gray-400 text-center">
            Sign in to your account and start chatting!
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {/* Email */}
            <div>
              <label className="block text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="priyanshu@gmail.com"
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-300 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
              />
            </div>

            {/* Sign In Button */}
            <motion.button
              type="submit"
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              className="w-full py-3 text-lg font-semibold rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 hover:opacity-90 transition shadow-lg"
            >
              {loading ? "Signing In..." : "Sign In"}
            </motion.button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-gray-400 mt-5">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-purple-400 hover:underline">
              Create one
            </Link>
          </p>
        </motion.div>

        {/* Right Section - Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:flex items-center justify-center"
        >
          <motion.img
            src="/chat-illustration.svg"
            alt="Chat Illustration"
            draggable="false"
            className="max-w-md"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </div>
  );
}
