'use client';

import { ChartColumn, Award, BookOpen, CheckCircle2 } from 'lucide-react';
import { TOPIC_DOMAINS } from '../lib/courseData';

export default function Analytics({ user, schedule }) {
  // 1. Calculate stats
  const totalVideosCount = schedule.reduce((acc, curr) => acc + (curr.videos?.length || 0), 0);
  const completedVideosCount = Object.keys(user.lessonsProgress || {}).filter(
    id => user.lessonsProgress[id]?.completed
  ).length;

  const totalTasksCount = schedule.filter(d => d.task).length;
  const completedTasksCount = Object.keys(user.tasksProgress || {}).filter(
    id => user.tasksProgress[id]?.completed
  ).length;

  const totalItemsCount = totalVideosCount + totalTasksCount;
  const completedItemsCount = completedVideosCount + completedTasksCount;
  const overallPercent = totalItemsCount > 0 ? Math.round((completedItemsCount / totalItemsCount) * 100) : 0;

  // 2. Weekly completions count per day of week (instead of study timer minutes)
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeklyCompletions = [0, 0, 0, 0, 0, 0, 0];

  // Aggregate video completions
  Object.keys(user.lessonsProgress || {}).forEach(vidId => {
    const info = user.lessonsProgress[vidId];
    if (info.completed && info.dateCompleted) {
      try {
        const date = new Date(info.dateCompleted);
        let dayIdx = date.getDay(); // 0 is Sun, 1 is Mon...
        dayIdx = dayIdx === 0 ? 6 : dayIdx - 1; // Map Sun to index 6
        if (dayIdx >= 0 && dayIdx < 7) {
          weeklyCompletions[dayIdx] += 1;
        }
      } catch (e) {}
    }
  });

  // Aggregate task completions
  Object.keys(user.tasksProgress || {}).forEach(taskId => {
    const info = user.tasksProgress[taskId];
    if (info.completed && info.submittedAt) {
      try {
        const date = new Date(info.submittedAt);
        let dayIdx = date.getDay();
        dayIdx = dayIdx === 0 ? 6 : dayIdx - 1;
        if (dayIdx >= 0 && dayIdx < 7) {
          weeklyCompletions[dayIdx] += 1;
        }
      } catch (e) {}
    }
  });

  // Scale calculations for SVG charts
  const maxCompletions = Math.max(...weeklyCompletions, 4);

  // 3. Domain progress calculation
  const getDomainProgress = (domain) => {
    let totalItems = 0;
    let completedItems = 0;

    domain.chapters.forEach(chNum => {
      const days = schedule.filter(d => d.chapterNum === chNum);
      days.forEach(day => {
        if (day.type === 'video' && day.videos) {
          day.videos.forEach(v => {
            totalItems++;
            if (user.lessonsProgress?.[v.videoId]?.completed) completedItems++;
          });
        }
        if (day.task) {
          totalItems++;
          if (user.tasksProgress?.[day.task.taskId]?.completed) completedItems++;
        }
      });
    });

    const percent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    return { totalItems, completedItems, percent };
  };

  // Badges logic
  const badges = [
    { id: 'start', name: 'First Step', desc: 'Watch your first video lesson', unlocked: completedVideosCount > 0 },
    { id: 'task1', name: 'Code Warrior', desc: 'Complete your first practice task', unlocked: completedTasksCount > 0 },
    { id: 'streak', name: 'Dedicated', desc: 'Achieve a 3-day study streak', unlocked: user.streak >= 3 },
    { id: 'oop', name: 'OOP Apprentice', desc: 'Complete Chapter 9 Objects & Classes', unlocked: getDomainProgress(TOPIC_DOMAINS[5]).percent === 100 },
    { id: 'halfway', name: 'Halfway Hero', desc: 'Complete 50% of the curriculum', unlocked: overallPercent >= 50 },
    { id: 'master', name: 'Java Master', desc: 'Complete the entire course', unlocked: overallPercent === 100 }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="border-b border-custom-border pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <ChartColumn className="h-6 w-6 text-primary-color" />
          Study Analytics
        </h1>
        <p className="text-sm text-muted-text mt-1">
          Review your weekly progress charts, domain percentages, and unlocked milestone badges.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chart Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Custom SVG Bar Chart */}
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <div>
              <h3 className="font-bold text-base text-white">Weekly Completions</h3>
              <p className="text-xxs text-muted-text mt-0.5">Lessons and tasks completed per day of the week</p>
            </div>

            {/* SVG Chart */}
            <div className="relative h-64 w-full flex items-end justify-between pt-6 px-4">
              {daysOfWeek.map((day, idx) => {
                const count = weeklyCompletions[idx];
                const heightPercent = (count / maxCompletions) * 100;
                
                return (
                  <div key={day} className="flex flex-col items-center flex-1 space-y-3">
                    {/* Tooltip value */}
                    <span className={`text-[10px] font-bold text-white transition-opacity ${count > 0 ? 'opacity-100' : 'opacity-30'}`}>
                      {count} item{count !== 1 ? 's' : ''}
                    </span>

                    {/* Bar */}
                    <div className="w-8 bg-white/5 rounded-t-lg h-36 flex items-end relative">
                      <div 
                        className="w-full bg-gradient-to-t from-primary-color to-secondary-color rounded-t-lg transition-all duration-500 shadow-lg shadow-primary-glow/10"
                        style={{ height: `${heightPercent}%` }}
                      ></div>
                    </div>

                    {/* Label */}
                    <span className="text-xs font-semibold text-muted-text">{day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Domain progress indicators */}
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-base text-white">Detailed Topic Breakdown</h3>
            <div className="space-y-4">
              {TOPIC_DOMAINS.map(domain => {
                const stats = getDomainProgress(domain);
                return (
                  <div key={domain.id} className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold text-white">
                      <span>{domain.name}</span>
                      <span className="text-muted-text">{stats.completedItems} / {stats.totalItems} elements</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-grow bg-white/5 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-primary-color to-emerald-color h-full rounded-full transition-all duration-300"
                          style={{ width: `${stats.percent}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-white w-8 text-right">{stats.percent}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Badges / Achievements Panel */}
        <div className="space-y-6">
          <div className="glass-panel rounded-2xl p-6 space-y-5">
            <h3 className="font-bold text-base text-white border-b border-custom-border pb-3 flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-color" />
              Achievements
            </h3>

            <div className="space-y-4">
              {badges.map(badge => (
                <div 
                  key={badge.id}
                  className={`flex gap-3 items-start p-3 rounded-xl border transition-colors ${
                    badge.unlocked 
                      ? 'bg-amber-color/5 border-amber-color/20 text-white font-sans' 
                      : 'bg-white/1 border-custom-border text-muted-text opacity-40'
                  }`}
                >
                  <div className={`p-2 rounded-lg shrink-0 ${
                    badge.unlocked ? 'bg-amber-color/10 text-amber-color' : 'bg-white/5 text-muted-text'
                  }`}>
                    {badge.unlocked ? (
                      <CheckCircle2 className="h-5 w-5 fill-current bg-black rounded-full" />
                    ) : (
                      <Award className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{badge.name}</h4>
                    <p className="text-[10px] text-muted-text mt-0.5">{badge.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
