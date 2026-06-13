'use client';

import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { usePathname, useRouter } from 'next/navigation';
import Auth from './Auth';
import Sidebar from './Sidebar';
import TopAppBar from './TopAppBar';
import InstructionsModal from './InstructionsModal';
import { updateUserProgress } from '../lib/storage';

export default function AppLayoutWrapper({ children }) {
  const { 
    user, 
    loaded, 
    dbError,
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

  const [showInstructionsModal, setShowInstructionsModal] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  // Show instructions modal for new users
  useEffect(() => {
    if (user && loaded && !user.settings?.seenInstructions) {
      setShowInstructionsModal(true);
    }
  }, [user, loaded]);

  const handleInstructionsModalClose = async () => {
    if (user) {
      // Mark instructions as seen
      const updated = await updateUserProgress(user.username, (u) => ({
        ...u,
        settings: {
          ...u.settings,
          seenInstructions: true,
        }
      }));
      if (updated) onUserUpdate(updated);
    }
    setShowInstructionsModal(false);
    // Navigate to main page
    router.push('/');
  };

  if (dbError) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md min-w-[300px] sm:min-w-[420px] flex flex-col items-center gap-5 text-center p-8 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl shadow-xl">
          <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/30 text-rose-500 rounded-full flex items-center justify-center shadow-md animate-pulse">
            <span className="material-symbols-outlined text-3xl font-bold">cloud_off</span>
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-zinc-100">Database Connection Issue</h2>
            <p className="text-sm text-slate-500 dark:text-zinc-400 mt-2">
              We couldn't connect to your database. This is usually caused by an incorrect database connection string or missing credentials.
            </p>
          </div>
          
          <div className="bg-slate-50 dark:bg-zinc-950/50 border border-slate-100 dark:border-zinc-850 p-4 rounded-xl text-left text-xs font-mono w-full overflow-x-auto max-h-32 text-rose-600 dark:text-rose-400 scrollbar-thin">
            {dbError}
          </div>
          
          <div className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed bg-amber-50/50 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-900/30 p-4 rounded-xl">
            💡 <strong>If you just deployed to Vercel:</strong> Ensure the <code>DATABASE_URL</code> environment variable is added to Vercel and that you replaced <code>[YOUR-PASSWORD]</code> with your actual Supabase password.
          </div>
          
          <button 
            onClick={() => window.location.reload()} 
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform active:scale-[0.98] cursor-pointer"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

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
    if (pathname === '/resources') return 'Resources';
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

      {/* Instructions Modal for New Users */}
      {showInstructionsModal && (
        <InstructionsModal 
          onClose={handleInstructionsModalClose}
          videoUrl="/instructions.mp4"
        />
      )}
    </div>
  );
}
