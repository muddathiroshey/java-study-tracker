'use client';

import { useState, useEffect } from 'react';
import { 
  getCurrentUserSession, 
  updateUserProgress, 
  checkAndUpdateStreak, 
  logoutUser,
  getStoredSchedule,
  saveStoredSchedule,
  resetStoredSchedule,
  calculateUserPoints
} from '../lib/storage';
import { courseSchedule } from '../lib/courseData';

// Component imports
import Auth from '../components/Auth';
import Sidebar from '../components/Sidebar';
import Dashboard from '../components/Dashboard';
import Roadmap from '../components/Roadmap';
import WeeklyPlan from '../components/WeeklyPlan';
import Leaderboard from '../components/Leaderboard';
import Analytics from '../components/Analytics';
import PracticeTask from '../components/PracticeTask';
import Settings from '../components/Settings';
import AdminPanel from '../components/AdminPanel';

export default function Home() {
  const [user, setUser] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDayNum, setSelectedDayNum] = useState(1);
  const [currentDate, setCurrentDate] = useState('');
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Initialize and load user session on client load
  useEffect(() => {
    setIsClient(true);
    
    // Load theme
    const savedTheme = localStorage.getItem('java_study_theme');
    if (savedTheme === 'light') {
      setIsDarkTheme(false);
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }

    const sessionUser = getCurrentUserSession();
    if (sessionUser) {
      setUser(sessionUser);
      syncSystemDate(sessionUser);
    } else {
      const today = new Date().toISOString().split('T')[0];
      setCurrentDate(today);
    }

    // Load custom schedule
    const storedSchedule = getStoredSchedule(courseSchedule);
    setSchedule(storedSchedule);
  }, []);

  // Sync date based on user settings (warp vs real)
  const syncSystemDate = (currUser) => {
    if (!currUser) return;
    const settings = currUser.settings || {};
    if (settings.devWarpTime && settings.currentFakeDate) {
      setCurrentDate(settings.currentFakeDate);
    } else {
      const today = new Date().toISOString().split('T')[0];
      setCurrentDate(today);
    }
  };

  // Toggle Theme
  const toggleTheme = () => {
    const nextTheme = !isDarkTheme;
    setIsDarkTheme(nextTheme);
    if (nextTheme) {
      document.documentElement.classList.remove('light-theme');
      localStorage.setItem('java_study_theme', 'dark');
    } else {
      document.documentElement.classList.add('light-theme');
      localStorage.setItem('java_study_theme', 'light');
    }
  };

  // Handle successful login
  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    syncSystemDate(loggedInUser);
    
    // Restore tab from URL search parameters if it exists, otherwise default to dashboard
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlTab = params.get('tab');
      if (urlTab) {
        setActiveTab(urlTab);
        const urlDay = parseInt(params.get('day'), 10);
        if (urlDay) {
          setSelectedDayNum(urlDay);
        }
        return;
      }
    }
    setActiveTab('dashboard');
  };

  // Logout
  const handleLogout = () => {
    logoutUser();
    setUser(null);
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/');
    }
  };

  // URL Routing Sync
  useEffect(() => {
    if (!isClient) return;

    const handleUrlSync = () => {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab') || 'dashboard';
      const day = parseInt(params.get('day'), 10) || 1;

      setActiveTab(tab);
      setSelectedDayNum(day);
    };

    // Parse URL on initial client mount
    handleUrlSync();

    // Listen to browser Back and Forward navigation events
    window.addEventListener('popstate', handleUrlSync);
    return () => window.removeEventListener('popstate', handleUrlSync);
  }, [isClient]);

  // Push tab/day changes to URL to support browser history
  useEffect(() => {
    if (!isClient || !user) return;

    const params = new URLSearchParams(window.location.search);
    const currentTab = params.get('tab') || 'dashboard';
    const currentDay = parseInt(params.get('day'), 10) || 1;

    // Only push state if the state actually differs from the URL parameters
    if (currentTab !== activeTab || currentDay !== selectedDayNum) {
      const newParams = new URLSearchParams();
      newParams.set('tab', activeTab);
      if (activeTab === 'lesson') {
        newParams.set('day', selectedDayNum.toString());
      }
      
      const newSearch = newParams.toString();
      const newUrl = newSearch ? `?${newSearch}` : '/';
      
      window.history.pushState({ tab: activeTab, day: selectedDayNum }, '', newUrl);
    }
  }, [activeTab, selectedDayNum, isClient, user]);

  // Navigation callbacks
  const handleNavigateTab = (tabId) => {
    setActiveTab(tabId);
  };

  const handleSelectDay = (dayNum) => {
    setSelectedDayNum(dayNum);
    setActiveTab('lesson');
  };

  // Update Settings
  const handleUpdateSettings = (newSettings) => {
    if (!user) return;
    const updated = updateUserProgress(user.username, (currUser) => {
      currUser.settings = { ...currUser.settings, ...newSettings };
      return currUser;
    });
    setUser(updated);
    if (newSettings.devWarpTime && newSettings.currentFakeDate) {
      setCurrentDate(newSettings.currentFakeDate);
    } else {
      const today = new Date().toISOString().split('T')[0];
      setCurrentDate(today);
    }
  };

  // Reset Progress
  const handleResetProgress = () => {
    if (!user) return;
    const updated = updateUserProgress(user.username, (currUser) => {
      currUser.lessonsProgress = {};
      currUser.tasksProgress = {};
      currUser.streak = 0;
      currUser.lastActiveDate = null;
      return currUser;
    });
    setUser(updated);
    alert("Your account progress has been successfully reset!");
    setActiveTab('dashboard');
  };

  // Video Complete Callback
  const handleCompleteVideo = (videoId) => {
    if (!user) return;
    const updated = updateUserProgress(user.username, (currUser) => {
      currUser.lessonsProgress[videoId] = {
        completed: true,
        dateCompleted: new Date().toISOString().split('T')[0]
      };
      return checkAndUpdateStreak(currUser);
    });
    setUser(updated);
  };

  // Task Complete Callback
  const handleCompleteTask = (taskId, codeContent) => {
    if (!user) return;
    const updated = updateUserProgress(user.username, (currUser) => {
      currUser.tasksProgress[taskId] = {
        completed: true,
        code: codeContent,
        submittedAt: new Date().toISOString().split('T')[0]
      };
      return checkAndUpdateStreak(currUser);
    });
    setUser(updated);
    alert("Practice task submitted successfully! Day completed.");
  };

  // Get total progress percentage
  const getOverallProgress = () => {
    if (!user || schedule.length === 0) return 0;
    
    const totalVideos = schedule.reduce((acc, curr) => acc + (curr.videos?.length || 0), 0);
    const totalTasks = schedule.filter(d => d.task).length;
    const totalReviews = schedule.filter(d => d.type === 'review').length;
    const totalItems = totalVideos + totalTasks + totalReviews;

    if (totalItems === 0) return 0;

    const compVideos = Object.keys(user.lessonsProgress || {}).filter(
      id => !id.startsWith('review_') && user.lessonsProgress[id]?.completed
    ).length;
    
    const compTasks = Object.keys(user.tasksProgress || {}).filter(
      id => user.tasksProgress[id]?.completed
    ).length;

    const compReviews = Object.keys(user.lessonsProgress || {}).filter(
      id => id.startsWith('review_') && user.lessonsProgress[id]?.completed
    ).length;

    const compItems = compVideos + compTasks + compReviews;
    return Math.min(Math.round((compItems / totalItems) * 100), 100);
  };

  // Admin schedule edits callbacks
  const handleSaveSchedule = (newSchedule) => {
    setSchedule(newSchedule);
    saveStoredSchedule(newSchedule);
  };

  const handleResetSchedule = () => {
    resetStoredSchedule();
    const defaultSched = courseSchedule;
    setSchedule(defaultSched);
  };

  const handleToggleOpenAvailability = (val) => {
    if (!user) return;
    const updated = updateUserProgress(user.username, (currUser) => {
      currUser.settings.openAvailability = val;
      return currUser;
    });
    setUser(updated);
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-background text-muted-text flex items-center justify-center font-sans">
        <span className="text-sm text-muted-text font-bold">Loading Study Tracker...</span>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <Auth onLoginSuccess={handleLoginSuccess} />;
  }

  // Find Day Data for currently selected lesson view
  const selectedDayData = schedule.find(d => d.day === selectedDayNum) || schedule[0];

  const overallProgress = getOverallProgress();

  return (
    <div className="min-h-screen flex bg-background text-foreground select-none overflow-hidden font-sans">
      {/* Navigation Sidebar */}
      <Sidebar 
        user={user} 
        activeTab={activeTab} 
        setActiveTab={handleNavigateTab} 
        overallProgress={overallProgress}
        isDarkTheme={isDarkTheme}
        toggleTheme={toggleTheme}
        onLogout={handleLogout}
        userPoints={calculateUserPoints(user)}
      />

      {/* Main Panel Viewport */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Main Header */}
        <header className="h-16 shrink-0 border-b border-custom-border glass-panel flex items-center justify-between px-6 z-20">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-sm text-foreground">
              {activeTab === 'dashboard' && 'Dashboard Overview'}
              {activeTab === 'roadmap' && 'Mastery Curriculum'}
              {activeTab === 'weekly' && 'Schedule Progress'}
              {activeTab === 'analytics' && 'Course Metrics'}
              {activeTab === 'settings' && 'User Preferences'}
              {activeTab === 'admin' && 'Admin Control Panel'}
              {activeTab === 'lesson' && `Day ${selectedDayNum}: Course Study`}
            </h2>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-muted-text">
            {user.settings?.openAvailability ? (
              <span className="px-2.5 py-1 rounded bg-secondary-color/10 border border-secondary-color/20 text-secondary-color">
                Open Availability (All Unlocked)
              </span>
            ) : user.settings?.devWarpTime ? (
              <span className="px-2.5 py-1 rounded bg-secondary-color/10 border border-secondary-color/20 text-secondary-color">
                Simulated Date: {currentDate}
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded bg-primary-color/10 border border-primary-color/20 text-primary-color">
                System Date: {currentDate}
              </span>
            )}
          </div>
        </header>

        {/* Dynamic component contents */}
        {activeTab === 'dashboard' && (
          <Dashboard 
            user={user} 
            currentDate={currentDate} 
            schedule={schedule}
            onNavigateTab={handleNavigateTab} 
            onSelectDay={handleSelectDay}
          />
        )}
        
        {activeTab === 'roadmap' && (
          <Roadmap 
            user={user} 
            currentDate={currentDate} 
            schedule={schedule}
            onSelectDay={handleSelectDay} 
          />
        )}

        {activeTab === 'weekly' && (
          <WeeklyPlan 
            user={user} 
            currentDate={currentDate} 
            schedule={schedule}
            onSelectDay={handleSelectDay} 
          />
        )}

        {activeTab === 'leaderboard' && (
          <Leaderboard 
            user={user} 
            schedule={schedule}
            currentDate={currentDate}
            onSelectDay={handleSelectDay}
          />
        )}

        {activeTab === 'analytics' && (
          <Analytics 
            user={user} 
            schedule={schedule}
          />
        )}

        {activeTab === 'settings' && (
          <Settings 
            user={user} 
            currentDate={currentDate} 
            onUpdateSettings={handleUpdateSettings} 
            onResetProgress={handleResetProgress} 
          />
        )}

        {activeTab === 'admin' && (
          <AdminPanel 
            schedule={schedule}
            onSaveSchedule={handleSaveSchedule}
            onResetSchedule={handleResetSchedule}
            openAvailability={user.settings?.openAvailability}
            onToggleOpenAvailability={handleToggleOpenAvailability}
          />
        )}

        {activeTab === 'lesson' && (
          <PracticeTask 
            dayData={selectedDayData} 
            user={user} 
            onCompleteVideo={handleCompleteVideo} 
            onCompleteTask={handleCompleteTask} 
          />
        )}
      </div>
    </div>
  );
}
