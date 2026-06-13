'use client';

import { useState } from 'react';
import { 
  Play, 
  Lock, 
  CheckCircle2, 
  Beaker, 
  Coffee, 
  Search, 
  ArrowRight,
  Sparkles,
  BookOpen,
  CalendarCheck
} from 'lucide-react';

export default function Roadmap({ 
  user, 
  currentDate, 
  schedule,
  onSelectDay 
}) {
  const [filter, setFilter] = useState('all'); // all, videos, tasks, completed
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate day states (locked vs unlocked)
  const current = new Date(currentDate);

  const getDayState = (day) => {
    // If devWarpTime or openAvailability overrides are active, unlock everything!
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

  // Filter & Search Logic
  const filteredSchedule = schedule.filter(day => {
    const state = getDayState(day);
    
    // Filter matches
    if (filter === 'videos' && day.type !== 'video') return false;
    if (filter === 'tasks' && !day.task) return false;
    if (filter === 'completed' && !state.completed) return false;
    if (filter === 'unlocked' && state.locked) return false;

    // Search query matches
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const titleMatch = day.title.toLowerCase().includes(q);
      const chMatch = day.chapterTitle?.toLowerCase().includes(q) || false;
      return titleMatch || chMatch;
    }

    return true;
  });

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-custom-border pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary-color" />
            Learning Roadmap
          </h1>
          <p className="text-sm text-muted-text mt-1">
            Browse your 47-day roadmap, unlock lessons, and track your study milestones.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative max-w-xs w-full">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-text pointer-events-none">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search chapters or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-custom-border bg-black/20 text-white placeholder-muted-text focus:outline-none focus:border-primary-color/50 text-xs"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'all', label: 'All Days' },
          { id: 'videos', label: 'Video Lessons' },
          { id: 'tasks', label: 'Practice Tasks' },
          { id: 'completed', label: 'Completed' },
          { id: 'unlocked', label: 'Unlocked' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all border ${
              filter === tab.id 
                ? 'bg-primary-color border-primary-color text-white' 
                : 'bg-black/20 border-custom-border text-muted-text hover:text-white hover:border-white/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Timeline Grid layout */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {filteredSchedule.map(day => {
          const { locked, completed } = getDayState(day);
          const isOff = day.type === 'off';
          
          return (
            <div 
              key={day.day}
              onClick={() => {
                if (!locked && !isOff) {
                  onSelectDay(day.day);
                }
              }}
              className={`glass-panel rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden transition-all duration-200 ${
                isOff
                  ? 'bg-black/40 border-dashed border-custom-border/40 opacity-70 cursor-not-allowed select-none'
                  : locked 
                    ? 'opacity-40 cursor-not-allowed border-dashed' 
                    : 'cursor-pointer hover:-translate-y-1 hover:border-primary-color/30 hover:shadow-lg hover:shadow-primary-glow/5'
              }`}
            >
              {/* Day Header badge */}
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                  isOff ? 'bg-white/5 border-white/5 text-muted-text/60' :
                  locked ? 'bg-white/5 border-white/5 text-muted-text' :
                  completed ? 'bg-emerald-color/5 border-emerald-color/10 text-emerald-color' :
                  'bg-primary-color/5 border-primary-color/10 text-primary-color'
                }`}>
                  DAY {day.day}
                </span>
                <span className="text-[10px] text-muted-text font-medium">{day.date}</span>
              </div>

              {/* Day Main Info */}
              <div className="mt-4 space-y-1">
                <h3 className={`font-bold text-sm leading-snug truncate ${isOff ? 'text-muted-text/60 font-medium' : locked ? 'text-muted-text' : 'text-foreground'}`}>
                  {day.title}
                </h3>
                {day.chapterTitle && !isOff && (
                  <p className="text-xxs text-muted-text truncate">{day.chapterTitle}</p>
                )}
              </div>

              {/* Day details or Lock overlay */}
              <div className="mt-5 pt-3 border-t border-custom-border flex items-center justify-between">
                {isOff ? (
                  <div className="flex items-center gap-1.5 text-xxs text-muted-text/60 font-semibold font-sans">
                    <Coffee className="h-3.5 w-3.5" />
                    Friday Rest Day
                  </div>
                ) : locked ? (
                  <div className="flex items-center gap-1.5 text-xxs text-muted-text font-sans">
                    <Lock className="h-3 w-3" />
                    Locked (Unlocks {day.dayOfWeek})
                  </div>
                ) : completed ? (
                  <div className="flex items-center gap-1.5 text-xxs text-emerald-color font-bold font-sans">
                    <CheckCircle2 className="h-3.5 w-3.5 fill-current bg-black rounded-full" />
                    Completed
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-xxs text-primary-color font-bold font-sans">
                    <Sparkles className="h-3.5 w-3.5" />
                    {(() => {
                      const progressDetails = getDayProgressDetails(day);
                      if (progressDetails) {
                        if (progressDetails.completedVideos === progressDetails.totalVideos && progressDetails.hasTask && !progressDetails.taskCompleted) {
                          return <span className="text-amber-color font-semibold">Video Done, Task Pending</span>;
                        }
                        if (progressDetails.completedVideos < progressDetails.totalVideos && progressDetails.taskCompleted) {
                          return <span className="text-amber-color font-semibold">Video Pending, Task Done</span>;
                        }
                        if (progressDetails.totalVideos > 1 && progressDetails.completedVideos > 0 && progressDetails.completedVideos < progressDetails.totalVideos) {
                          return <span className="text-amber-color font-semibold">Videos {progressDetails.completedVideos}/{progressDetails.totalVideos} Done</span>;
                        }
                      }
                      return "Ready to study";
                    })()}
                  </div>
                )}

                {!locked && !isOff && (
                  <span className="text-muted-text hover:text-foreground flex items-center gap-1 text-xxs font-semibold">
                    Start
                    <ArrowRight className="h-3 w-3" />
                  </span>
                )}
              </div>

              {/* Small graphic marker */}
              <div className="absolute right-4 top-4 opacity-5 pointer-events-none">
                {isOff ? <Coffee className="h-10 w-10" /> :
                 day.type === 'video' ? <Play className="h-10 w-10 fill-current" /> :
                 <BookOpen className="h-10 w-10" />}
              </div>
            </div>
          );
        })}
      </div>
      
      {filteredSchedule.length === 0 && (
        <div className="py-20 text-center glass-panel rounded-2xl flex flex-col items-center justify-center">
          <CalendarCheck className="h-12 w-12 text-muted-text/30 mb-2" />
          <p className="font-semibold text-foreground">No items found matching filters</p>
          <p className="text-xs text-muted-text mt-1">Try resetting search or clicking on "All Days".</p>
        </div>
      )}
    </div>
  );
}
