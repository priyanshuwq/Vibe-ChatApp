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
        w-[85vw] sm:w-72 max-w-sm
        flex flex-col bg-base-100 shadow-2xl
        sm:border-r sm:border-base-300 sm:rounded-none
        m-0 sm:m-0
        sm:mt-0 sm:mb-0 sm:ml-0
        rounded-r-3xl sm:rounded-r-none
        transform transition-all duration-500 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'}
      `}
      style={{
        top: isOpen ? '5rem' : '0',
        bottom: isOpen ? '2rem' : '0',
        height: isOpen ? 'calc(100vh - 7rem)' : '100%',
      }}
    >
      {/* Sidebar Header */}
      <div className="border-b border-base-300 w-full px-5 py-4 flex items-center gap-3 justify-between rounded-tr-3xl sm:rounded-tr-none bg-base-100">
        <div className="flex items-center gap-3">
          <Users className="size-6 text-gray-900 dark:text-gray-100" />
          <span className="font-semibold hidden lg:block text-base-content text-lg">
            Contacts
          </span>
        </div>
        {/* Close Button (mobile only) */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="sm:hidden block p-2 rounded-full hover:bg-base-200 transition-all duration-200"
          aria-label="Close contacts"
          onClick={onToggle}
        >
          <X className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Contact List */}
      <div className="overflow-y-auto w-full py-3 px-2 scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-base-200 flex-1">
        <AnimatePresence>
          {users && users.length > 0 ? (
            users.map((user) => {
              const isOnline = onlineUsers.includes(user._id);
              return (
                <motion.button
                  key={user._id}
                  onClick={() => {
                    setSelectedUser(user);
                    if (window.innerWidth < 640) {
                      onToggle();
                    }
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full p-3 flex items-center gap-3 rounded-xl transition-all duration-300 relative overflow-hidden mb-2
  ${
    selectedUser?._id === user._id
      ? "bg-gray-900/10 dark:bg-gray-100/10 shadow-md scale-[1.02] before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-gray-900 dark:before:bg-gray-100 before:rounded-r-md before:shadow-[0_0_10px_rgba(0,0,0,0.3)]"
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
                      <span className="font-medium text-base-content truncate text-sm flex items-center gap-1">
                        {user.fullName}
                        {(user.isAdmin === true || user.isAdmin === 'true') && (
                          <span
                            className="px-1.5 py-0.5 rounded-full bg-black text-white border border-yellow-400 text-[10px] font-semibold ml-1 admin-badge-shine"
                            style={{ fontSize: '0.75em', lineHeight: '1.1', position: 'relative', overflow: 'hidden' }}
                            title="Admin"
                          >
                            Admin
                          </span>
                        )}
                      </span>
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
