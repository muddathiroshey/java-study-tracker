'use client';

import { useState, useEffect } from 'react';
import { getDB, calculateUserPoints } from '../lib/storage';
import { getLocalDateString, getActiveStreak, allMissedDaysExcused } from '../lib/dateUtils';
import { courseSchedule } from '../lib/courseData';

const TIER_COLORS = {
  'Grandmaster': 'bg-purple-500 text-white',
  'Master': 'bg-tertiary-fixed text-on-tertiary-fixed font-extrabold uppercase tracking-widest',
  'Mentor': 'bg-surface-container-high text-on-surface-variant font-medium',
  'Scholar': 'bg-surface-container-high text-on-surface-variant font-medium',
  'Rising Star': 'bg-primary text-on-primary font-medium',
  'Contributor': 'bg-surface-container-high text-on-surface-variant font-medium',
};

const getTier = (pts) => {
  if (pts >= 1000) return 'Grandmaster';
  if (pts >= 500) return 'Master';
  if (pts >= 250) return 'Mentor';
  if (pts >= 120) return 'Scholar';
  if (pts >= 50) return 'Rising Star';
  return 'Contributor';
};

const getDepartment = (username) => {
  const name = username.toLowerCase();
  if (name.includes('admin')) return 'System Administrator';
  if (name.includes('ada')) return 'Applied Mathematics';
  if (name.includes('sarah')) return 'Robotics Engineering';
  if (name.includes('linus')) return 'Kernel Development';
  if (name.includes('curry') || name.includes('pascal')) return 'Mathematics';
  return 'Computer Science';
};

const getTrend = (u) => {
  if (u.streak > 2) return { icon: 'trending_up', color: 'text-tertiary' };
  if (u.streak > 0) return { icon: 'horizontal_rule', color: 'text-outline' };
  return { icon: 'trending_down', color: 'text-error' };
};

// Returns true for any admin account or excluded accounts — hides them from the leaderboard
const isAdminUser = (u) => {
  const name = u.username?.toLowerCase() || '';
  return u.isAdmin === true ||
         name.includes('admin') ||
         name === 'مدثر' ||
         name === 'محمد هاشم';
};

