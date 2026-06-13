// Local storage based database helper for Java Study Tracker
const USER_KEY = 'java_study_users';
const SESSION_KEY = 'java_study_current_user';
const SCHEDULE_KEY = 'java_study_schedule';

export function getDB() {
  if (typeof window === 'undefined') return { users: [] };
  const data = localStorage.getItem(USER_KEY);
  const db = data ? JSON.parse(data) : { users: [] };
  
  let dbChanged = false;

  // Ensure muddathiradmin exists
  const hasAdmin = db.users.some(u => u.username.toLowerCase() === 'muddathiradmin');
  if (!hasAdmin) {
    db.users.push({
      id: 'admin_id',
      username: 'muddathiradmin',
      password: 'muddathiradmin' === 'muddathiradmin' ? '64913728' : '64913728', // Admin Password
      enrolledDate: '2026-06-11',
      streak: 0,
      lastActiveDate: null,
      totalStudyTime: 0,
      lessonsProgress: {},
      tasksProgress: {},
      studySessions: [],
      settings: {
        dailyTargetMinutes: 60,
        devWarpTime: false,
        currentFakeDate: null,
        openAvailability: false // Admin option to unlock all days globally
      }
    });
    dbChanged = true;
  }

  // Ensure classmate users exist
  const classmatesToSeed = [
    {
      id: 'classmate_ada',
      username: 'Ada Lovelace',
      password: '123456',
      enrolledDate: '2026-06-11',
      streak: 4,
      lastActiveDate: '2026-06-11',
      totalStudyTime: 0,
      lessonsProgress: {
        'WnMPk6_8qDo': { completed: true, dateCompleted: '2026-06-11' },
        'r_0n_M38Or0': { completed: true, dateCompleted: '2026-06-11' },
        'M7XLFoSm1yw': { completed: true, dateCompleted: '2026-06-11' }
      },
      tasksProgress: {
        'task_1': { completed: true, code: '', submittedAt: '2026-06-11' }
      },
      studySessions: [],
      settings: {
        dailyTargetMinutes: 60,
        devWarpTime: false,
        currentFakeDate: null,
        openAvailability: false
      }
    },
    {
      id: 'classmate_sarah',
      username: 'Sarah Connor',
      password: '123456',
      enrolledDate: '2026-06-11',
      streak: 2,
      lastActiveDate: '2026-06-11',
      totalStudyTime: 0,
      lessonsProgress: {
        'WnMPk6_8qDo': { completed: true, dateCompleted: '2026-06-11' },
        'r_0n_M38Or0': { completed: true, dateCompleted: '2026-06-11' }
      },
      tasksProgress: {
        'task_1': { completed: true, code: '', submittedAt: '2026-06-11' }
      },
      studySessions: [],
      settings: {
        dailyTargetMinutes: 60,
        devWarpTime: false,
        currentFakeDate: null,
        openAvailability: false
      }
    },
    {
      id: 'classmate_linus',
      username: 'Linus Torvalds',
      password: '123456',
      enrolledDate: '2026-06-11',
      streak: 1,
      lastActiveDate: '2026-06-11',
      totalStudyTime: 0,
      lessonsProgress: {
        'WnMPk6_8qDo': { completed: true, dateCompleted: '2026-06-11' }
      },
      tasksProgress: {},
      studySessions: [],
      settings: {
        dailyTargetMinutes: 60,
        devWarpTime: false,
        currentFakeDate: null,
        openAvailability: false
      }
    }
  ];

  classmatesToSeed.forEach(c => {
    const exists = db.users.some(u => u.username.toLowerCase() === c.username.toLowerCase());
    if (!exists) {
      db.users.push(c);
      dbChanged = true;
    }
  });

  if (dbChanged) {
    localStorage.setItem(USER_KEY, JSON.stringify(db));
  }
  
  return db;
}

export function saveDB(db) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_KEY, JSON.stringify(db));
}

// Time parsing & normalization helper
const parseTimeToSeconds = (timeStr) => {
  if (!timeStr) return 0;
  if (typeof timeStr === 'number') return timeStr * 60; // old minutes format
  const parts = timeStr.toString().split(':').map(Number);
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 1 && !isNaN(parts[0])) {
    return parts[0];
  }
  return 0;
};

const formatSecondsToTime = (secs) => {
  if (isNaN(secs) || secs < 0) return "00:00:00";
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = Math.floor(secs % 60);
  return [
    h.toString().padStart(2, '0'),
    m.toString().padStart(2, '0'),
    s.toString().padStart(2, '0')
  ].join(':');
};

