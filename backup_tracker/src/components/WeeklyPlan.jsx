'use client';

import { useState } from 'react';
import { 
  Calendar, 
  ChevronRight, 
  ChevronDown, 
  Play, 
  Coffee, 
  Lock, 
  CheckCircle2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function WeeklyPlan({ 
  user, 
  currentDate, 
  schedule,
  onSelectDay 
}) {
  const current = new Date(currentDate);

  const getDayState = (day) => {
    const isWarped = user.settings?.devWarpTime;
    const isOpen = user.settings?.openAvailability;
    
    if (isWarped || isOpen) {
      return { locked: false, completed: isDayCompleted(day) };
    }

    const dayDate = new Date(day.date);
    const locked = dayDate > current;
    const completed = isDayCompleted(day);
    return { locked, completed };
  };

  const isDayCompleted = (day) => {
    if (day.type === 'off') return true;
    if (day.type === 'review') {
      return !!user.lessonsProgress?.[`review_${day.day}`]?.completed;
    }
    if (day.type === 'video') {
      const allVids = day.videos || [];
      const hasTask = !!day.task;
      
      const vidsCompleted = allVids.every(v => user.lessonsProgress?.[v.videoId]?.completed);
      const taskCompleted = hasTask ? user.tasksProgress?.[day.task.taskId]?.completed : true;
      
      return vidsCompleted && taskCompleted;
    }
    return false;
  };

  const getDayProgressDetails = (day) => {
    if (day.type !== 'video') return null;
    const allVids = day.videos || [];
    const hasTask = !!day.task;
    
    const totalVideos = allVids.length;
    const completedVideos = allVids.filter(v => user.lessonsProgress?.[v.videoId]?.completed).length;
    const taskCompleted = hasTask ? !!user.tasksProgress?.[day.task.taskId]?.completed : null;
    
    return {
      totalVideos,
      completedVideos,
      hasTask,
      taskCompleted
    };
  };

  // Group the schedule by Week index (7 days per week)
  const weeks = [];
  const start = new Date("2026-06-15");

  for (let i = 0; i < 7; i++) {
    const startIdx = i * 7;
    const endIdx = startIdx + 7;
    const weekDays = schedule.slice(startIdx, endIdx);
    
    if (weekDays.length === 0) break;
    
    // Compute week stats (exclude rest days from completion scores)
    let completedCount = 0;
    let totalActiveCount = 0;
    weekDays.forEach(d => {
      const state = getDayState(d);
      if (d.type !== 'off') {
        totalActiveCount++;
        if (state.completed) completedCount++;
      }
    });

    const percent = totalActiveCount > 0 ? Math.round((completedCount / totalActiveCount) * 100) : 100;
    
    weeks.push({
      weekNum: i + 1,
      dateRange: `${weekDays[0].date} ~ ${weekDays[weekDays.length - 1].date}`,
      days: weekDays,
      percent,
      completedCount,
      totalActiveCount
    });
  }

  // Expanded weeks state based on date warp
  const diffTime = current - start;
  const currentDayNum = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  const currentWeekNum = Math.max(1, Math.min(Math.ceil(currentDayNum / 7), 7));

  const [expandedWeeks, setExpandedWeeks] = useState({
    [currentWeekNum]: true
  });

  const toggleWeek = (num) => {
    setExpandedWeeks(prev => ({
      ...prev,
      [num]: !prev[num]
    }));
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="border-b border-custom-border pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Calendar className="h-6 w-6 text-primary-color" />
          Weekly Plan
        </h1>
        <p className="text-sm text-muted-text mt-1">
          Review your weekly checkpoints, schedule logs, and complete active items.
        </p>
      </div>

      {/* Week Accordions */}
      <div className="space-y-4">
        {weeks.map(week => {
          const isExpanded = expandedWeeks[week.weekNum];
          
          return (
            <div key={week.weekNum} className="glass-panel rounded-2xl overflow-hidden transition-all duration-200">
              {/* Accordion Trigger Header */}
              <div 
                onClick={() => toggleWeek(week.weekNum)}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-white/2 select-none"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-color/10 text-primary-color border border-primary-color/20 shrink-0">
                    <span className="text-sm font-bold">W{week.weekNum}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-base">Week {week.weekNum} Study Plan</h3>
                    <p className="text-xxs text-muted-text mt-0.5">{week.dateRange}</p>
                  </div>
                </div>

                {/* Progress bar and details */}
                <div className="flex items-center gap-4 shrink-0 justify-between md:justify-end">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col text-right hidden sm:block">
                      <span className="text-xxs text-muted-text">Week Progress</span>
                      <span className="text-xs font-bold text-foreground">{week.completedCount} / {week.totalActiveCount} Tasks</span>
                    </div>
                    <div className="w-24 bg-white/5 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-primary-color h-full rounded-full transition-all duration-300"
                        style={{ width: `${week.percent}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-bold text-foreground w-8 text-right">{week.percent}%</span>
                  </div>

                  <div className="text-muted-text p-1">
                    {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                  </div>
                </div>
              </div>

              {/* Accordion Expand Content */}
              {isExpanded && (
                <div className="border-t border-custom-border bg-black/10 p-5 divide-y divide-custom-border/50 space-y-4">
                  {week.days.map(day => {
                    const { locked, completed } = getDayState(day);
                    const isOff = day.type === 'off';
                    const progressDetails = getDayProgressDetails(day);
                    
                    return (
                      <div 
                        key={day.day} 
                        onClick={() => {
                          if (!locked && !isOff) {
                            onSelectDay(day.day);
                          }
                        }}
                        className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-3 rounded-xl border transition-all duration-200 group ${
                          isOff
                            ? 'bg-white/[0.01] border-transparent opacity-60'
                            : locked
                              ? 'bg-transparent border-transparent opacity-40'
                              : completed
                                ? 'bg-white/[0.02] border-custom-border/30 hover:bg-white/[0.04] hover:border-custom-border/60 cursor-pointer'
                                : 'bg-primary-color/[0.02] border-primary-color/10 hover:bg-primary-color/[0.05] hover:border-primary-color/20 cursor-pointer shadow-sm'
                        }`}
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <span className="text-xxs font-bold text-muted-text bg-white/5 px-2 py-0.5 rounded border border-custom-border shrink-0 mt-0.5 font-mono">
                            {day.dayOfWeek.slice(0, 3).toUpperCase()}
                          </span>
                          
                          <div className="min-w-0">
                            <h4 className={`text-sm font-bold truncate ${isOff ? 'text-muted-text/60 font-medium' : locked ? 'text-muted-text' : 'text-foreground'}`}>
                              Day {day.day}: {day.title}
                            </h4>
                            {day.chapterTitle && !isOff && (
                              <p className="text-xxs text-muted-text mt-0.5">{day.chapterTitle}</p>
                            )}
                          </div>
                        </div>

                        {/* Day control actions / badges */}
                        <div className="flex items-center justify-between md:justify-end gap-4">
                          <span className={`text-[10px] px-2 py-0.5 rounded border font-semibold ${
                            isOff ? 'bg-white/5 border-white/5 text-muted-text/60' :
                            day.type === 'video' ? 'bg-primary-color/5 border-primary-color/10 text-primary-color' :
                            'bg-amber-color/5 border-amber-color/10 text-amber-color'
                          }`}>
                            {isOff ? 'REST' : day.type.toUpperCase()}
                          </span>

                          <div className="flex items-center gap-2">
                            {!locked && !completed && progressDetails && (progressDetails.completedVideos > 0 || progressDetails.taskCompleted) && (
                              <div className="hidden sm:flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-muted-text font-medium mr-1">
                                {progressDetails.completedVideos === progressDetails.totalVideos && progressDetails.hasTask && !progressDetails.taskCompleted && (
                                  <span className="text-amber-color font-semibold">Video Completed, Task Pending</span>
                                )}
                                {progressDetails.completedVideos < progressDetails.totalVideos && progressDetails.taskCompleted && (
                                  <span className="text-amber-color font-semibold">Video Pending, Task Completed</span>
                                )}
                                {progressDetails.totalVideos > 1 && progressDetails.completedVideos > 0 && progressDetails.completedVideos < progressDetails.totalVideos && !progressDetails.taskCompleted && (
                                  <span className="text-amber-color font-semibold">Videos {progressDetails.completedVideos}/{progressDetails.totalVideos} Done</span>
                                )}
                              </div>
                            )}

                            {isOff ? (
                              <div className="flex items-center gap-1 text-xxs text-muted-text/60 font-semibold font-sans">
                                <Coffee className="h-3.5 w-3.5" />
                                Rest Day
                              </div>
                            ) : locked ? (
                              <div className="flex items-center gap-1 text-xxs text-muted-text font-sans">
                                <Lock className="h-3 w-3" />
                                Locked (Can't view)
                              </div>
                            ) : completed ? (
                              <div className="flex items-center gap-1 text-xxs text-emerald-color font-bold font-sans">
                                <CheckCircle2 className="h-3.5 w-3.5 fill-current" />
                                Done
                              </div>
                            ) : (
                              <span
                                className="inline-flex items-center gap-1 px-3 py-1 rounded bg-primary-color/10 group-hover:bg-primary-color group-hover:text-white border border-primary-color/20 text-primary-color text-xxs font-bold transition-all"
                              >
                                Study
                                <ArrowRight className="h-3 w-3" />
                              </span>
                            )}
                          </div>
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
  );
}