export default function Leaderboard({ user }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' | 'top5' | 'active'
  const todayStr = getLocalDateString(user);

  const reload = async () => {
    const db = await getDB();
    if (!db || !db.users) return;
    const scored = db.users
      .filter(u => !isAdminUser(u))
      .map(u => {
        const uTodayStr = getLocalDateString(u);
        const activeStreak = getActiveStreak(u, uTodayStr, courseSchedule);
        return {
          ...u,
          streak: activeStreak,
          points: calculateUserPoints(u),
          videoCount: Object.keys(u.lessonsProgress || {}).filter(k => !k.startsWith('review_') && u.lessonsProgress[k]?.completed).length,
          taskCount: Object.keys(u.tasksProgress || {}).filter(k => u.tasksProgress[k]?.completed).length,
        };
      })
      .sort((a, b) => b.points - a.points);
    setUsers(scored);
    setLoading(false);
  };

  useEffect(() => {
    reload();
    const interval = setInterval(reload, 10000);
    return () => clearInterval(interval);
  }, []);

  const currentUserIndex = users.findIndex(u => u.username.toLowerCase() === user?.username?.toLowerCase());
  const currentUserRank = currentUserIndex + 1;
  const currentUser = users[currentUserIndex];
  const currentPoints = currentUser ? currentUser.points : calculateUserPoints(user);

  const filtered = filter === 'top5' ? users.slice(0, 5) : filter === 'active'
    ? users.filter(u => (u.streak || 0) > 0)
    : users;

  // Top 3 Visual Podiums
  const first = users[0];
  const second = users[1];
  const third = users[2];

  // Calculate points to next rank
  const nextUser = currentUserIndex > 0 ? users[currentUserIndex - 1] : null;
  const ptsToNext = nextUser ? (nextUser.points - currentPoints) : 0;
  const progressToNextPercent = nextUser ? Math.round((currentPoints / nextUser.points) * 100) : 100;

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <span className="material-symbols-outlined text-primary text-5xl">leaderboard</span>
          <p className="text-on-surface-variant font-bold">Loading Rankings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto pt-20 pb-12 select-none min-h-screen">
      <section className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-xl">
        {/* Page Header */}
        <div className="mb-xl flex flex-col md:flex-row md:items-end justify-between gap-lg">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-background mb-sm font-black">Global Rankings</h1>
            <p className="text-body-md text-on-surface-variant max-w-2xl">
              Compete with learners worldwide. Climb the leaderboard by completing lessons, maintaining streaks, and solving coding assignments.
            </p>
          </div>
          <div className="flex gap-sm shrink-0">
            {['all', 'top5', 'active'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-md py-sm rounded-lg font-label-md border transition-colors cursor-pointer capitalize ${
                  filter === f
                    ? 'bg-surface-container-highest text-on-surface border-outline-variant font-bold shadow-sm'
                    : 'bg-surface-container-low text-on-surface-variant border-transparent hover:bg-surface-container-high'
                }`}
              >
                {f === 'all' ? 'All Students' : f === 'top5' ? 'Top 5' : 'Active Streaks'}
              </button>
            ))}
          </div>
        </div>



        {/* Global Rankings Table */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm">
          <div className="p-lg border-b border-outline-variant flex justify-between items-center bg-surface-bright">
            <h2 className="font-title-md text-on-surface font-bold">All Enrolled Students</h2>
            <span className="text-caption text-outline">Real-Time Data Feed</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr class="bg-surface-container-low text-on-surface-variant border-b border-outline-variant">
                  <th className="py-md px-lg font-label-md">Rank</th>
                  <th className="py-md px-lg font-label-md">Learner</th>
                  <th className="py-md px-lg font-label-md text-center">Streak</th>
                  <th className="py-md px-lg font-label-md text-right">Points</th>
                  <th className="py-md px-lg font-label-md text-right">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {filtered.map((u) => {
                  const rank = users.indexOf(u) + 1;
                  const isYou = u.username.toLowerCase() === user?.username?.toLowerCase();
                  const isStreakActive = u.lastActiveDate === todayStr;
                  const isStreakProtected = !isStreakActive && u.lastActiveDate
                    ? allMissedDaysExcused(u.lastActiveDate, todayStr, courseSchedule, u)
                    : false;
                  const showActiveFlame = isStreakActive || isStreakProtected;
                  const trend = getTrend(u);
                  return (
                    <tr 
                      key={u.username}
                      className={`transition-colors group ${
                        isYou ? 'bg-surface-container-high border-y-2 border-primary relative z-10 font-bold' : 'hover:bg-surface-container'
                      }`}
                    >
                      <td className="py-md px-lg">
                        <span className={`text-title-md font-bold ${isYou ? 'text-primary' : 'text-on-surface-variant'}`}>
                          {rank}
                        </span>
                      </td>
                      <td className="py-md px-lg">
                        <div className="flex items-center gap-md">
                          <div className="relative">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${
                              isYou ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant'
                            }`}>
                              {u.username[0].toUpperCase()}
                            </div>
                            {isYou && (
                              <span className="absolute -top-1 -right-1 bg-primary text-on-primary text-[8px] font-bold px-1 rounded-full">
                                YOU
                              </span>
                            )}
                          </div>
                          <div>
                            <p className={`font-bold ${isYou ? 'text-primary' : 'text-on-surface'}`}>{u.username}</p>
                            <p className="text-caption text-on-surface-variant flex items-center gap-1">
                              <span>{u.videoCount} videos · {u.taskCount} tasks</span>
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-md px-lg text-center">
                        <div className={`inline-flex items-center gap-0.5 text-caption font-bold transition-all duration-300 ${
                          showActiveFlame ? 'text-orange-color' : 'text-slate-400 dark:text-zinc-500'
                        }`}>
                          <span 
                            className="material-symbols-outlined text-[16px] transition-all duration-300"
                            style={{ fontVariationSettings: showActiveFlame ? "'FILL' 1" : "'FILL' 0" }}
                          >
                            local_fire_department
                          </span>
                          <span>{u.streak || 0}d{isStreakProtected ? ' 🛡️' : ''}</span>
                        </div>
                      </td>
                      <td className={`py-md px-lg text-right font-bold text-title-md ${isYou ? 'text-primary' : 'text-on-surface'}`}>
                        {u.points.toLocaleString()} XP
                      </td>
                      <td className="py-md px-lg text-right">
                        <span className={`material-symbols-outlined text-sm ${trend.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                          {trend.icon}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Gamification / Stats Section */}
        <div className="mt-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-lg">
          
          <div className="bg-surface-container-low p-lg rounded-xl border border-outline-variant">
            <div className="flex items-center gap-md mb-md">
              <div className="p-sm bg-primary-container rounded-lg text-on-primary-container flex">
                <span className="material-symbols-outlined">military_tech</span>
              </div>
              <h4 className="font-label-md text-on-surface-variant font-bold">Current Rank</h4>
            </div>
            <p className="text-headline-lg font-headline-lg text-on-surface font-black">#{currentUserRank}</p>
            <p className="text-caption text-tertiary flex items-center gap-xs mt-xs">
              <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
                keyboard_double_arrow_up
              </span>
              Top {Math.max(1, Math.round((currentUserRank / users.length) * 100))}% of cohort
            </p>
          </div>

          <div className="bg-surface-container-low p-lg rounded-xl border border-outline-variant">
            <div className="flex items-center gap-md mb-md">
              <div className="p-sm bg-secondary-container rounded-lg text-on-secondary-container flex">
                <span className="material-symbols-outlined">stars</span>
              </div>
              <h4 className="font-label-md text-on-surface-variant font-bold">
                {nextUser ? `Points to #${currentUserRank - 1}` : 'Rank Leader'}
              </h4>
            </div>
            <p className="text-headline-lg font-headline-lg text-on-surface font-black">
              {nextUser ? `${ptsToNext} XP` : 'First Place!'}
            </p>
            <div className="w-full bg-outline-variant h-1.5 rounded-full mt-md overflow-hidden">
              <div className="bg-primary h-full rounded-full" style={{ width: `${progressToNextPercent}%` }}></div>
            </div>
          </div>

          <div className="bg-surface-container-low p-lg rounded-xl border border-outline-variant">
            <div className="flex items-center gap-md mb-md">
              <div className="p-sm bg-on-background rounded-lg text-surface flex">
                <span className="material-symbols-outlined">groups</span>
              </div>
              <h4 className="font-label-md text-on-surface-variant font-bold">Total Learners</h4>
            </div>
            <p className="text-headline-lg font-headline-lg text-on-surface font-black">{users.length}</p>
            <p className="text-caption text-on-surface-variant mt-xs">Active Class Enrollees</p>
          </div>

        </div>
      </section>
    </div>
  );
}
