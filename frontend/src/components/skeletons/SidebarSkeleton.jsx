import React from "react";

const SidebarSkeleton = () => {
  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-300 bg-base-100 shadow-lg">
      {/* Sidebar Header Skeleton */}
      <div className="border-b border-base-300 w-full px-5 py-4 flex items-center gap-3">
        <div className="bg-base-300 animate-pulse w-6 h-6 rounded-md"></div>
        <div className="hidden lg:block bg-base-300 animate-pulse w-24 h-6 rounded-md"></div>
      </div>

      {/* Contact List Skeleton */}
      <div className="overflow-y-auto w-full py-3 flex-1 px-3">
        {Array(5)
          .fill(0)
          .map((_, idx) => (
            <div
              key={idx}
              className="w-full p-3 flex items-center gap-3 mb-3 animate-pulse"
            >
              {/* Avatar Skeleton */}
              <div className="size-12 rounded-full bg-base-300"></div>

              {/* User Info Skeleton */}
              <div className="hidden lg:flex flex-col flex-1 gap-2">
                <div className="w-24 h-4 bg-base-300 rounded"></div>
                <div className="w-16 h-3 bg-base-300 rounded"></div>
              </div>
            </div>
          ))}
      </div>
    </aside>
  );
};

export default SidebarSkeleton;
