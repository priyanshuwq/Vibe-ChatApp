import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Props: isOpen (mobile), onToggle(): void
const Sidebar = ({ isOpen = true, onToggle = () => {} }) => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside
      className={`
        fixed sm:static inset-y-0 left-0 z-40 
        w-64 sm:w-72 
        flex flex-col bg-base-100 shadow-lg
        sm:border-r sm:border-base-300 sm:rounded-none
        rounded-r-2xl
        transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'}
      `}
    >
      {/* Sidebar Header */}
      <div className="border-b border-base-300 w-full px-5 py-4 flex items-center gap-3 justify-between rounded-tr-2xl sm:rounded-tr-none">
        <div className="flex items-center gap-3">
          <Users className="size-6 text-primary" />
          <span className="font-semibold hidden lg:block text-base-content text-lg">
            Contacts
          </span>
        </div>
        {/* Close Button (mobile only) */}
        <button
          className="sm:hidden block p-1 rounded-full hover:bg-base-200 transition"
          aria-label="Close contacts"
          onClick={onToggle}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Contact List */}
      <div className="overflow-y-auto w-full py-3 scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-base-200">
        <AnimatePresence>
          {users && users.length > 0 ? (
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
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/avatar.png";
                      }}
                    />
                    {isOnline && (
                      <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-base-100 animate-ping"></span>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex flex-col text-left min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-base-content truncate text-sm">
                        {user.fullName}
                      </span>
                      {user.isAdmin && (
                        <span className="flex items-center ml-1" title="Admin">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-yellow-400 drop-shadow">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
                          </svg>
                        </span>
                      )}
                    </div>
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
