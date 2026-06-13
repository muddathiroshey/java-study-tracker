'use client';

import { 
  GraduationCap, 
  LayoutDashboard, 
  Map, 
  Calendar, 
  ChartColumn, 
  Settings, 
  Flame, 
  LogOut, 
  Sun, 
  Moon,
  ShieldCheck,
  Trophy
} from 'lucide-react';

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
  const isAdmin = user.username?.toLowerCase() === 'muddathiradmin';

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'roadmap', name: 'Learning Roadmap', icon: Map },
    { id: 'weekly', name: 'Weekly Plan', icon: Calendar },
    { id: 'leaderboard', name: 'Leaderboard', icon: Trophy },
    { id: 'analytics', name: 'Analytics', icon: ChartColumn },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  if (isAdmin) {
    menuItems.push({ id: 'admin', name: 'Admin Panel', icon: ShieldCheck });
  }

  return (
    <aside className="w-64 glass-panel border-y-0 border-l-0 border-r flex flex-col h-screen shrink-0 sticky top-0">
      {/* Header / Brand */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-custom-border">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-color/10 text-primary-color border border-primary-color/20">
          <GraduationCap className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-foreground uppercase tracking-wider">Java Course</span>
          <span className="text-xxs text-muted-text">June 15 - July 31, 2026</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-7">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-muted-text uppercase tracking-widest px-3 block mb-2">Navigation</span>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 cursor-pointer ${
                  isActive 
                    ? 'bg-primary-color/15 text-primary-color font-semibold border-l-4 border-primary-color pl-2' 
                    : 'text-muted-text hover:text-foreground hover:bg-primary-color/5'
                }`}
              >
                <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-primary-color' : 'text-muted-text'}`} />
                {item.name}
              </button>
            );
          })}
        </div>

        {/* Quick Stats Section */}
        <div className="space-y-3">
          <span className="text-[10px] font-bold text-muted-text uppercase tracking-widest px-3 block">Quick Stats</span>
          
          <div className="space-y-2">
            {/* Streak */}
            <div className="flex items-center gap-3 bg-black/5 dark:bg-white/3 border border-custom-border rounded-xl p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-color/10 text-orange-color">
                <Flame className="h-4.5 w-4.5 fill-current" />
              </div>
              <div className="flex flex-col">
                <span className="text-xxs text-muted-text uppercase tracking-wider font-semibold">Streak</span>
                <span className="text-sm font-bold text-foreground">{user.streak || 0} days</span>
              </div>
            </div>

            {/* XP Points */}
            <div className="flex items-center gap-3 bg-black/5 dark:bg-white/3 border border-custom-border rounded-xl p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-color/10 text-amber-color">
                <Trophy className="h-4.5 w-4.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xxs text-muted-text uppercase tracking-wider font-semibold">XP Points</span>
                <span className="text-sm font-bold text-foreground">{userPoints} XP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Global Progress Section */}
        <div className="space-y-2 px-3">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-muted-text">Total Progress</span>
            <span className="text-primary-color">{overallProgress}%</span>
          </div>
          <div className="w-full bg-black/10 dark:bg-white/5 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-primary-color to-secondary-color h-full rounded-full transition-all duration-300"
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
        </div>
      </nav>

      {/* Footer Controls */}
      <div className="p-4 border-t border-custom-border flex flex-col gap-2">
        <div className="flex items-center justify-between px-2 py-1.5 bg-black/5 dark:bg-white/3 border border-custom-border rounded-lg mb-2">
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-foreground truncate max-w-[100px]">{user.username}</span>
            <span className="text-[9px] text-muted-text">{isAdmin ? 'Administrator' : 'Student'}</span>
          </div>
          <button 
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-muted-text hover:text-foreground cursor-pointer transition-colors"
            title="Toggle Theme"
          >
            {isDarkTheme ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border border-red-500/20 text-red-400 bg-red-500/5 hover:bg-red-500/10 cursor-pointer transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
