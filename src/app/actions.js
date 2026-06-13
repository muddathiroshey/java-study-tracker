'use server';

import { cookies } from 'next/headers';
import {
  dbGetUserByUsernameOrEmail,
  dbCreateUser,
  dbUpdateUserProfile,
  dbUpdateUserProgress,
  dbUpdateUserStreak,
  dbGetLeaderboard,
  dbGetStoredSchedule,
  dbSaveStoredSchedule,
  dbGetGlobalConfig,
  dbSaveGlobalConfig
} from '../lib/db';
import { courseSchedule } from '../lib/courseData';

const SESSION_COOKIE_NAME = 'java_study_session';

// Points Calculation Helper (runs on server to match storage logic)
function calculateUserPoints(user) {
  if (!user) return 0;
  
  const compVideos = Object.keys(user.lessonsProgress || {}).filter(
    id => !id.startsWith('review_') && user.lessonsProgress[id]?.completed
  ).length;
  
  const compTasks = Object.keys(user.tasksProgress || {}).filter(
    id => user.tasksProgress[id]?.completed
  ).length;

  const compReviews = Object.keys(user.lessonsProgress || {}).filter(
    id => id.startsWith('review_') && user.lessonsProgress[id]?.completed
  ).length;

  const streakPoints = (user.streak || 0) * 5;
  const compProjects = Object.keys(user.submissions || {}).length;

  return (compVideos * 10) + (compTasks * 25) + (compReviews * 15) + (compProjects * 50) + streakPoints;
}

export async function getCurrentUserSessionAction() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);
  if (!session || !session.value) return null;
  
  const user = await dbGetUserByUsernameOrEmail(session.value);
  if (!user) return null;

  // Auto-repair 100% watched progress and streaks on startup (corrects race conditions from previous builds)
  if (user.lessonsProgress) {
    let needsUpdate = false;
    const prog = { ...user.lessonsProgress };
    
    courseSchedule.forEach(day => {
      if (day.type === 'video' && day.videos) {
        day.videos.forEach(vid => {
          const key = vid.videoId + "_day" + day.day;
          const entry = prog[key];
          if (entry && !entry.completed) {
            const timeToSecs = (str) => {
              if (!str) return 0;
              const parts = str.split(':').map(Number);
              if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
              return parts[0] * 60 + parts[1];
            };
            const vStart = timeToSecs(vid.assignedStart || '00:00:00');
            const vEnd = timeToSecs(vid.assignedEnd || vid.duration || '00:00:00');
            const vDur = Math.max(1, vEnd - vStart);
            const currentPos = entry.lastPosition - vStart;
            const pct = (currentPos / vDur) * 100;
            
            if (pct >= 99 || entry.lastPosition >= vEnd - 3) {
              entry.completed = true;
              entry.dateCompleted = new Date().toISOString().split('T')[0];
              needsUpdate = true;
            }
          }
        });
      }
    });

    if (needsUpdate) {
      const todayStr = new Date().toISOString().split('T')[0];
      const lastActive = user.lastActiveDate;
      
      // Calculate new streak
      let newStreak = user.streak || 0;
      if (!lastActive) {
        newStreak = 1;
      } else if (lastActive !== todayStr) {
        const lastDate = new Date(lastActive);
        const todayDate = new Date(todayStr);
        const diffTime = Math.abs(todayDate - lastDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          newStreak += 1;
        } else if (diffDays > 1) {
          newStreak = 1;
        }
      }
      
      const updated = await dbUpdateUserProgress(user.username, prog, user.tasksProgress, user.submissions, user.settings, newStreak, todayStr);
      if (updated) {
        user.lessonsProgress = updated.lessonsProgress;
        user.streak = updated.streak;
        user.lastActiveDate = updated.lastActiveDate;
      }
    }
  }

  // Double-check if the user completed any video, task, or submission today
  // If they did, ensure their lastActiveDate is todayStr and their streak is at least 1 (fixes overwritten/reset streaks)
  const todayStr = new Date().toISOString().split('T')[0];
  let hasActivityToday = false;

  if (user.lessonsProgress) {
    Object.keys(user.lessonsProgress).forEach(key => {
      const entry = user.lessonsProgress[key];
      if (entry && entry.completed && entry.dateCompleted === todayStr) {
        hasActivityToday = true;
      }
    });
  }

  if (user.tasksProgress) {
    Object.keys(user.tasksProgress).forEach(key => {
      const entry = user.tasksProgress[key];
      if (entry && entry.completed && entry.submittedAt && entry.submittedAt.startsWith(todayStr)) {
        hasActivityToday = true;
      }
    });
  }

  if (user.submissions) {
    Object.keys(user.submissions).forEach(key => {
      const entry = user.submissions[key];
      if (entry && entry.submittedAt && entry.submittedAt.startsWith(todayStr)) {
        hasActivityToday = true;
      }
    });
  }

  if (hasActivityToday) {
    if (user.lastActiveDate !== todayStr || !user.streak || user.streak < 1) {
      const newStreak = Math.max(1, user.streak || 1);
      const updated = await dbUpdateUserProgress(
        user.username, 
        user.lessonsProgress, 
        user.tasksProgress, 
        user.submissions, 
        user.settings, 
        newStreak, 
        todayStr
      );
      if (updated) {
        user.streak = updated.streak;
        user.lastActiveDate = updated.lastActiveDate;
      }
    }
  }
  
  return user;
}

