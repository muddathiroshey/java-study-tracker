'use client';

import { useApp } from '../context/AppContext';

export default function TopAppBar({ 
  title, 
  currentDate, 
  user,
  searchQuery,
  setSearchQuery
}) {
  const { mobileSidebarOpen, setMobileSidebarOpen } = useApp();
  const isAdmin = user?.username?.toLowerCase() === 'muddathiradmin' || user?.isAdmin === true;

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 bg-surface border-b border-outline-variant z-30 flex items-center justify-between px-lg select-none">
      {/* Title / Module Name */}
      <div className="flex items-center gap-sm">
        <div className="flex flex-col">
          <h2 className="font-title-md text-title-md font-bold text-primary">{title}</h2>
          <span className="font-caption text-caption text-on-surface-variant">
            {isAdmin ? 'System Administrator Portal' : 'Java OOP Mastery Curriculum'}
          </span>
        </div>
      </div>

      {/* Center/Search and Stats */}
      <div className="flex items-center gap-xl">
        {/* Date / Status Badges */}
        <div className="flex items-center gap-md">
          {/* Calendar Display */}
          <div className="flex items-center gap-2 bg-primary-fixed text-on-primary-fixed-variant px-3 py-1 rounded-full text-caption font-semibold border border-primary-fixed-dim/30">
            <span className="material-symbols-outlined text-[16px]">calendar_month</span>
            <span>
              {user?.settings?.openAvailability 
                ? 'Open Access (Unlocked)' 
                : `Active Date: ${currentDate}`}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
