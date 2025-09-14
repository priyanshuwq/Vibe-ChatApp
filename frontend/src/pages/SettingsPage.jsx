import { motion } from "framer-motion";
import { useAuthStore } from "../store/useAuthStore";
import ThemeToggle from "../components/ThemeToggle";
import { useState } from "react";
import toast from "react-hot-toast";

const SettingsPage = () => {
  const { authUser, updateProfile } = useAuthStore();
  const [preview, setPreview] = useState(authUser?.profilePic);
  const [loading, setLoading] = useState(false);

  //  Handle file change and convert to base64
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // only allow image types
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      const base64Image = reader.result;
      setPreview(base64Image);
      handleUpload(base64Image); // auto-upload after selecting
    };
  };

  // Upload base64 to backend
  const handleUpload = async (base64Image) => {
    try {
      setLoading(true);
      await updateProfile({ profilePic: base64Image });
      // toast.success("Profile updated!");
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen pt-24 px-4 flex justify-center">
      <div className="w-full max-w-3xl space-y-6">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-2xl font-bold text-center bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent"
        >
          Account Settings
        </motion.h2>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-base-200/50 dark:bg-base-200/30 backdrop-blur-lg border border-base-300 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6 shadow-md"
        >
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <img
              src={
                preview ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="Profile"
              className="w-24 h-24 rounded-full border-2 border-primary object-cover shadow"
            />

            {/* Hidden file input */}
            <input
              type="file"
              id="file-upload"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="file-upload"
              className="px-4 py-1 text-sm bg-base-300 rounded-lg cursor-pointer hover:bg-base-100 transition"
            >
              Change Photo
            </label>

            {loading && <p className="text-xs text-gray-500">Uploading...</p>}
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <h3 className="text-lg font-semibold">{authUser?.fullName}</h3>
            <p className="text-sm text-gray-500">{authUser?.email}</p>

            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 rounded-lg border border-base-300 bg-base-100/40">
                <p className="text-gray-500">Member Since</p>
                <p className="font-medium">
                  {new Date(authUser?.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="p-3 rounded-lg border border-base-300 bg-base-100/40">
                <p className="text-gray-500">Status</p>
                <p className="font-medium text-green-500">Active</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Theme Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-base-200/50 dark:bg-base-200/30 backdrop-blur-lg border border-base-300 rounded-2xl p-6 flex items-center justify-between shadow-md"
        >
          <div>
            <h3 className="text-md font-semibold">Appearance</h3>
            <p className="text-sm text-gray-500">
              Switch between light and dark themes.
            </p>
          </div>
          <ThemeToggle />
        </motion.div>
        {/* Coffee Support Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-base-200/50 dark:bg-base-200/30 backdrop-blur-lg border border-base-300 rounded-2xl p-6 shadow-md flex flex-col items-center text-center space-y-4"
        >
          {/* Coffee Icon with steam */}
          <motion.div
            className="relative"
            animate={{ y: [0, -2, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <div className="w-12 h-12 bg-yellow-500 rounded-b-xl relative shadow">
              <div className="absolute -right-3 top-2 w-4 h-6 border-4 border-yellow-500 rounded-full"></div>
            </div>
            {/* Steam */}
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex flex-col gap-1">
              {[...Array(3)].map((_, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: [0, 1, 0], y: [-5, -15, -25] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.5,
                  }}
                  className="w-2 h-6 mx-auto rounded-full bg-white/40"
                />
              ))}
            </div>
          </motion.div>

          <h3 className="text-lg font-semibold">Support the Developer</h3>
          <p className="text-sm text-gray-500 max-w-md">
            If you enjoy using <span className="font-medium">Vibe Chat</span>,
            consider buying me a coffee ☕. Your support helps improve this
            project 🚀
          </p>

          <motion.a
            href="https://www.buymeacoffee.com/priyanshuo4"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-5 py-2 rounded-lg bg-primary text-white font-medium shadow hover:shadow-lg transition"
          >
            Buy Me a Coffee
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsPage;
