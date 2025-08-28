import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } =
    useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-300 bg-base-100 shadow-lg">
      {/* Sidebar Header */}
      <div className="border-b border-base-300 w-full px-5 py-4 flex items-center gap-3">
        <Users className="size-6 text-primary" />
        <span className="font-semibold hidden lg:block text-base-content text-lg">
          Contacts
        </span>
      </div>

      {/* Contact List */}
      <div className="overflow-y-auto w-full py-3 scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-base-200">
        <AnimatePresence>
          {users.length > 0 ? (
            users.map((user) => {
              const isOnline = onlineUsers.includes(user._id);
              return (
                <motion.button
                  key={user._id}
                  onClick={() => setSelectedUser(user)}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`w-full p-3 flex items-center gap-3 rounded-xl transition-all duration-300 relative overflow-hidden
  ${
    selectedUser?._id === user._id
      ? "bg-primary/15 shadow-md scale-[1.02] before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-primary before:rounded-r-md before:shadow-[0_0_10px_rgba(139,92,246,0.7)]"
      : "hover:bg-base-200 hover:shadow-sm"
  }`}
                >
                  {/* Profile Image */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={user.profilePic || "/avatar.png"}
                      alt={user.fullName}
                      className="size-12 object-cover rounded-full border border-base-300"
                    />
                    {isOnline && (
                      <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-base-100 animate-ping"></span>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="hidden lg:flex flex-col text-left min-w-0">
                    <span className="font-medium text-base-content truncate text-sm">
                      {user.fullName}
                    </span>
                    <span
                      className={`text-xs truncate ${
                        isOnline ? "text-green-500" : "text-zinc-400"
                      }`}
                    >
                      {isOnline ? "Online" : "Last seen recently"}
                    </span>
                  </div>
                </motion.button>
              );
            })
          ) : (
            <div className="text-center text-zinc-500 py-6 text-sm">
              No contacts available
            </div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
};

export default Sidebar;
