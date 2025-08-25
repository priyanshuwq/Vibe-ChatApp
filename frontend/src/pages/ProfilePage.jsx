import { motion } from "framer-motion";
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Loader } from "lucide-react";

const ProfilePage = () => {
  const { authUser, updateProfilePic, isUpdatingProfile } = useAuthStore();
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    await updateProfilePic(selectedFile);
    setSelectedFile(null);
  };

  return (
    <motion.div
      className="flex justify-center items-center min-h-screen bg-base-200"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="card w-full max-w-md bg-base-100 shadow-2xl p-6">
        <h1 className="text-2xl font-bold text-center mb-4">Profile</h1>

        <div className="flex flex-col items-center gap-4">
          <img
            src={authUser?.profilePic || "/default-avatar.png"}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-primary shadow-lg object-cover"
          />

          <p className="text-sm text-gray-400">Max file size: 2MB</p>

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="file-input file-input-bordered w-full"
          />

          <button
            onClick={handleUpload}
            disabled={!selectedFile || isUpdatingProfile}
            className="btn btn-primary w-full mt-2"
          >
            {isUpdatingProfile ? (
              <Loader className="animate-spin size-5" />
            ) : (
              "Upload Profile Picture"
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
