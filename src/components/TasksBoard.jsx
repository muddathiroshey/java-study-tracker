'use client';

import { useApp } from '../context/AppContext';

export default function TasksBoard({ user, schedule, onSelectDay }) {
  const taskDays = schedule.filter(d => d.task);
  
  const getTaskStatus = (taskId) => {
    return user?.tasksProgress?.[taskId]?.completed ? 'completed' : 'pending';
  };

  const completedCount = taskDays.filter(d => getTaskStatus(d.task.taskId) === 'completed').length;
  const totalCount = taskDays.length;
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Render weekly productivity mockup representing actual progress
  const activeStreak = user?.streak || 0;
  
  // Custom mock heights for daily bars to look premium, with today being the tallest if active
  const barHeights = ['h-1/3', 'h-2/3', 'h-1/2', 'h-3/4', 'h-full', 'h-[85%]', 'h-[40%]'];

  return (
    <div className="flex-grow overflow-y-auto pt-24 pb-12 px-4 md:px-8 select-none min-h-screen">
      <main className="max-w-5xl mx-auto w-full">
        {/* Header */}
        <header className="mb-xl flex flex-col md:flex-row md:items-end justify-between gap-md">
          <div>
            <h1 className="font-headline-lg text-headline-lg font-black text-on-background">Tasks &amp; Assignments</h1>
            <p className="text-body-md text-on-surface-variant mt-1">Manage your post-lesson activities and track academic progress.</p>
          </div>
        </header>

        {/* HackerRank callout banner card */}
        <div className="mb-lg p-lg bg-surface-container-lowest border border-outline-variant rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-md shadow-sm select-none">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-primary text-xl mt-0.5">code</span>
            <div>
              <p className="text-body-sm font-bold text-on-surface">Additional Practice on HackerRank</p>
              <p className="text-[11px] text-on-surface-variant mt-1 leading-relaxed">
                Looking for more challenges? Practice fundamental programming problems, algorithms, and data structures on HackerRank's Java preparation track.
              </p>
            </div>
          </div>
          <a 
            href="https://www.hackerrank.com/domains/java"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-lg py-2 bg-primary text-on-primary rounded font-bold text-caption hover:opacity-90 transition-opacity text-center whitespace-nowrap cursor-pointer"
          >
            Solve Extra Problems
          </a>
        </div>

        {/* Kanban Board / Tasks List */}
        <div className="flex flex-col gap-lg bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 shadow-sm">
          <div className="flex items-center justify-between px-sm mb-2">
            <h2 className="text-title-md font-title-md font-bold text-on-background">All Tasks</h2>
            <span className="bg-surface-container-high text-on-surface-variant px-sm py-0.5 rounded-full text-caption font-bold">
              {totalCount} total
            </span>
          </div>

          <div className="flex flex-col gap-md">
            {taskDays.map((day) => {
              const task = day.task;
              const isCompleted = getTaskStatus(task.taskId) === 'completed';
              
              const dayDate = new Date(day.date || '2026-06-14');
              const currentDate = new Date();
              const isLocked = dayDate > currentDate && !user?.settings?.devWarpTime && !user?.settings?.openAvailability;

              return (
                <div
                  key={task.taskId}
                  onClick={() => !isLocked && onSelectDay(day.day)}
                  className={`task-card p-md rounded-xl border transition-all flex items-start gap-md ${
                    isCompleted
                      ? 'bg-surface-container-low border-outline-variant/60 opacity-75 cursor-pointer hover:bg-surface-container-high'
                      : isLocked
                      ? 'bg-surface-container-low/40 border-outline-variant/30 opacity-50 cursor-not-allowed'
                      : 'bg-surface-container-lowest border-outline-variant hover:border-primary hover:shadow-md cursor-pointer hover:-translate-y-0.5'
                  }`}
                >
                  {/* Status Checkbox Icon */}
                  <div className="mt-1 shrink-0">
                    {isCompleted ? (
                      <span className="material-symbols-outlined text-tertiary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                        check_circle
                      </span>
                    ) : isLocked ? (
                      <span className="material-symbols-outlined text-outline text-2xl">
                        lock
                      </span>
                    ) : (
                      <span className="material-symbols-outlined text-outline text-2xl">
                        radio_button_unchecked
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Tag Header Row */}
                    <div className="flex justify-between items-start mb-sm gap-2">
                      <span className={`px-sm py-0.5 rounded-full text-caption font-bold ${
                        isCompleted
                          ? 'bg-tertiary/10 text-tertiary'
                          : isLocked
                          ? 'bg-surface-container text-outline'
                          : 'bg-primary-fixed text-on-primary-fixed-variant'
                      }`}>
                        {isCompleted ? 'Done' : isLocked ? 'Locked' : 'Coding'}
                      </span>
                      <span className="text-caption text-outline font-semibold">
                        Day {day.day}
                      </span>
                    </div>

                    {/* Task Title */}
                    <h3 className={`font-bold text-on-background mb-xs truncate ${
                      isCompleted ? 'line-through opacity-60 text-on-surface-variant' : isLocked ? 'text-outline' : ''
                    }`}>
                      {task.title}
                    </h3>

                    {/* Task Description */}
                    <p className={`text-caption text-on-surface-variant mb-md leading-relaxed ${
                      isCompleted ? 'opacity-65' : isLocked ? 'opacity-40' : ''
                    }`}>
                      {task.description}
                    </p>

                    {/* Day / Source Module */}
                    <div className="flex items-center gap-xs text-caption font-semibold text-secondary">
                      <span className="material-symbols-outlined text-[16px]">history_edu</span>
                      <span>From {day.chapterTitle} ({day.dayOfWeek})</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bento Grid Section: Insights */}
        <section className="mt-xl grid grid-cols-1 md:grid-cols-4 gap-lg">
          {/* Weekly Productivity Bar Chart */}
          <div className="md:col-span-2 bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="font-title-md text-title-md font-bold text-on-background mb-sm">Weekly Activity</h4>
              <div className="flex items-end gap-sm h-32 mt-md">
                {barHeights.map((hClass, idx) => (
                  <div key={idx} className="flex-1 flex flex-col justify-end h-full">
                    <div className={`w-full bg-primary/20 rounded-t-lg ${hClass} ${idx === 4 ? 'bg-primary' : ''}`}></div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-sm text-caption text-outline font-semibold">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
            </div>
          </div>

          {/* Focus Streak Card */}
          <div className="md:col-span-1 bg-secondary-container p-lg rounded-xl text-on-secondary-container flex flex-col justify-between shadow-sm">
            <div>
              <span className="material-symbols-outlined text-display-lg" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
              <h4 className="text-title-md font-title-md font-bold mt-md">Focus Streak</h4>
            </div>
            <div>
              <span className="text-[40px] font-black">{activeStreak}</span>
              <span className="text-body-md font-bold opacity-80"> Days</span>
            </div>
          </div>

          {/* Overall Progress Circle */}
          <div className="md:col-span-1 bg-surface-container-lowest p-lg rounded-xl border border-outline-variant flex flex-col items-center justify-center text-center shadow-sm">
            <div className="relative w-24 h-24 mb-md">
              <svg className="w-full h-full transform -rotate-90">
                <circle className="text-surface-container" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeWidth="8"></circle>
                <circle 
                  className="text-tertiary-container" 
                  cx="48" 
                  cy="48" 
                  fill="transparent" 
                  r="40" 
                  stroke="currentColor" 
                  strokeDasharray="251.2" 
                  strokeDashoffset={251.2 - (251.2 * pct) / 100}
                  strokeWidth="8"
                  strokeLinecap="round"
                ></circle>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-black text-title-md">{pct}%</div>
            </div>
            <span className="text-label-md font-bold text-on-surface">Overall Solved</span>
          </div>
        </section>
      </main>
    </div>
  );
}
