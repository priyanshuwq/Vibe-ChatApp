import { motion } from "framer-motion";
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Loader } from "lucide-react";

const SettingsPage = () => {
  const { authUser, updateAccountInfo, isUpdatingProfile } = useAuthStore();
  const [fullName, setFullName] = useState(authUser?.fullName || "");
  const [email, setEmail] = useState(authUser?.email || "");

  const handleSave = async () => {
    if (!fullName || !email) return;
    await updateAccountInfo({ fullName, email });
  };

  return (
    <motion.div
      className="flex justify-center items-center min-h-screen bg-base-200"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="card w-full max-w-xl bg-base-100 shadow-2xl p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          Account Settings
        </h1>

        {/* Editable Info */}
        <div className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div>
            <label className="label">Email Address</label>
            <input
              type="email"
              className="input input-bordered w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            onClick={handleSave}
            disabled={isUpdatingProfile}
            className="btn btn-primary w-full"
          >
            {isUpdatingProfile ? (
              <Loader className="animate-spin size-5" />
            ) : (
              "Save Changes"
            )}
          </button>
        </div>

        {/* Account Info */}
        <div className="divider">Account Information</div>
        <div className="space-y-2 text-gray-600 text-sm">
          <p>
            <strong>Member Since:</strong>{" "}
            {new Date(authUser?.createdAt).toDateString()}
          </p>
          <p>
            <strong>Account Status:</strong> Active
          </p>
          <p>
            <strong>User ID:</strong> {authUser?._id}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsPage;
