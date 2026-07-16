'use server';

import { cookies } from 'next/headers';
import { getLocalDateString, getLocalISOString, allMissedDaysExcused, getActiveStreak } from '../lib/dateUtils';
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
  dbSaveGlobalConfig,
  dbDeleteUser
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

  const todayStr = getLocalDateString(user);
  const activeStreak = getActiveStreak(user, todayStr, courseSchedule);
  const streakPoints = activeStreak * 5;
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
              entry.dateCompleted = getLocalDateString(user);
              needsUpdate = true;
            }
          }
        });
      }
    });

    if (needsUpdate) {
      const todayStr = getLocalDateString(user);
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
          // Only reset if the gap contains non-excused days
          if (!allMissedDaysExcused(lastActive, todayStr, courseSchedule, user)) {
            newStreak = 1;
          }
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
  const todayStr = getLocalDateString(user);
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

export async function deleteUserAccountAction(username) {
  try {
    await dbDeleteUser(username);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// Real Java compiler via Wandbox API (free, no key required)
export async function runJavaCodeAction(code) {
  try {
    const response = await fetch('https://wandbox.org/api/compile.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        compiler: 'openjdk-jdk-22+36',
        code: code,
        'compiler-option-raw': '',
        'runtime-option-raw': '',
        save: false
      })
    });

    if (!response.ok) {
      return { 
        success: false, 
        error: `Compiler service unavailable (HTTP ${response.status}). Please try again.`,
        type: 'network_error'
      };
    }

    const data = await response.json();
    // Wandbox response fields:
    // status: exit code (0 = success)
    // compiler_output: stdout from compiler (javac messages)
    // compiler_error: stderr from compiler (error messages)
    // program_output: stdout from the running program
    // program_error: stderr from the running program

    const exitCode = parseInt(data.status, 10);
    const compilerError = (data.compiler_error || '').trim();
    const programOutput = (data.program_output || '').trim();
    const programError = (data.program_error || '').trim();

    // Compilation failed
    if (compilerError && exitCode !== 0) {
      return {
        success: false,
        type: 'compile_error',
        error: compilerError,
        output: null
      };
    }

    // Compiled but runtime error
    if (programError && exitCode !== 0) {
      return {
        success: false,
        type: 'runtime_error',
        error: programError,
        output: programOutput || null
      };
    }

    // Success
    return {
      success: true,
      type: 'success',
      output: programOutput,
      error: null
    };
  } catch (err) {
    return {
      success: false,
      type: 'network_error',
      error: `Could not reach the compiler service: ${err.message}`,
      output: null
    };
  }
}

// ─── GitHub Integration Actions (Admin-Only) ───────────────────────────────

/**
 * Save the target GitHub repo (owner/repo-name) for the logged-in user.
 * The OAuth token is already stored in DB by the callback route.
 */
export async function saveGithubRepoAction(githubRepo) {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);
  if (!session?.value) return { success: false, error: 'Not authenticated' };

  const user = await dbGetUserByUsernameOrEmail(session.value);
  if (!user) return { success: false, error: 'User not found' };

  const updatedSettings = {
    ...user.settings,
    githubRepo: githubRepo.trim(),
  };

  const updated = await dbUpdateUserProgress(
    user.username,
    user.lessonsProgress,
    user.tasksProgress,
    user.submissions,
    updatedSettings,
    user.streak,
    user.lastActiveDate
  );

  if (!updated) return { success: false, error: 'Failed to save repo' };
  return { success: true, user: updated };
}

/**
 * Fetch the authenticated user's GitHub repositories using their stored OAuth token.
 * Returns repos sorted by last-updated (most recent first).
 */
export async function getGithubReposAction() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);
  if (!session?.value) return { success: false, error: 'Not authenticated', repos: [] };

  const user = await dbGetUserByUsernameOrEmail(session.value);
  if (!user) return { success: false, error: 'User not found', repos: [] };

  const token = user.settings?.githubToken;
  if (!token) return { success: false, error: 'GitHub not connected', repos: [] };

  try {
    // Fetch up to 100 repos sorted by most-recently-updated
    const res = await fetch(
      'https://api.github.com/user/repos?sort=updated&per_page=100&affiliation=owner,collaborator',
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
      }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, error: err.message || `GitHub API error ${res.status}`, repos: [] };
    }

    const data = await res.json();
    // Return only the fields the client needs
    const repos = data.map(r => ({
      id:          r.id,
      full_name:   r.full_name,      // "owner/repo-name"
      name:        r.name,
      private:     r.private,
      description: r.description || '',
      updated_at:  r.updated_at,
      html_url:    r.html_url,
    }));

    return { success: true, repos };
  } catch (err) {
    return { success: false, error: `Network error: ${err.message}`, repos: [] };
  }
}

