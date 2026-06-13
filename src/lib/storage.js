// Database helper mapping client actions to server-side SQL/Actions
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
  saveGlobalConfigAction
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
  const todayStr = new Date().toISOString().split('T')[0];
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
    newStreak += 1;
  } else if (diffDays > 1) {
    newStreak = 1;
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
  const streakPoints = (user.streak || 0) * 5;

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
