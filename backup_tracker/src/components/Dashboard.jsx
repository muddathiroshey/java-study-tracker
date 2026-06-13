'use client';

import { 
  BookOpen, 
  Beaker, 
  Flame,
  Play, 
  ArrowRight, 
  Award, 
  Coffee, 
  CalendarClock
} from 'lucide-react';
import { TOPIC_DOMAINS } from '../lib/courseData';

export default function Dashboard({ 
  user, 
  currentDate, 
  schedule,
  onNavigateTab, 
  onSelectDay
}) {
  // 1. Calculate the active day based on startDate
  const start = new Date("2026-06-15");
  const current = new Date(currentDate);
  const diffTime = current - start;
  const currentDayNum = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

  // Find today's lesson object
  const todayLesson = schedule.find(d => d.day === currentDayNum);

  // 2. Count completion stats
  const totalVideosCount = schedule.reduce((acc, curr) => acc + (curr.videos?.length || 0), 0);
  const completedVideosCount = Object.keys(user.lessonsProgress || {}).filter(
    id => !id.startsWith('review_') && user.lessonsProgress[id]?.completed
  ).length;

  const totalTasksCount = schedule.filter(d => d.task).length;
  const completedTasksCount = Object.keys(user.tasksProgress || {}).filter(
    id => user.tasksProgress[id]?.completed
  ).length;

  // 3. Domain progress calculation
  const getDomainProgress = (domain) => {
    let totalItems = 0;
    let completedItems = 0;

    domain.chapters.forEach(chNum => {
      // Find days matching this chapter
      const days = schedule.filter(d => d.chapterNum === chNum);
      days.forEach(day => {
        if (day.type === 'video' && day.videos) {
          day.videos.forEach(v => {
            totalItems++;
            if (user.lessonsProgress?.[v.videoId]?.completed) {
              completedItems++;
            }
          });
        }
        if (day.task) {
          totalItems++;
          if (user.tasksProgress?.[day.task.taskId]?.completed) {
            completedItems++;
          }
        }
      });
    });

    const percent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    return { totalItems, completedItems, percent };
  };

  // Welcome Message based on context
  let welcomeTitle = `Welcome, ${user.username}!`;
  let welcomeSubtitle = "Ready to start your Java OOP mastery journey today?";
  if (currentDayNum < 1) {
    welcomeTitle = `Get Ready, ${user.username}!`;
    const daysToStart = Math.ceil((start - current) / (1000 * 60 * 60 * 24));
    welcomeSubtitle = `The course officially starts in ${daysToStart} day${daysToStart > 1 ? 's' : ''} on June 15, 2026. Use Settings to warp time!`;
  } else if (currentDayNum > 47) {
    welcomeTitle = `Congratulations, ${user.username}!`;
    welcomeSubtitle = "You have completed the entire 47-day Java course schedule!";
  } else if (todayLesson?.type === 'off') {
    welcomeTitle = `Happy Rest Day, ${user.username}!`;
    welcomeSubtitle = "Fridays are off! Take a break, recharge, or review past chapters.";
  } else if (todayLesson?.type === 'review') {
    welcomeTitle = `Review Checkpoint, ${user.username}!`;
    welcomeSubtitle = "Today is a review day. Read your notes, revise completed exercises, and check off the day once done.";
  }

  // Logged activities logic (no study sessions, only completions)
  const recentActivity = [];
  // Merge video and review completions
  Object.keys(user.lessonsProgress || {}).forEach(vidId => {
    const info = user.lessonsProgress[vidId];
    if (info.completed) {
      if (vidId.startsWith('review_')) {
        const dayNum = parseInt(vidId.replace('review_', ''), 10);
        const day = schedule.find(d => d.day === dayNum);
        const title = day ? day.title : `Day ${dayNum} Review`;
        recentActivity.push({
          type: 'task',
          title: `Completed review: ${title}`,
          time: info.dateCompleted,
          timestamp: new Date(info.dateCompleted).getTime()
        });
      } else {
        let title = "Watch Video";
        schedule.forEach(d => {
          const found = d.videos?.find(v => v.videoId === vidId);
          if (found) title = found.title;
        });
        recentActivity.push({
          type: 'video',
          title: `Completed video: ${title}`,
          time: info.dateCompleted,
          timestamp: new Date(info.dateCompleted).getTime()
        });
      }
    }
  });

  // Merge task completions
  Object.keys(user.tasksProgress || {}).forEach(taskId => {
    const info = user.tasksProgress[taskId];
    if (info.completed) {
      let title = "Practice Task";
      schedule.forEach(d => {
        if (d.task?.taskId === taskId) title = d.task.title;
      });
      recentActivity.push({
        type: 'task',
        title: `Completed task: ${title}`,
        time: info.submittedAt,
        timestamp: new Date(info.submittedAt).getTime()
      });
    }
  });

  // Sort by date
  recentActivity.sort((a, b) => b.timestamp - a.timestamp);
  const displaysActivity = recentActivity.slice(0, 4);

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-custom-border bg-gradient-to-br from-primary-color/10 via-primary-color/5 to-transparent p-6 md:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{welcomeTitle}</h1>
            <p className="text-muted-text max-w-xl text-sm leading-relaxed">{welcomeSubtitle}</p>
          </div>
          {currentDayNum >= 1 && currentDayNum <= 47 && (
            <button 
              onClick={() => onSelectDay(currentDayNum)}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary-color hover:bg-primary-hover text-white text-sm font-semibold transition-all shadow-lg shadow-primary-glow cursor-pointer"
            >
              <Play className="h-4 w-4 fill-current" />
              Go to Today's Day {currentDayNum}
            </button>
          )}
        </div>
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary-color/5 blur-3xl"></div>
        <div className="absolute -bottom-8 -left-8 h-48 w-48 rounded-full bg-secondary-color/5 blur-3xl"></div>
      </div>

      {/* Metrics Cards Grid (3 Columns) */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        {/* Videos Completed */}
        <div className="glass-panel rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start pb-2">
            <span className="text-xs font-semibold text-muted-text uppercase tracking-wider">Lessons Completed</span>
            <div className="p-2 rounded-lg bg-primary-color/10 text-primary-color">
              <BookOpen className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-foreground">
              {completedVideosCount} <span className="text-sm font-medium text-muted-text">/ {totalVideosCount}</span>
            </div>
            <div className="w-full bg-white/5 h-1.5 rounded-full mt-3 overflow-hidden">
              <div 
                className="bg-primary-color h-full rounded-full transition-all duration-300"
                style={{ width: `${totalVideosCount > 0 ? (completedVideosCount / totalVideosCount) * 100 : 0}%` }}
              ></div>
            </div>
            <p className="mt-2 text-xxs text-muted-text">
              {totalVideosCount > 0 ? Math.round((completedVideosCount / totalVideosCount) * 100) : 0}% complete
            </p>
          </div>
        </div>

        {/* Tasks Completed */}
        <div className="glass-panel rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start pb-2">
            <span className="text-xs font-semibold text-muted-text uppercase tracking-wider">Practice Tasks</span>
            <div className="p-2 rounded-lg bg-emerald-color/10 text-emerald-color">
              <Beaker className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-foreground">
              {completedTasksCount} <span className="text-sm font-medium text-muted-text">/ {totalTasksCount}</span>
            </div>
            <div className="w-full bg-white/5 h-1.5 rounded-full mt-3 overflow-hidden">
              <div 
                className="bg-emerald-color h-full rounded-full transition-all duration-300"
                style={{ width: `${totalTasksCount > 0 ? (completedTasksCount / totalTasksCount) * 100 : 0}%` }}
              ></div>
            </div>
            <p className="mt-2 text-xxs text-muted-text">
              {totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0}% tasks complete
            </p>
          </div>
        </div>

        {/* Current Streak */}
        <div className="glass-panel rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start pb-2">
            <span className="text-xs font-semibold text-muted-text uppercase tracking-wider">Learning Streak</span>
            <div className="p-2 rounded-lg bg-orange-color/10 text-orange-color">
              <Flame className="h-4.5 w-4.5 fill-current" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-foreground">
              {user.streak || 0} <span className="text-sm font-medium text-muted-text">days</span>
            </div>
            <div className="w-full bg-white/5 h-1.5 rounded-full mt-3 overflow-hidden">
              <div 
                className="bg-orange-color h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min((user.streak / 7) * 100, 100)}%` }}
              ></div>
            </div>
            <p className="mt-2 text-xxs text-muted-text">
              Keep checking off lessons to build your streak!
            </p>
          </div>
        </div>
      </div>

      {/* Main Layout Content Area */}
      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Today's active study task card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-2xl p-6 flex flex-col space-y-4">
            <div className="flex items-center justify-between border-b border-custom-border pb-3">
              <h2 className="font-bold text-lg text-foreground flex items-center gap-2">
                <CalendarClock className="h-5 w-5 text-primary-color" />
                Active Plan — Day {currentDayNum >= 1 && currentDayNum <= 47 ? currentDayNum : 1}
              </h2>
              <span className="text-xs text-muted-text font-medium">{currentDate}</span>
            </div>
            
            {currentDayNum < 1 ? (
              <div className="py-8 text-center flex flex-col items-center justify-center">
                <Award className="h-12 w-12 text-primary-color/50 mb-3" />
                <p className="font-semibold text-foreground">Course hasn't started yet!</p>
                <p className="text-xs text-muted-text max-w-sm mt-1">
                  The course is set to start on June 15, 2026. You can use Settings page to warp time or toggle developer mode to unlock all days!
                </p>
                <button
                  onClick={() => onNavigateTab('settings')}
                  className="mt-4 text-xs font-semibold text-primary-color hover:underline cursor-pointer"
                >
                  Go to Settings
                </button>
              </div>
            ) : currentDayNum > 47 ? (
              <div className="py-8 text-center flex flex-col items-center justify-center">
                <Award className="h-12 w-12 text-emerald-color/50 mb-3" />
                <p className="font-semibold text-foreground">Congratulations!</p>
                <p className="text-xs text-muted-text max-w-sm mt-1">
                  You completed the entire course curriculum. Great job mastering Java Fundamentals & OOP!
                </p>
              </div>
            ) : todayLesson?.type === 'off' ? (
              <div className="py-8 text-center flex flex-col items-center justify-center space-y-2">
                <Coffee className="h-12 w-12 text-amber-color/50" />
                <p className="font-semibold text-foreground">Rest Day (Friday off)</p>
                <p className="text-xs text-muted-text max-w-sm">
                  Take today to relax and review your concepts. Spend some time programming a fun side project!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-foreground text-base">{todayLesson?.title}</h3>
                    <p className="text-xs text-muted-text mt-1">{todayLesson?.chapterTitle}</p>
                  </div>
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold border bg-primary-color/5 border-primary-color/20 text-primary-color`}>
                    ACTIVE LESSON
                  </span>
                </div>

                {/* Video lists or tasks inside the day */}
                <div className="space-y-3">
                  {todayLesson?.videos && todayLesson.videos.length > 0 && (
                    <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
                      {todayLesson.videos.map((vid) => {
                        const isDone = user.lessonsProgress?.[vid.videoId]?.completed;
                        return (
                          <div 
                            key={vid.videoId} 
                            onClick={() => onSelectDay(todayLesson.day)}
                            className="bg-black/20 border border-custom-border rounded-xl p-3 flex gap-3 hover:border-primary-color/40 transition-colors cursor-pointer group"
                          >
                            <div className="relative w-16 h-12 bg-slate-900 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                              <img src={vid.thumbnail} alt={vid.title} className="object-cover w-full h-full opacity-60" />
                              <div className="absolute inset-0 flex items-center justify-center text-foreground bg-black/30 group-hover:bg-black/10 transition-colors">
                                <Play className="h-4.5 w-4.5 fill-current" />
                              </div>
                            </div>
                            <div className="flex flex-col min-w-0 flex-1 justify-center font-sans">
                              <span className="text-xs font-bold text-foreground truncate group-hover:text-primary-color transition-colors">{vid.title}</span>
                              <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-text">
                                <span>{vid.duration} mins</span>
                                {isDone && (
                                  <span className="text-[9px] font-bold text-emerald-color bg-emerald-color/10 px-1.5 py-0.2 rounded border border-emerald-color/10">COMPLETED</span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {todayLesson?.task && (
                    <div className="bg-black/20 border border-custom-border rounded-xl p-4 flex justify-between items-center mt-3">
                      <div>
                        <h4 className="text-xs font-bold text-foreground">{todayLesson.task.title}</h4>
                        <p className="text-xxs text-muted-text mt-1 max-w-md line-clamp-1">{todayLesson.task.description}</p>
                      </div>
                      <button 
                        onClick={() => onSelectDay(todayLesson.day)}
                        className="flex items-center gap-1.5 text-xs font-bold text-emerald-color hover:underline cursor-pointer"
                      >
                        Solve Task
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Domain progress */}
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-lg text-foreground">Domain Progress</h3>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              {TOPIC_DOMAINS.map(domain => {
                const stats = getDomainProgress(domain);
                return (
                  <div key={domain.id} className="bg-black/10 border border-custom-border rounded-xl p-4 space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start text-xs font-bold text-foreground">
                        <span className="truncate max-w-[170px]">{domain.name}</span>
                        <span className="text-muted-text">{stats.completedItems} / {stats.totalItems}</span>
                      </div>
                      <p className="text-xxs text-muted-text mt-0.5">Chapters: {domain.chapters.join(', ')}</p>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-white/5 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-primary-color h-full rounded-full transition-all duration-300"
                            style={{ width: `${stats.percent}%` }}
                          ></div>
                        </div>
                        <span className="text-xxs font-bold text-foreground w-6 text-right">{stats.percent}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar activity card */}
        <div className="space-y-6">
          <div className="glass-panel rounded-2xl p-6 space-y-4 flex flex-col h-full justify-between">
            <div>
              <h3 className="font-bold text-lg text-foreground pb-3 border-b border-custom-border">Recent Activity</h3>
              {displaysActivity.length === 0 ? (
                <div className="py-12 text-center flex flex-col items-center justify-center text-muted-text">
                  <BookOpen className="h-8 w-8 text-muted-text/30 mb-2" />
                  <p className="text-sm font-semibold">No activity logged yet</p>
                  <p className="text-xxs mt-0.5">Start watching videos and solving tasks!</p>
                </div>
              ) : (
                <div className="mt-4 space-y-4">
                  {displaysActivity.map((act, index) => (
                    <div key={index} className="flex gap-3 items-start text-xs">
                      <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                        act.type === 'video' ? 'bg-primary-color shadow-primary-glow shadow-md' : 'bg-emerald-color shadow-emerald-glow shadow-md'
                      }`}></div>
                      <div className="flex-1 min-w-0 font-sans">
                        <p className="font-medium text-foreground leading-normal">{act.title}</p>
                        <p className="text-[10px] text-muted-text mt-0.5">{act.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white/3 border border-custom-border rounded-xl p-4 text-center mt-4">
              <span className="text-xxs text-muted-text uppercase tracking-wider block font-bold">Study Tips</span>
              <p className="text-xs font-medium text-foreground leading-relaxed mt-2 italic font-sans">
                "Break down complex OOP hierarchies. Always write code while watching concepts in action!"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