/**
 * Disconnect GitHub — clears the token, GitHub login, and repo from the user's settings.
 */
export async function disconnectGithubAction() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);
  if (!session?.value) return { success: false, error: 'Not authenticated' };

  const user = await dbGetUserByUsernameOrEmail(session.value);
  if (!user) return { success: false, error: 'User not found' };

  const updatedSettings = { ...user.settings };
  delete updatedSettings.githubToken;
  delete updatedSettings.githubLogin;
  delete updatedSettings.githubRepo;

  const updated = await dbUpdateUserProgress(
    user.username,
    user.lessonsProgress,
    user.tasksProgress,
    user.submissions,
    updatedSettings,
    user.streak,
    user.lastActiveDate
  );

  if (!updated) return { success: false, error: 'Failed to disconnect' };
  return { success: true, user: updated };
}


/**
 * Push a Java solution file to the admin's configured GitHub repo.
 * Reads the PAT from the DB (never from the client), so the token
 * is never exposed in the browser network tab.
 *
 * @param {string} filePath     - e.g. "Chapter_1_Introduction/exercise_5.java"
 * @param {string} fileContent  - full file text (comment header + solution code)
 * @param {string} commitMsg    - git commit message
 */
export async function githubPushSolutionAction(filePath, fileContent, commitMsg) {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);
  if (!session?.value) return { success: false, error: 'Not authenticated' };

  const user = await dbGetUserByUsernameOrEmail(session.value);
  if (!user) return { success: false, error: 'User not found' };

  const token = user.settings?.githubToken;
  const repo  = user.settings?.githubRepo; // "owner/repo-name"

  if (!token || !repo) {
    return { success: false, error: 'GitHub token or repo not configured in Settings.' };
  }

  const apiUrl = `https://api.github.com/repos/${repo}/contents/${filePath}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json',
  };

  try {
    // Step 1: Check if the file already exists (need SHA to overwrite)
    let existingSha = null;
    const getRes = await fetch(apiUrl, { method: 'GET', headers });
    if (getRes.ok) {
      const existing = await getRes.json();
      existingSha = existing.sha || null;
    }

    // Step 2: PUT (create or update)
    const body = {
      message: commitMsg,
      content: Buffer.from(fileContent, 'utf-8').toString('base64'),
    };
    if (existingSha) body.sha = existingSha;

    const putRes = await fetch(apiUrl, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });

    if (!putRes.ok) {
      const errData = await putRes.json().catch(() => ({}));
      return {
        success: false,
        error: errData.message || `GitHub API error ${putRes.status}`,
      };
    }

    const result = await putRes.json();
    return {
      success: true,
      url: result.content?.html_url || `https://github.com/${repo}/blob/main/${filePath}`,
    };
  } catch (err) {
    return { success: false, error: `Network error: ${err.message}` };
  }
}

// ─── Project Assignment Actions ───────────────────────────────────────────────

/**
 * Get the project assigned to a user.
 * - Admin callers: always see the full project number (no lock condition).
 * - Student callers: only see the project if they have completed all course videos.
 *   Otherwise returns { locked: true, videosCompleted, totalVideos }.
 *
 * @param {string|null} targetUsername  If provided (admin only), fetch that user's project.
 */