export async function loginUserAction(usernameOrEmail, password) {
  const user = await dbGetUserByUsernameOrEmail(usernameOrEmail);
  if (user && user.password === password) {
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, user.username, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });
    return { success: true, user };
  }
  return { success: false, error: 'Invalid username/email or password' };
}

export async function registerUserAction(name, email, password) {
  const emailExists = await dbGetUserByUsernameOrEmail(email);
  if (emailExists) {
    return { success: false, error: 'Email already registered' };
  }
  const nameExists = await dbGetUserByUsernameOrEmail(name);
  if (nameExists) {
    return { success: false, error: 'Name already registered' };
  }
  
  const user = await dbCreateUser(name, email, password, false);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, user.username, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7
  });
  return { success: true, user };
}

export async function logoutUserAction() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  return { success: true };
}

export async function updateUserProgressAction(username, lessonsProgress, tasksProgress, submissions, settings = null, streak = null, lastActiveDate = null) {
  const updatedUser = await dbUpdateUserProgress(username, lessonsProgress, tasksProgress, submissions, settings, streak, lastActiveDate);
  return updatedUser;
}

export async function updateUserStreakAction(username, streak, lastActiveDate) {
  const updatedUser = await dbUpdateUserStreak(username, streak, lastActiveDate);
  return updatedUser;
}

export async function updateUserProfileAction(oldUsername, name, email, password) {
  const user = await dbGetUserByUsernameOrEmail(oldUsername);
  if (!user) {
    return { success: false, error: 'User not found' };
  }
  
  // Check unique username
  if (name.toLowerCase() !== oldUsername.toLowerCase()) {
    const nameExists = await dbGetUserByUsernameOrEmail(name);
    if (nameExists) {
      return { success: false, error: 'Name already taken' };
    }
  }
  
  // Check unique email
  if (email && (!user.email || email.toLowerCase() !== user.email.toLowerCase())) {
    const emailExists = await dbGetUserByUsernameOrEmail(email);
    if (emailExists) {
      return { success: false, error: 'Email already registered' };
    }
  }
  
  if (password && password.trim() !== '') {
    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' };
    }
  }
  
  const updatedUser = await dbUpdateUserProfile(oldUsername, name, email, password);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, updatedUser.username, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7
  });
  return { success: true, user: updatedUser };
}

export async function createAdminAccountAction(name, email, password) {
  if (email) {
    const emailExists = await dbGetUserByUsernameOrEmail(email);
    if (emailExists) {
      return { success: false, error: 'Email already registered' };
    }
  }
  const nameExists = await dbGetUserByUsernameOrEmail(name);
  if (nameExists) {
    return { success: false, error: 'Name already registered' };
  }
  
  const user = await dbCreateUser(name, email, password, true);
  return { success: true, user };
}

export async function getLeaderboardAction() {
  const users = await dbGetLeaderboard();
  return users.map(u => ({
    ...u,
    points: calculateUserPoints(u)
  })).sort((a, b) => b.points - a.points);
}

export async function getStoredScheduleAction(defaultSchedule) {
  const schedule = await dbGetStoredSchedule(defaultSchedule);
  return schedule;
}

export async function saveStoredScheduleAction(schedule) {
  await dbSaveStoredSchedule(schedule);
  return { success: true };
}

export async function getGlobalConfigAction() {
  const config = await dbGetGlobalConfig();
  return config;
}

export async function saveGlobalConfigAction(config) {
  await dbSaveGlobalConfig(config);
  return { success: true };
}
