'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../context/AppContext';

// Icons rendered as Material Symbols spans
const timeToSecs = (t) => {
  if (!t) return 0;
  const parts = t.toString().split(':').map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0] || 0;
};

const weekTitles = {
  1: "Fundamentals of Computers & Elementary Programming",
  2: "Selections, Mathematical Functions & Strings",
  3: "Loops & Helper Methods",
  4: "Arrays & CLI Dungeon Crawler Project",
  5: "Objects, Classes & API Types",
  6: "Thinking in Objects & ATM Banking Project",
  7: "Inheritance & Polymorphism",
  8: "Interfaces, Exceptions & Multi-Account Bank Project",
  9: "Final Capstone Project & Graduation"
};


export default function DailyLessons({ 
  user, 
  currentDate, 
  schedule,
  onSelectDay,
  searchQuery = ''
}) {
  const { globalConfig } = useApp();
  const current = new Date(currentDate);
  const [expandedWeeks, setExpandedWeeks] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('dailyLessons_expandedWeeks');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return {};
  });

  useEffect(() => {
    if (Object.keys(expandedWeeks).length > 0) {
      sessionStorage.setItem('dailyLessons_expandedWeeks', JSON.stringify(expandedWeeks));
    }
  }, [expandedWeeks]);
  const scrollContainerRef = useRef(null);
  const scrollRestoredRef = useRef(false);
  const SCROLL_KEY = 'dailyLessons_scrollY';

  const getWeekDateRangeString = (weekNum) => {
    const startDay = (weekNum - 1) * 7 + 1;
    const endDay = weekNum * 7;
    const weekDays = schedule.filter(d => d.day >= startDay && d.day <= endDay);
    if (!weekDays.length) return '';
    const dates = weekDays.map(d => d.date).filter(Boolean);
    if (!dates.length) return '';
    dates.sort();
    
    const dStart = new Date(dates[0]);
    const dEnd = new Date(dates[dates.length - 1]);
    
    const optStart = { month: 'short', day: 'numeric' };
    const optEnd = { month: 'short', day: 'numeric', year: 'numeric' };
    
    if (dStart.getFullYear() === dEnd.getFullYear()) {
      return `${dStart.toLocaleDateString('en-US', optStart)} – ${dEnd.toLocaleDateString('en-US', optEnd)}`;
    }
    return `${dStart.toLocaleDateString('en-US', optEnd)} – ${dEnd.toLocaleDateString('en-US', optEnd)}`;
  };

  const isDayCompleted = (day) => {
    if (day.type === 'off') return true;
    if (day.type === 'project') {
      return !!user.submissions?.[day.day];
    }
    if (day.type === 'review') {
      return !!user.lessonsProgress?.[`review_${day.day}`]?.completed;
    }
    if (day.type === 'video') {
      const allVids = day.videos || [];
      const hasTask = !!day.task;
      
      const vidsCompleted = allVids.every(v => user.lessonsProgress?.[v.videoId + "_day" + day.day]?.completed);
      const taskCompleted = hasTask ? user.tasksProgress?.[day.task.taskId]?.completed : true;
      
      return vidsCompleted && taskCompleted;
    }
    return false;
  };

  const getWeekProgress = (weekNum) => {
    const startDay = (weekNum - 1) * 7 + 1;
    const endDay = weekNum * 7;
    const weekDays = schedule.filter(d => d.day >= startDay && d.day <= endDay);
    const activeDays = weekDays.filter(d => d.type !== 'off');
    if (activeDays.length === 0) return { pct: 100, completed: true, completedCount: 0, totalCount: 0 };

    let totalItems = 0;
    let completedItems = 0;

    activeDays.forEach(day => {
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

    if (totalItems === 0) return { pct: 100, completed: true, completedCount: 0, totalCount: 0 };
    
    const pct = Math.round((completedItems / totalItems) * 100);
    return {
      pct,
      completed: completedItems === totalItems,
      completedCount: completedItems,
      totalCount: totalItems
    };
  };

  const getWeekLockState = (weekNum) => {
    const isWarped = user?.settings?.devWarpTime;
    const isOpen = user?.settings?.openAvailability || globalConfig?.openAvailabilityForAll;
    
    if (isWarped || isOpen) {
      return { locked: false };
    }

    const sundayDayNum = (weekNum - 1) * 7 + 1;
    const sundayDay = schedule.find(d => d.day === sundayDayNum);
    if (!sundayDay) return { locked: true };

    const sundayDate = new Date(sundayDay.date || '2026-06-14');
    const locked = sundayDate > current;
    return { locked };
  };

  // ── Find the "current position" in the schedule ────────────────────────────
  // Returns { weekNum, dayNum } of the last-started/in-progress day,
  // or the first incomplete unlocked day as a fallback.
  const findCurrentPosition = useCallback(() => {
    if (!schedule.length) return null;

    // 1. Find the day with the most-recent video progress (by lastPosition timestamp)
    let bestDay = null;
    let bestTs = -1;

    schedule.forEach(day => {
      if (day.type !== 'video' || !day.videos) return;
      day.videos.forEach(vid => {
        const prog = user?.lessonsProgress?.[vid.videoId + '_day' + day.day];
        if (prog && !prog.completed && prog.lastPosition > 0) {
          const ts = prog.savedAt ? new Date(prog.savedAt).getTime() : prog.lastPosition;
          if (ts > bestTs) {
            bestTs = ts;
            bestDay = day;
          }
        }
      });
    });

    if (bestDay) {
      const weekNum = Math.ceil(bestDay.day / 7);
      return { weekNum, dayNum: bestDay.day };
    }

    // 2. Fallback: first incomplete unlocked day
    for (let w = 1; w <= 9; w++) {
      const { locked } = getWeekLockState(w);
      if (locked) continue;
      const { completed } = getWeekProgress(w);
      if (!completed) {
        const startDay = (w - 1) * 7 + 1;
        const endDay = w * 7;
        const weekDays = schedule.filter(d => d.day >= startDay && d.day <= endDay && d.type !== 'off');
        const firstIncomplete = weekDays.find(d => !isDayCompleted(d));
        if (firstIncomplete) return { weekNum: w, dayNum: firstIncomplete.day };
        return { weekNum: w, dayNum: null };
      }
    }
    return null;
  }, [schedule, user]);

  // ── Save scroll position while scrolling ────────────────────────────────────
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const onScroll = () => {
      sessionStorage.setItem(SCROLL_KEY, String(el.scrollTop));
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  // ── Auto-expand weeks + scroll on mount ────────────────────────────────────
  useEffect(() => {
    if (!schedule.length) return;

    const savedScroll = sessionStorage.getItem(SCROLL_KEY);
    const savedExpanded = sessionStorage.getItem('dailyLessons_expandedWeeks');

    if (savedScroll !== null) {
      // ── RESTORE PREVIOUS SESSION STATE ──
      // If we don't have saved expanded weeks, calculate default initial expanded weeks
      if (!savedExpanded) {
        const initialExpanded = {};
        for (let w = 1; w <= 9; w++) {
          const { locked } = getWeekLockState(w);
          if (!locked) {
            const { completed } = getWeekProgress(w);
            initialExpanded[w] = !completed;
          }
        }
        setExpandedWeeks(prev => ({ ...initialExpanded, ...prev }));
      }

      // Restore scroll exactly
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const el = scrollContainerRef.current;
          if (el) el.scrollTop = parseInt(savedScroll, 10);
          scrollRestoredRef.current = true;
        });
      });
    } else {
      // ── FRESH LOAD / LOGIN: smart-scroll to last lesson ──
      const initialExpanded = {};
      let firstActiveFound = false;
      for (let w = 1; w <= 9; w++) {
        const { locked } = getWeekLockState(w);
        if (!locked) {
          const { completed } = getWeekProgress(w);
          if (!completed && !firstActiveFound) {
            initialExpanded[w] = true;
            firstActiveFound = true;
          } else {
            initialExpanded[w] = false;
          }
        }
      }
      if (!firstActiveFound) {
        const { locked } = getWeekLockState(1);
        if (!locked) initialExpanded[1] = true;
      }
      setExpandedWeeks(prev => ({ ...initialExpanded, ...prev }));

      // Scroll to current position after DOM settles
      const pos = findCurrentPosition();
      if (pos) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            const targetId = pos.dayNum
              ? `day-${pos.dayNum}`
              : `week-${pos.weekNum}`;
            const el = document.getElementById(targetId);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            scrollRestoredRef.current = true;
          });
        });
      }
    }
  }, [schedule, user]);

  const getFilteredDaysForWeek = (weekNum) => {
    const startDay = (weekNum - 1) * 7 + 1;
    const endDay = weekNum * 7;
    const weekDays = schedule.filter(d => d.day >= startDay && d.day <= endDay);

    if (!searchQuery.trim()) return weekDays;
    const q = searchQuery.toLowerCase();
    return weekDays.filter(day => {
      const titleMatch = day.title.toLowerCase().includes(q);
      const chapterMatch = day.chapterTitle?.toLowerCase().includes(q) || false;
      const dayOfWeekMatch = day.dayOfWeek.toLowerCase().includes(q);
      return titleMatch || chapterMatch || dayOfWeekMatch;
    });
  };

  const toggleWeek = (weekNum) => {
    const { locked } = getWeekLockState(weekNum);
    if (locked) return;
    setExpandedWeeks(prev => ({
      ...prev,
      [weekNum]: !prev[weekNum]
    }));
  };

  const isWeekExpanded = (weekNum) => {
    if (searchQuery.trim()) {
      return getFilteredDaysForWeek(weekNum).length > 0;
    }
    return !!expandedWeeks[weekNum];
  };

  const getDayProgressDetails = (day) => {
    if (day.type !== 'video') return null;
    const allVids = day.videos || [];
    const hasTask = !!day.task;
    
    const totalVideos = allVids.length;
    const completedVideos = allVids.filter(v => user.lessonsProgress?.[v.videoId + "_day" + day.day]?.completed).length;
    const taskCompleted = hasTask ? !!user.tasksProgress?.[day.task.taskId]?.completed : null;
    
    return {
      totalVideos,
      completedVideos,
      hasTask,
      taskCompleted
    };
  };

  return (
    <div ref={scrollContainerRef} className="flex-1 overflow-y-auto pt-24 pb-12 px-md md:px-margin-desktop min-h-screen select-none">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Weekly Cards timeline container */}
        <div className="space-y-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((weekNum) => {
            const { locked } = getWeekLockState(weekNum);
            const { pct, completed, completedCount, totalCount } = getWeekProgress(weekNum);
            const expanded = isWeekExpanded(weekNum);
            const filteredDays = getFilteredDaysForWeek(weekNum);

            // Skip rendering week if search query is active and there are no matching days inside this week
            if (searchQuery.trim() && filteredDays.length === 0) {
              return null;
            }

            return (
              <div 
                key={weekNum}
                id={`week-${weekNum}`}
                className={`rounded-2xl border transition-all select-none overflow-hidden ${
                  locked 
                    ? 'bg-surface-container-low/40 border-outline-variant/30 opacity-75' 
                    : 'bg-surface-container-lowest border-outline-variant shadow-sm hover:shadow-md'
                }`}
              >
                {/* Week Card Header Row */}
                <div 
                  onClick={() => toggleWeek(weekNum)}
                  className={`p-lg flex items-center justify-between gap-md ${
                    locked ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-surface-container-low/40'
                  }`}
                >
                  <div className="flex items-center gap-md min-w-0">
                    {/* Left Side Icon Circle */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                      locked 
                        ? 'bg-outline-variant/20 text-outline' 
                        : completed 
                        ? 'bg-tertiary/10 text-tertiary' 
                        : 'bg-primary/10 text-primary'
                    }`}>
                      {locked ? (
                        <span className="material-symbols-outlined text-[20px]">lock</span>
                      ) : completed ? (
                        <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                      ) : (
                        <span className="material-symbols-outlined text-[20px]">play_circle</span>
                      )}
                    </div>

                    {/* Text Title & Subtitle */}
                    <div className="min-w-0">
                      <h3 className={`font-bold text-title-md truncate ${
                        locked ? 'text-outline' : 'text-on-surface'
                      }`}>
                        Week {weekNum}: {weekTitles[weekNum]}
                      </h3>
                      <p className="text-caption text-on-surface-variant/80 mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                        {locked ? (
                          <span>Locked</span>
                        ) : completed ? (
                          <span className="text-tertiary font-semibold">Fully Completed · All Lectures & Tasks Solved</span>
                        ) : (
                          <span>
                            In Progress · {completedCount} of {totalCount} completed ({pct}%)
                          </span>
                        )}
                        {getWeekDateRangeString(weekNum) && (
                          <>
                            <span className="text-outline-variant/80">•</span>
                            <span className="font-semibold text-primary">{getWeekDateRangeString(weekNum)}</span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Right expansion chevron toggle */}
                  {!locked && (
                    <span 
                      className={`material-symbols-outlined text-on-surface-variant transition-transform duration-300 transform ${
                        expanded ? 'rotate-180' : 'rotate-0'
                      }`}
                    >
                      expand_more
                    </span>
                  )}
                </div>

                {/* Week Expanded Contents (List of Days) */}
                {expanded && !locked && (
                  <div className="p-lg pt-4 border-t border-outline-variant/30 bg-surface-container-lowest/30 space-y-8 relative">
                    {filteredDays.map((day, idx) => {
                      const dayCompleted = isDayCompleted(day);
                      const isOff = day.type === 'off';
                      const isReview = day.type === 'review';
                      const isProject = day.type === 'project';

                      return (
                        <div key={day.day} id={`day-${day.day}`} className="relative flex gap-lg group">
                          {/* Timeline connector line (Ends at the last element of this week) */}
                          {idx < filteredDays.length - 1 && (
                            <div className={`timeline-connector ${
                              dayCompleted ? 'bg-tertiary-container' : 'bg-outline-variant/40'
                            }`}></div>
                          )}

                          {/* Left side dot */}
                          <div className="z-10 mt-1 shrink-0">
                            {isOff ? (
                              <div className="w-12 h-12 rounded-full bg-amber-color/10 border-2 border-amber-color/40 flex items-center justify-center text-amber-color">
                                <span className="material-symbols-outlined text-[20px]">coffee</span>
                              </div>
                            ) : dayCompleted ? (
                              <div className="w-12 h-12 rounded-full bg-tertiary flex items-center justify-center text-on-tertiary">
                                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                              </div>
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-on-primary active-dot font-extrabold text-label-md">
                                {day.day}
                              </div>
                            )}
                          </div>

                          {/* Right side content */}
                          <div className="flex-grow pb-4 min-w-0">
                            {/* Row Header */}
                            <div className="flex flex-wrap items-center gap-sm mb-md">
                              <span className="text-caption font-mono font-bold text-muted-text uppercase tracking-wider bg-surface-container-low px-2 py-0.5 rounded border border-outline-variant/50">
                                {day.dayOfWeek.slice(0, 3)}
                              </span>
                              <h3 className="text-title-md font-title-md font-bold truncate text-on-background">
                                Day {day.day}: {day.title}
                              </h3>
                              
                              {/* Status badges */}
                              {isOff ? (
                                <span className="px-sm py-xs bg-amber-color/10 text-amber-color border border-amber-color/20 text-caption rounded-lg font-bold">Rest Day</span>
                              ) : dayCompleted ? (
                                <span className="px-sm py-xs bg-tertiary-container text-on-tertiary-container text-caption rounded-lg font-bold">Completed</span>
                              ) : (
                                <span className="px-sm py-xs bg-secondary-container text-on-secondary-container text-caption rounded-lg font-bold">Ready to Study</span>
                              )}

                              {/* Chapter Title */}
                              {day.chapterTitle && !isOff && (
                                <span className="text-caption text-on-surface-variant/80 ml-auto hidden sm:inline truncate max-w-[200px]">
                                  {day.chapterTitle}
                                </span>
                              )}
                            </div>

                            {/* Day Content Area */}
                            {isOff ? (
                              <div className="glass-card p-lg rounded-xl border border-outline-variant/50 flex flex-col gap-sm bg-amber-color/[0.01]">
                                <div className="flex justify-between items-start gap-4">
                                  <div>
                                    <h4 className="text-body-md font-bold text-on-surface">Weekly Rest & Recharge</h4>
                                    <p className="text-caption text-on-surface-variant mt-1 leading-relaxed">
                                      Take a complete break from active lectures. Revise notes, work on lightweight OOP practice projects, or rest up!
                                    </p>
                                  </div>
                                  <span className="material-symbols-outlined text-amber-color text-display-lg opacity-40 shrink-0">relax</span>
                                </div>
                              </div>
                            ) : isReview ? (
                              <div className="glass-card p-lg rounded-xl border border-outline-variant/50 flex flex-col gap-sm bg-indigo-500/[0.01]">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md">
                                  <div>
                                    <h4 className="text-body-md font-bold text-on-surface">OOP Synthesis & Knowledge Recap</h4>
                                    <p className="text-caption text-on-surface-variant mt-1">
                                      Review notes, check code tasks, and ensure core concepts are consolidated.
                                    </p>
                                  </div>
                                  <button 
                                    onClick={() => onSelectDay(day.day)}
                                    className="px-lg py-sm bg-primary text-on-primary font-bold rounded-lg text-caption hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
                                  >
                                    Start Review
                                  </button>
                                </div>
                              </div>
                            ) : isProject ? (
                              <div 
                                onClick={() => onSelectDay(day.day)}
                                className="glass-card p-lg rounded-xl border border-outline-variant/50 flex flex-col gap-sm bg-primary/[0.01] cursor-pointer hover:bg-surface-container-low hover:-translate-y-0.5 transition-all duration-200"
                              >
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md">
                                  <div className="flex-grow min-w-0 pr-4">
                                    <h4 className="text-body-md font-bold text-on-surface">{day.title}</h4>
                                    <p className="text-caption text-on-surface-variant mt-1 leading-relaxed">
                                      {day.task?.description || 'Build and submit your OOP mini-project.'}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              /* Active Video/Task Day Content */
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                                {/* Video Item(s) Card */}
                                {day.videos?.map((vid) => {
                                  const isVidCompleted = !!user.lessonsProgress?.[vid.videoId + "_day" + day.day]?.completed;
                                  const savedProg = user.lessonsProgress?.[vid.videoId + "_day" + day.day];
                                  
                                  const vStart = timeToSecs(vid.assignedStart || '00:00:00');
                                  const vEnd = timeToSecs(vid.assignedEnd || vid.duration || '00:00:00');
                                  const vDur = Math.max(1, vEnd - vStart);
                                  
                                  // Check if they started the video
                                  const hasStarted = savedProg && !savedProg.completed && savedProg.lastPosition > vStart + 1;
                                  const currentPos = savedProg ? (savedProg.lastPosition - vStart) : 0;
                                  const pct = Math.min(100, Math.max(0, (currentPos / vDur) * 100));

                                  return (
                                    <div 
                                      key={vid.videoId}
                                      onClick={() => onSelectDay(day.day)}
                                      className="p-lg rounded-xl flex flex-col gap-sm transition-all duration-200 cursor-pointer glass-card hover:bg-surface-container-low hover:-translate-y-0.5"
                                    >
                                      <div className="flex justify-between items-start min-w-0">
                                        <h4 className="text-body-md font-bold text-on-surface truncate pr-2" title={vid.title}>
                                          {vid.title}
                                        </h4>
                                        {/* Calculate actual assigned segment duration */}
                                        {(() => {
                                          const start = timeToSecs(vid.assignedStart || '00:00:00');
                                          const end = timeToSecs(vid.assignedEnd || vid.duration || '00:00:00');
                                          const segDur = Math.max(0, end - start);
                                          const h = Math.floor(segDur / 3600);
                                          const m = Math.floor((segDur % 3600) / 60);
                                          const s = segDur % 60;
                                          const formatted = h > 0 
                                            ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
                                            : `${m}:${s.toString().padStart(2, '0')}`;
                                          return (
                                            <span className="text-caption text-on-surface-variant shrink-0">{formatted}</span>
                                          );
                                        })()}
                                      </div>
                                      
                                      <div className="mt-auto flex items-center justify-between pt-2 border-t border-outline-variant/30">
                                        {isVidCompleted ? (
                                          <div className="flex items-center gap-1.5 text-tertiary font-bold">
                                            <span className="material-symbols-outlined text-[18px]">verified</span>
                                            <span className="text-caption">Completed</span>
                                          </div>
                                        ) : hasStarted ? (
                                          <div className="flex-1 pr-4">
                                            {/* Progress bar accurate to where they stopped (RED color) */}
                                            <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                                              <div className="bg-error h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: 'var(--color-error, #ba1a1a)' }}></div>
                                            </div>
                                            <span className="text-[10px] text-error font-bold mt-1 block">Resume ({Math.round(pct)}% watched)</span>
                                          </div>
                                        ) : (
                                          <div className="flex-1">
                                            <span className="text-[11px] text-primary font-bold flex items-center gap-0.5">
                                              <span className="material-symbols-outlined text-[15px]">play_arrow</span>
                                              Start Lesson
                                            </span>
                                          </div>
                                        )}
                                        
                                        <span className="material-symbols-outlined text-primary text-[20px] ml-auto">play_circle</span>
                                      </div>
                                    </div>
                                  );
                                })}

                                {/* Day Task Card */}
                                {day.task && (
                                  <div 
                                    onClick={() => onSelectDay(day.day, 'code')}
                                    className={`p-lg rounded-xl flex flex-col gap-sm transition-all duration-200 cursor-pointer glass-card hover:bg-surface-container-low hover:-translate-y-0.5 ${
                                      !user.tasksProgress?.[day.task.taskId]?.completed ? 'bg-primary-fixed/5' : ''
                                    }`}
                                  >
                                    <div className="flex justify-between items-start min-w-0">
                                      <h4 className="text-body-md font-bold text-on-surface truncate pr-2" title={day.task.title}>
                                        {day.task.title}
                                      </h4>
                                      <span className="px-sm py-xs bg-primary-fixed text-on-primary-fixed-variant text-[10px] rounded-lg font-bold shrink-0">
                                        Task
                                      </span>
                                    </div>

                                    <div className="mt-auto flex items-center justify-between pt-2 border-t border-outline-variant/30">
                                      {user.tasksProgress?.[day.task.taskId]?.completed ? (
                                        <div className="flex items-center gap-1 text-tertiary font-bold text-caption">
                                          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                          <span>Task Solved</span>
                                        </div>
                                      ) : (
                                        <div className="flex items-center gap-1 text-on-surface-variant text-caption">
                                          <span className="material-symbols-outlined text-[18px]">radio_button_unchecked</span>
                                          <span>Task Pending</span>
                                        </div>
                                      )}

                                      <span className="material-symbols-outlined text-primary text-[20px]">arrow_forward</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>




      </div>
    </div>
  );
}
