import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Props: isOpen (mobile), onToggle(): void
const Sidebar = ({ isOpen = true, onToggle = () => {} }) => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // Filter users based on search query
  const filteredUsers = users.filter((user) =>
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside
      className={`
        absolute md:static left-0 top-0 bottom-0 z-40 
          w-[280px] md:w-72 max-w-[280px]
        flex flex-col bg-base-100 shadow-2xl min-h-0 h-full md:h-full
        md:border-r md:border-base-300 md:rounded-none
        rounded-r-3xl md:rounded-r-none
        transform transition-all duration-500 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}
    >
      {/* Sidebar Header */}
      <div className="border-b border-base-300 w-full px-3 sm:px-4 py-3 rounded-tr-3xl md:rounded-tr-none bg-base-100 flex-shrink-0">
        {/* Header Row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <Users className="size-5 sm:size-6 text-gray-900 dark:text-gray-100 flex-shrink-0" />
            <span className="font-semibold text-base-content text-base sm:text-lg whitespace-nowrap">
              Contacts
            </span>

            {/* Expandable Search Bar */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {!isSearchExpanded ? (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsSearchExpanded(true)}
                  className="p-1.5 sm:p-2 rounded-full hover:bg-base-200 transition-all duration-200"
                  aria-label="Search contacts"
                >
                  <Search className="size-4 sm:size-5 text-base-content/60" />
                </motion.button>
              ) : (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "100%", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="relative flex-1"
                >
                  <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 size-4 text-base-content/50 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="w-full pl-8 pr-8 py-1.5 text-sm bg-base-200 border border-base-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 placeholder:text-base-content/40 text-base-content"
                  />
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setIsSearchExpanded(false);
                    }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-base-300 rounded-full transition-colors duration-200"
                    aria-label="Close search"
                  >
                    <X className="size-3.5 text-base-content/60 hover:text-base-content" />
                  </button>
                </motion.div>
              )}
            </div>
          </div>

          {/* Close Button (mobile only) */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="md:hidden block p-1.5 rounded-full hover:bg-base-200 transition-all duration-200 flex-shrink-0"
            aria-label="Close contacts"
            onClick={onToggle}
            style={{ touchAction: 'manipulation' }}
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

  {/* Contact List */}
  <div className="overflow-y-auto overscroll-contain w-full py-3 px-2 scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-base-200 flex-1 min-h-0">
        <AnimatePresence>
          {filteredUsers && filteredUsers.length > 0 ? (
            filteredUsers.map((user) => {
              const isOnline = onlineUsers.includes(user._id);
              return (
                <motion.button
                  key={user._id}
                  onClick={() => {
                    setSelectedUser(user);
                    if (window.innerWidth < 768) {
                      onToggle();
                    }
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ touchAction: 'manipulation' }}
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
          ) : searchQuery ? (
            <div className="text-center text-zinc-500 py-6 px-4 text-sm">
              <p className="font-medium">No contacts found</p>
              <p className="text-xs mt-1 text-zinc-400">
                Try searching with a different name
              </p>
            </div>
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
