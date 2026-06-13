'use client';

import { useApp } from '../context/AppContext';
import { usePathname, useRouter } from 'next/navigation';
import Auth from './Auth';
import Sidebar from './Sidebar';
import TopAppBar from './TopAppBar';

export default function AppLayoutWrapper({ children }) {
  const { 
    user, 
    loaded, 
    onUserUpdate, 
    onLogout, 
    currentDate, 
    schedule, 
    overallProgress, 
    userPoints,
    searchQuery,
    setSearchQuery,
    mobileSidebarOpen,
    setMobileSidebarOpen
  } = useApp();

  const pathname = usePathname();
  const router = useRouter();

  if (!loaded) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-xl animate-pulse">
            <span className="material-symbols-outlined text-on-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
          </div>
          <p className="text-on-surface-variant font-bold">Loading Java Mastery…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth onLogin={onUserUpdate} />;
  }

  const getPageTitle = () => {
    if (pathname === '/') return 'Daily Lessons';
    if (pathname.startsWith('/lessons/')) {
      const dayNum = parseInt(pathname.split('/').pop());
      const day = schedule.find(d => d.day === dayNum);
      return day ? `Day ${day.day}` : 'Lesson';
    }
    if (pathname === '/leaderboard') return 'Leaderboard';
    if (pathname === '/tasks') return 'Tasks Board';
    if (pathname === '/settings') return 'Settings';
    if (pathname === '/admin') return 'Admin Panel';
    return 'Java Mastery';
  };

  const activeTab = pathname === '/' ? 'dashboard' : pathname.startsWith('/lessons/') ? 'lesson' : pathname.replace('/', '');

  return (
    <div className="flex min-h-screen bg-background">
      {/* Backdrop for mobile sidebar */}
      {mobileSidebarOpen && (
        <div 
          onClick={() => setMobileSidebarOpen(false)} 
          className="lg:hidden fixed inset-0 bg-black/40 z-30 transition-opacity duration-300"
        />
      )}

      {/* Sidebar - responsive position */}
      <Sidebar
        user={user}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setMobileSidebarOpen(false);
          if (tab === 'dashboard') router.push('/');
          else if (tab === 'lesson') { /* click daily lessons timeline instead */ }
          else router.push('/' + tab);
        }}
        overallProgress={overallProgress}
        isDarkTheme={false}
        toggleTheme={() => {}}
        onLogout={onLogout}
        userPoints={userPoints}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        {/* Top App Bar */}
        <TopAppBar
          title={getPageTitle()}
          currentDate={currentDate}
          user={user}
          searchQuery={pathname === '/' ? searchQuery : undefined}
          setSearchQuery={pathname === '/' ? setSearchQuery : undefined}
        />
        {children}
      </div>
    </div>
  );
}