export async function getProjectAssignmentAction(targetUsername = null) {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);
  if (!session?.value) return { success: false, error: 'Not authenticated' };

  const caller = await dbGetUserByUsernameOrEmail(session.value);
  if (!caller) return { success: false, error: 'User not found' };

  const isAdmin = caller.isAdmin === true;

  // Determine which user's project we are checking
  const subjectUsername = targetUsername && isAdmin ? targetUsername : caller.username;
  const subject = targetUsername && isAdmin
    ? await dbGetUserByUsernameOrEmail(targetUsername)
    : caller;

  if (!subject) return { success: false, error: 'Target user not found' };

  const projectNum = subject.settings?.assignedProject ?? null;

  // Admins can always see — no lock
  if (isAdmin) {
    return { success: true, locked: false, projectNumber: projectNum, username: subject.username };
  }

  // For students: check if all course videos are completed
  const videoOnlyDays = courseSchedule.filter(d => d.type === 'video' && d.videos && d.videos.length > 0);
  const totalVideos = videoOnlyDays.reduce((acc, day) => acc + day.videos.length, 0);

  const completedVideoKeys = Object.keys(subject.lessonsProgress || {}).filter(
    key => !key.startsWith('review_') && subject.lessonsProgress[key]?.completed
  );
  const videosCompleted = completedVideoKeys.length;
  const allDone = videosCompleted >= totalVideos;

  // Manual unlock bypass by Admin
  const isUnlockedByAdmin = subject.settings?.projectUnlocked === true;

  if (!allDone && !isUnlockedByAdmin) {
    return {
      success: true,
      locked: true,
      videosCompleted,
      totalVideos,
      projectNumber: null,
    };
  }

  return { success: true, locked: false, projectNumber: projectNum, username: subject.username };
}

/**
 * Admin-only: Assign (or re-assign) a specific project number (1–13) to a user.
 */
export async function assignProjectAction(targetUsername, projectNumber) {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);
  if (!session?.value) return { success: false, error: 'Not authenticated' };

  const caller = await dbGetUserByUsernameOrEmail(session.value);
  if (!caller?.isAdmin) return { success: false, error: 'Admin access required' };

  const target = await dbGetUserByUsernameOrEmail(targetUsername);
  if (!target) return { success: false, error: 'User not found' };

  const updatedSettings = { ...target.settings, assignedProject: Number(projectNumber) };
  const updated = await dbUpdateUserProgress(
    target.username,
    target.lessonsProgress,
    target.tasksProgress,
    target.submissions,
    updatedSettings,
    target.streak,
    target.lastActiveDate
  );

  if (!updated) return { success: false, error: 'Failed to assign project' };
  return { success: true, user: updated };
}

/**
 * Admin-only: Assign random projects to ALL users that don't have one yet.
 * Also re-randomises users where assignedProject is null/undefined.
 */
export async function bulkAssignProjectsAction() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);
  if (!session?.value) return { success: false, error: 'Not authenticated' };

  const caller = await dbGetUserByUsernameOrEmail(session.value);
  if (!caller?.isAdmin) return { success: false, error: 'Admin access required' };

  const users = await dbGetLeaderboard();

  let assignedCount = 0;
  for (const u of users) {
    if (!u.isAdmin && (u.settings?.assignedProject == null)) {
      const projectNum = Math.floor(Math.random() * 13) + 1;
      const updatedSettings = { ...u.settings, assignedProject: projectNum };
      await dbUpdateUserProgress(u.username, u.lessonsProgress, u.tasksProgress, u.submissions, updatedSettings, u.streak, u.lastActiveDate);
      assignedCount++;
    }
  }

  return { success: true, assignedCount };
}

/**
 * Admin-only: Toggle project unlock status for 'مدثر' and 'محمد هاشم' only.
 */
export async function toggleProjectUnlockAction(targetUsername) {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);
  if (!session?.value) return { success: false, error: 'Not authenticated' };

  const caller = await dbGetUserByUsernameOrEmail(session.value);
  if (!caller?.isAdmin) return { success: false, error: 'Admin access required' };

  const allowedUsernames = ['مدثر', 'محمد هاشم'];
  if (!allowedUsernames.includes(targetUsername)) {
    return { success: false, error: 'Manual unlocking is not permitted for this user' };
  }

  const target = await dbGetUserByUsernameOrEmail(targetUsername);
  if (!target) return { success: false, error: 'User not found' };

  const currentUnlocked = target.settings?.projectUnlocked === true;
  const updatedSettings = { ...target.settings, projectUnlocked: !currentUnlocked };

  const updated = await dbUpdateUserProgress(
    target.username,
    target.lessonsProgress,
    target.tasksProgress,
    target.submissions,
    updatedSettings,
    target.streak,
    target.lastActiveDate
  );

  if (!updated) return { success: false, error: 'Failed to toggle project unlock' };
  return { success: true, user: updated };
}