const normalizeVideoTimes = (vid) => {
  let startSecs = 0;
  if (typeof vid.assignedStart === 'number') {
    startSecs = vid.assignedStart * 60;
  } else {
    startSecs = parseTimeToSeconds(vid.assignedStart || "00:00:00");
  }

  let endSecs = 0;
  if (typeof vid.assignedEnd === 'number') {
    endSecs = vid.assignedEnd * 60;
  } else {
    endSecs = parseTimeToSeconds(vid.assignedEnd || vid.duration || "00:00:00");
  }

  let durationSecs = 0;
  if (typeof vid.duration === 'number') {
    durationSecs = vid.duration * 60;
  } else {
    durationSecs = parseTimeToSeconds(vid.duration || "00:00:00");
  }

  return {
    ...vid,
    duration: formatSecondsToTime(durationSecs),
    assignedStart: formatSecondsToTime(startSecs),
    assignedEnd: formatSecondsToTime(endSecs)
  };
};

const normalizeSchedule = (schedule) => {
  if (!Array.isArray(schedule)) return schedule;
  return schedule.map(day => {
    if (day.type === 'video' && Array.isArray(day.videos)) {
      return {
        ...day,
        videos: day.videos.map(normalizeVideoTimes)
      };
    }
    return day;
  });
};

// Custom Schedule Persistence
export function getStoredSchedule(defaultSchedule) {
  if (typeof window === 'undefined') return defaultSchedule;
  const data = localStorage.getItem(SCHEDULE_KEY);
  const schedule = data ? JSON.parse(data) : defaultSchedule;
  
  // Normalize schedule formats
  const normalized = normalizeSchedule(schedule);
  
  // Auto-save normalized schedule back to localStorage to persist corrections
  if (data) {
    localStorage.setItem(SCHEDULE_KEY, JSON.stringify(normalized));
  }
  return normalized;
}

export function saveStoredSchedule(schedule) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SCHEDULE_KEY, JSON.stringify(schedule));
}

export function resetStoredSchedule() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SCHEDULE_KEY);
}

export function getCurrentUserSession() {
  if (typeof window === 'undefined') return null;
  const username = localStorage.getItem(SESSION_KEY);
  if (!username) return null;
  
  const db = getDB();
  const user = db.users.find(u => u.username.toLowerCase() === username.toLowerCase());
  return user || null;
}

export function loginUser(username, password) {
  const db = getDB();
  const user = db.users.find(
    u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
  );
  if (user) {
    localStorage.setItem(SESSION_KEY, user.username);
    return { success: true, user };
  }
  return { success: false, error: 'Invalid username or password' };
}

export function registerUser(username, password) {
  const db = getDB();
  const exists = db.users.some(u => u.username.toLowerCase() === username.toLowerCase());
  if (exists) {
    return { success: false, error: 'Username already exists' };
  }
  
  const newUser = {
    id: Date.now().toString(),
    username,
    password,
    enrolledDate: new Date().toISOString().split('T')[0],
    streak: 0,
    lastActiveDate: null,
    totalStudyTime: 0,
    lessonsProgress: {},
    tasksProgress: {},
    studySessions: [],
    settings: {
      dailyTargetMinutes: 60,
      devWarpTime: false,
      currentFakeDate: null,
      openAvailability: false
    }
  };
  
  db.users.push(newUser);
  saveDB(db);
  localStorage.setItem(SESSION_KEY, newUser.username);
  return { success: true, user: newUser };
}

export function logoutUser() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_KEY);
}

export function updateUserProgress(username, updateFn) {
  const db = getDB();
  const userIndex = db.users.findIndex(u => u.username.toLowerCase() === username.toLowerCase());
  if (userIndex === -1) return null;
  
  const updatedUser = updateFn(db.users[userIndex]);
  db.users[userIndex] = updatedUser;
  saveDB(db);
  return updatedUser;
}

export function checkAndUpdateStreak(user) {
  const todayStr = new Date().toISOString().split('T')[0];
  const lastActive = user.lastActiveDate;
  
  if (!lastActive) {
    user.streak = 1;
    user.lastActiveDate = todayStr;
    return user;
  }
  
  if (lastActive === todayStr) {
    return user;
  }
  
  const lastDate = new Date(lastActive);
  const todayDate = new Date(todayStr);
  const diffTime = Math.abs(todayDate - lastDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) {
    user.streak += 1;
  } else if (diffDays > 1) {
    user.streak = 1;
  }
  
  user.lastActiveDate = todayStr;
  return user;
}

export function calculateUserPoints(user) {
  if (!user) return 0;
  
  // 1. Video completions (excluding review keys)
  const compVideos = Object.keys(user.lessonsProgress || {}).filter(
    id => !id.startsWith('review_') && user.lessonsProgress[id]?.completed
  ).length;
  
  // 2. Task completions
  const compTasks = Object.keys(user.tasksProgress || {}).filter(
    id => user.tasksProgress[id]?.completed
  ).length;

  // 3. Review completions
  const compReviews = Object.keys(user.lessonsProgress || {}).filter(
    id => id.startsWith('review_') && user.lessonsProgress[id]?.completed
  ).length;

  // 4. Streak points
  const streakPoints = (user.streak || 0) * 5;

  return (compVideos * 10) + (compTasks * 25) + (compReviews * 15) + streakPoints;
}
