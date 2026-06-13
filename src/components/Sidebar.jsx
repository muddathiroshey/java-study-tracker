'use client';

import { useApp } from '../context/AppContext';
import { getLocalDateString } from '../lib/dateUtils';

// Material Symbols used via className="material-symbols-outlined"

export default function Sidebar({ 
  user, 
  activeTab, 
  setActiveTab, 
  overallProgress, 
  isDarkTheme, 
  toggleTheme, 
  onLogout,
  userPoints = 0
}) {
  const { mobileSidebarOpen, setMobileSidebarOpen } = useApp();
  const isAdmin = user?.username?.toLowerCase() === 'muddathiradmin' || user?.isAdmin === true;
  
  const todayStr = getLocalDateString(user);
  const isStreakActive = user?.lastActiveDate === todayStr;

  const menuItems = [
    { id: 'dashboard', name: 'Daily Lessons', icon: 'calendar_today' },
    { id: 'leaderboard', name: 'Leaderboard', icon: 'leaderboard' },
    { id: 'resources', name: 'Resources', icon: 'menu_book' },
    { id: 'settings', name: 'Settings', icon: 'settings' },
  ];

  if (isAdmin) {
    menuItems.push({ id: 'admin', name: 'Admin Panel', icon: 'shield' });
  }

  // Hash code helper for classmate avatar colors to stay stable and unique
  const colors = [
    "from-purple-500 to-indigo-500",
    "from-pink-500 to-rose-500",
    "from-emerald-500 to-teal-500",
    "from-blue-500 to-indigo-500",
    "from-cyan-500 to-blue-500",
    "from-amber-500 to-orange-500"
  ];
  const hash = user?.username ? user.username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0;
  const avatarGradient = colors[hash % colors.length];

  return (
    <aside className={`fixed left-0 top-0 h-full flex flex-col p-md z-40 bg-surface-container-lowest border-r border-outline-variant w-64 shadow-sm select-none transition-transform duration-300 lg:translate-x-0 ${
      mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      {/* Brand Logo */}
      <div className="mb-xl px-md flex items-center justify-center">
        <img 
          src="/java_logo.jpg" 
          alt="Java Logo" 
          className="h-14 w-auto object-contain rounded-lg"
        />
      </div>

      {/* User Mini Profile Section */}
      <div className="mb-lg px-md py-sm bg-surface-container-low rounded-xl border border-outline-variant/50">
        <div className="flex items-center gap-md">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${avatarGradient} shrink-0 flex items-center justify-center text-white text-base font-black border-2 border-surface`}>
            {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-body-md font-bold text-on-surface truncate">{user?.username}</p>
            <p className="text-caption text-on-surface-variant font-medium mt-0.5 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-amber-color font-black">trophy</span>
              <span>{userPoints} XP</span>
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-md">
          <div className="flex justify-between text-caption font-semibold mb-1">
            <span className="text-on-surface-variant">Course Progress</span>
            <span className="text-primary font-bold">{overallProgress}%</span>
          </div>
          <div className="w-full bg-outline-variant/30 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-primary h-full rounded-full transition-all duration-300"
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Streak Info */}
        <div className={`mt-sm flex items-center gap-1.5 text-caption font-bold transition-all duration-300 ${
          isStreakActive ? 'text-orange-color' : 'text-slate-400 dark:text-zinc-500'
        }`}>
          <span 
            className="material-symbols-outlined text-[16px] transition-all duration-300" 
            style={{ fontVariationSettings: isStreakActive ? "'FILL' 1" : "'FILL' 0" }}
          >
            local_fire_department
          </span>
          <span>{user?.streak || 0} Day Streak</span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 flex flex-col gap-xs overflow-y-auto">
        <span className="text-[10px] font-black text-outline uppercase tracking-widest px-md block mb-1">Menu</span>
        {menuItems.map((item) => {
          const isActive = activeTab === item.id || (item.id === 'dashboard' && activeTab === 'lesson');
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-md px-md py-sm rounded-lg text-label-md transition-all duration-200 cursor-pointer ${
                isActive 
                  ? 'bg-secondary-container text-on-secondary-container font-bold shadow-sm' 
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>{item.icon}</span>
              <span className="text-label-md font-label-md">{item.name}</span>
            </button>
          );
        })}
      </nav>



      {/* Log Out Control */}
      <div className="border-t border-outline-variant/60 pt-sm">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-md px-md py-sm text-on-surface-variant hover:bg-red-500/5 hover:text-red-500 rounded-lg text-label-md font-label-md transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined">logout</span>
          Logout
        </button>
      </div>
    </aside>
  );
}
