// Database helper mapping client actions to server-side SQL/Actions
import { getLocalDateString, allMissedDaysExcused, getActiveStreak } from './dateUtils';
import { courseSchedule } from './courseData';
import {
  getCurrentUserSessionAction,
  loginUserAction,
  registerUserAction,
  logoutUserAction,
  updateUserProgressAction,
  updateUserStreakAction,
  updateUserProfileAction,
  createAdminAccountAction,
  getLeaderboardAction,
  getStoredScheduleAction,
  saveStoredScheduleAction,
  getGlobalConfigAction,
  saveGlobalConfigAction,
  runJavaCodeAction,
  deleteUserAccountAction,
  getProjectAssignmentAction,
  assignProjectAction,
  bulkAssignProjectsAction,
  toggleProjectUnlockAction
} from '../app/actions';

export async function getDB() {
  const users = await getLeaderboardAction();
  return { users };
}

export function saveDB(db) {
  // Client-side saveDB is a no-op since state is stored in SQL on the server
}

// Custom Schedule Persistence
export async function getStoredSchedule(defaultSchedule) {
  return await getStoredScheduleAction(defaultSchedule);
}

export async function saveStoredSchedule(schedule) {
  return await saveStoredScheduleAction(schedule);
}

export function resetStoredSchedule() {
  // No-op or clear local cookies via logout
}

export async function getCurrentUserSession() {
  return await getCurrentUserSessionAction();
}

export async function loginUser(usernameOrEmail, password) {
  return await loginUserAction(usernameOrEmail, password);
}

export async function registerUser(name, email, password) {
  return await registerUserAction(name, email, password);
}

export async function logoutUser() {
  return await logoutUserAction();
}

export async function updateUserProgress(username, updateFn) {
  const currentUser = await getCurrentUserSession();
  if (!currentUser) return null;
  
  const updatedUser = updateFn(currentUser);
  const result = await updateUserProgressAction(
    username, 
    updatedUser.lessonsProgress, 
    updatedUser.tasksProgress, 
    updatedUser.submissions,
    updatedUser.settings,
    updatedUser.streak,
    updatedUser.lastActiveDate
  );
  return result;
}

export async function updateUserProfile(oldUsername, name, email, password) {
  return await updateUserProfileAction(oldUsername, name, email, password);
}

export async function createAdminAccount(name, email, password) {
  return await createAdminAccountAction(name, email, password);
}

export function checkAndUpdateStreak(user) {
  const todayStr = getLocalDateString(user);
  const lastActive = user.lastActiveDate;
  
  if (!lastActive) {
    user.streak = 1;
    user.lastActiveDate = todayStr;
    return user;
  }
  
  if (lastActive === todayStr) {
    if (!user.streak || user.streak < 1) {
      user.streak = 1;
    }
    return user;
  }
  
  const lastDate = new Date(lastActive);
  const todayDate = new Date(todayStr);
  const diffTime = Math.abs(todayDate - lastDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  let newStreak = user.streak;
  if (diffDays === 1) {
    // Consecutive day — increment
    newStreak += 1;
  } else if (diffDays > 1) {
    // Gap exists — check if all missed days were excused (Friday rest day or nothing to study)
    if (allMissedDaysExcused(lastActive, todayStr, courseSchedule, user)) {
      // Excused gap: keep the streak alive, just don't increment
      // (no-op — newStreak stays as-is)
    } else {
      newStreak = 1;
    }
  }
  
  user.streak = newStreak;
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
  const todayStr = getLocalDateString(user);
  const activeStreak = getActiveStreak(user, todayStr, courseSchedule);
  const streakPoints = activeStreak * 5;

  // 5. Project submissions
  const compProjects = Object.keys(user.submissions || {}).length;

  return (compVideos * 10) + (compTasks * 25) + (compReviews * 15) + (compProjects * 50) + streakPoints;
}

export async function getGlobalConfig() {
  return await getGlobalConfigAction();
}

export async function saveGlobalConfig(config) {
  return await saveGlobalConfigAction(config);
}

export async function runJavaCode(code) {
  return await runJavaCodeAction(code);
}

export async function deleteUserAccount(username) {
  return await deleteUserAccountAction(username);
}

// ─── Project Assignment Helpers ────────────────────────────────────────────

/**
 * Get the logged-in user's project assignment.
 * Pass targetUsername to let admins query another user's project.
 */
export async function getProjectAssignment(targetUsername = null) {
  return await getProjectAssignmentAction(targetUsername);
}

/** Admin-only: assign a specific project (1–13) to a user. */
export async function assignProject(username, projectNumber) {
  return await assignProjectAction(username, projectNumber);
}

/** Admin-only: bulk-assign random projects to all unassigned users. */
export async function bulkAssignProjects() {
  return await bulkAssignProjectsAction();
}

/** Admin-only: toggle project unlock state for 'مدثر' or 'محمد هاشم' */
export async function toggleProjectUnlock(username) {
  return await toggleProjectUnlockAction(username);
}
