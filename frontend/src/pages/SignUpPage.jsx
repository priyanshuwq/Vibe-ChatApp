import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

export default function SignUpPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { signup } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      await signup({ fullName, email, password });
      window.location.href = "/";
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/wallpaper.jpg')" }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-white/65 dark:bg-black/85"></div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-md w-full space-y-8"
      >
        <div className="text-center">
          <h2 className="mb-3 text-indigo-600 dark:text-indigo-400 font-bold text-3xl">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-base-content/70">
            Join Vibe Chat and start connecting!
          </p>
        </div>

        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 bg-base-100/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-base-300/40"
        >
          <div>
            <label className="block text-sm font-medium text-base-content mb-2">
              Full Name
            </label>
            <input
              type="text"
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              required
              className="input input-bordered w-full bg-base-100/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-base-content mb-2">
              Email
            </label>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              required
              className="input input-bordered w-full bg-base-100/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-base-content mb-2">
              Password
            </label>
            <input
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="input input-bordered w-full bg-base-100/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-base-content mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              autoComplete="current-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="input input-bordered w-full bg-base-100/50"
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn btn-primary w-full text-white font-semibold bg-gradient-to-r from-indigo-600 to-indigo-700 border-none hover:from-indigo-700 hover:to-indigo-800"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </motion.button>

          <div className="text-center">
            <span className="text-sm text-base-content/70">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline transition-colors"
              >
                Sign in
              </Link>
            </span>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
}
