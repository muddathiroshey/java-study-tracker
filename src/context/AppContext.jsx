'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUserSession, logoutUser, getStoredSchedule, calculateUserPoints, getGlobalConfig } from '../lib/storage';
import { courseSchedule } from '../lib/courseData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [schedule, setSchedule] = useState([]);
  const [globalConfig, setGlobalConfig] = useState({ openAvailabilityForAll: false });
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();

  // Load state on mount and add listeners for synchronization
  useEffect(() => {
    const syncData = async () => {
      const session = await getCurrentUserSession();
      setUser(session);
      const s = await getStoredSchedule(courseSchedule);
      setSchedule(s);
      const config = await getGlobalConfig();
      setGlobalConfig(config || { openAvailabilityForAll: false });
      setLoaded(true);
    };

    // Load initial data
    syncData();

    // Background polling every 15 seconds to sync server state changes
    const interval = setInterval(syncData, 15000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        syncData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleUserUpdate = useCallback((updatedUser) => {
    setUser(updatedUser);
  }, []);

  const handleLogout = useCallback(async () => {
    await logoutUser();
    sessionStorage.removeItem('dailyLessons_scrollY');
    setUser(null);
    router.push('/');
  }, [router]);

  const handleScheduleUpdate = useCallback((newSchedule) => {
    setSchedule(newSchedule);
  }, []);

  const handleGlobalConfigUpdate = useCallback((newConfig) => {
    setGlobalConfig(newConfig);
  }, []);

  const getEffectiveDate = useCallback(() => {
    if (!user) return new Date().toISOString().split('T')[0];
    if (user.settings?.devWarpTime && user.settings?.currentFakeDate) {
      return user.settings.currentFakeDate;
    }
    return new Date().toISOString().split('T')[0];
  }, [user]);

  const getOverallProgress = useCallback(() => {
    if (!user || !schedule.length) return 0;
    
    let totalItems = 0;
    let completedItems = 0;
    
    schedule.forEach(day => {
      if (day.type === 'off') {
        return; // Rest day doesn't count towards progress
      }
      
      if (day.type === 'review') {
        totalItems++;
        if (user.lessonsProgress?.[`review_${day.day}`]?.completed) {
          completedItems++;
        }
      } else if (day.type === 'video') {
        const allVids = day.videos || [];
        allVids.forEach(v => {
          totalItems++;
          if (user.lessonsProgress?.[v.videoId + "_day" + day.day]?.completed) {
            completedItems++;
          }
        });
        if (day.task) {
          totalItems++;
          if (user.tasksProgress?.[day.task.taskId]?.completed) {
            completedItems++;
          }
        }
      } else if (day.type === 'project') {
        totalItems++;
        if (user.submissions?.[day.day]) {
          completedItems++;
        }
      }
    });
    
    if (totalItems === 0) return 0;
    return Math.round((completedItems / totalItems) * 100);
  }, [user, schedule]);

  const value = {
    user,
    setUser,
    searchQuery,
    setSearchQuery,
    mobileSidebarOpen,
    setMobileSidebarOpen,
    schedule,
    setSchedule,
    loaded,
    currentDate: getEffectiveDate(),
    overallProgress: getOverallProgress(),
    userPoints: calculateUserPoints(user),
    onUserUpdate: handleUserUpdate,
    onLogout: handleLogout,
    onScheduleUpdate: handleScheduleUpdate,
    globalConfig,
    onGlobalConfigUpdate: handleGlobalConfigUpdate
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
