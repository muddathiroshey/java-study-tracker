'use client';

import { useState, useEffect } from 'react';
import { 
  Trophy, 
  Flame, 
  Sparkles, 
  Play, 
  Beaker, 
  BookOpen, 
  Activity, 
  Info,
  Award,
  Crown
} from 'lucide-react';
import { getDB, calculateUserPoints } from '../lib/storage';

const formatRelativeTime = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  
  const dDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const dNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const diffTime = dNow - dDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  return `${diffDays} days ago`;
};

export default function Leaderboard({ 
  user, 
  schedule, 
  currentDate, 
  onSelectDay 
}) {
  const [tickerActivities, setTickerActivities] = useState([]);

  // Calculate day index from dates
  const start = new Date("2026-06-15");
  const current = new Date(currentDate);
  const diffTime = current - start;
  const currentDayNum = Math.max(1, Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1);

  // Define total items for progress denominators
  const totalVideosInCourse = schedule.reduce((acc, curr) => acc + (curr.videos?.length || 0), 0);
  const totalTasksInCourse = schedule.filter(d => d.task).length;
  const totalReviewsInCourse = schedule.filter(d => d.type === 'review').length;
  const totalCourseItems = totalVideosInCourse + totalTasksInCourse + totalReviewsInCourse;

  // Retrieve actual users from LocalStorage DB
  const db = getDB();
  const usersList = db.users || [];

  // Generate Leaderboard Roster from actual database users
  const rankedRoster = usersList.map((u) => {
    const points = calculateUserPoints(u);
    const completedVideos = Object.keys(u.lessonsProgress || {}).filter(
      id => !id.startsWith('review_') && u.lessonsProgress[id]?.completed
    ).length;
    const completedTasks = Object.keys(u.tasksProgress || {}).filter(
      id => u.tasksProgress[id]?.completed
    ).length;
    const completedReviews = Object.keys(u.lessonsProgress || {}).filter(
      id => id.startsWith('review_') && u.lessonsProgress[id]?.completed
    ).length;

    const progressPercent = totalCourseItems > 0 
      ? Math.min(100, Math.round(((completedVideos + completedTasks + completedReviews) / totalCourseItems) * 100))
      : 0;

    // Stable avatar gradients based on username characters
    const colors = [
      "from-purple-500 to-indigo-500",
      "from-pink-500 to-rose-500",
      "from-emerald-500 to-teal-500",
      "from-blue-500 to-indigo-500",
      "from-cyan-500 to-blue-500",
      "from-amber-500 to-orange-500"
    ];
    const hash = u.username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const avatarColor = colors[hash % colors.length];

    return {
      id: u.id || u.username,
      username: u.username,
      avatarColor,
      streak: u.streak || 0,
      points,
      progressPercent,
      isCurrentUser: u.username.toLowerCase() === user.username.toLowerCase(),
      completedCount: {
        videos: completedVideos,
        tasks: completedTasks,
        reviews: completedReviews
      }
    };
  });

  // Sort descending by points
  rankedRoster.sort((a, b) => b.points - a.points);

  // Assign ranks
  const finalRoster = rankedRoster.map((entry, idx) => ({
    ...entry,
    rank: idx + 1
  }));

  const currentUserRank = finalRoster.find(entry => entry.isCurrentUser)?.rank || 1;
  const userXP = calculateUserPoints(user);

  // Process live database activities
  useEffect(() => {
    const db = getDB();
    const currentUsers = db.users || [];
    const activitiesList = [];

    currentUsers.forEach(u => {
      // 1. Video completions
      Object.keys(u.lessonsProgress || {}).forEach(vidId => {
        const info = u.lessonsProgress[vidId];
        if (info.completed) {
          if (vidId.startsWith('review_')) {
            const dayNum = parseInt(vidId.replace('review_', ''), 10);
            const day = schedule.find(d => d.day === dayNum);
            const title = day ? day.title : `Day ${dayNum} Review`;
            activitiesList.push({
              id: `${u.username}_rev_${dayNum}`,
              name: u.username,
              text: `checked off review: "${title}" (Day ${dayNum})`,
              points: "+15 XP",
              timestamp: new Date(info.dateCompleted).getTime(),
              time: formatRelativeTime(info.dateCompleted),
              type: 'review'
            });
          } else {
            let title = "Watch Video";
            let dayNum = 1;
            schedule.forEach(d => {
              const found = d.videos?.find(v => v.videoId === vidId);
              if (found) {
                title = found.title;
                dayNum = d.day;
              }
            });
            activitiesList.push({
              id: `${u.username}_vid_${vidId}`,
              name: u.username,
              text: `finished video: "${title.substring(0, 45)}..." (Day ${dayNum})`,
              points: "+10 XP",
              timestamp: new Date(info.dateCompleted).getTime(),
              time: formatRelativeTime(info.dateCompleted),
              type: 'video'
            });
          }
        }
      });

      // 2. Task completions
      Object.keys(u.tasksProgress || {}).forEach(taskId => {
        const info = u.tasksProgress[taskId];
        if (info.completed) {
          let title = "Practice Task";
          let dayNum = 1;
          schedule.forEach(d => {
            if (d.task?.taskId === taskId) {
              title = d.task.title;
              dayNum = d.day;
            }
          });
          activitiesList.push({
            id: `${u.username}_task_${taskId}`,
            name: u.username,
            text: `submitted task: "${title}" (Day ${dayNum})`,
            points: "+25 XP",
            timestamp: new Date(info.submittedAt).getTime(),
            time: formatRelativeTime(info.submittedAt),
            type: 'task'
          });
        }
      });
    });

    // Sort by timestamp descending (newest first)
    activitiesList.sort((a, b) => b.timestamp - a.timestamp);
    setTickerActivities(activitiesList.slice(0, 10));
  }, [schedule, currentDate, user]);

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="border-b border-custom-border pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Trophy className="h-6 w-6 text-amber-color" />
            Classroom Leaderboard
          </h1>
          <p className="text-sm text-muted-text mt-1">
            Real-time standings of all students registered on the platform.
          </p>
        </div>

        {/* Current user mini status panel */}
        <div className="flex items-center gap-3 bg-white/3 border border-custom-border rounded-xl px-4 py-2 shrink-0 select-none">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-text">
            <span>Your Rank:</span>
            <span className="text-sm font-black text-primary-color">#{currentUserRank}</span>
          </div>
          <div className="h-4 w-px bg-custom-border"></div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-text">
            <span>Score:</span>
            <span className="text-sm font-black text-amber-color">{userXP} XP</span>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Roster column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-panel rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-custom-border bg-black/10 flex justify-between items-center text-xs font-bold text-muted-text uppercase tracking-wider">
              <span>Rank & Student</span>
              <div className="flex gap-12 mr-4">
                <span className="w-16 text-center">Streak</span>
                <span className="w-20 text-right">Progress</span>
                <span className="w-16 text-right">Score</span>
              </div>
            </div>

            <div className="divide-y divide-custom-border/50">
              {finalRoster.map((entry) => {
                return (
                  <div 
                    key={entry.id}
                    className={`flex items-center justify-between p-4 transition-colors duration-150 ${
                      entry.isCurrentUser 
                        ? 'bg-primary-color/5 border-y border-primary-color/20 glow-active' 
                        : 'hover:bg-white/[0.01]'
                    }`}
                  >
                    {/* Rank & Identity */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-6 flex justify-center items-center shrink-0">
                        {entry.rank === 1 && <Crown className="h-5 w-5 text-amber-color fill-amber-500/20" />}
                        {entry.rank === 2 && <Award className="h-5 w-5 text-slate-300" />}
                        {entry.rank === 3 && <Award className="h-5 w-5 text-amber-700" />}
                        {entry.rank > 3 && <span className="text-xs font-bold text-muted-text">{entry.rank}</span>}
                      </div>

                      <div className={`h-8 w-8 rounded-full bg-gradient-to-br ${entry.avatarColor} shrink-0 flex items-center justify-center text-white text-xs font-extrabold`}>
                        {entry.username.charAt(0).toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <span className={`text-xs font-bold block truncate ${
                          entry.isCurrentUser ? 'text-primary-color font-extrabold' : 'text-foreground'
                        }`}>
                          {entry.username}
                        </span>
                        <span className="text-[10px] text-muted-text/70 block mt-0.5">
                          {entry.completedCount.videos} videos • {entry.completedCount.tasks} tasks
                        </span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-12 items-center mr-4 shrink-0 font-sans">
                      {/* Streak */}
                      <div className="w-16 flex items-center justify-center gap-1 text-xs font-bold text-orange-color">
                        <Flame className="h-3.5 w-3.5 fill-current" />
                        <span>{entry.streak}</span>
                      </div>

                      {/* Progress bar */}
                      <div className="w-20 flex flex-col items-end gap-1.5">
                        <span className="text-[10px] font-bold text-foreground">{entry.progressPercent}%</span>
                        <div className="w-16 bg-white/5 h-1 rounded-full overflow-hidden">
                          <div 
                            className="bg-primary-color h-full rounded-full"
                            style={{ width: `${entry.progressPercent}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Points score */}
                      <span className="w-16 text-right text-xs font-black text-amber-color">
                        {entry.points} XP
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Point System & Activities */}
        <div className="space-y-6">
          {/* Points rules card */}
          <div className="glass-panel rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2 pb-3 border-b border-custom-border">
              <Info className="h-4.5 w-4.5 text-primary-color" />
              Gamification Point Rules
            </h3>
            
            <div className="space-y-3">
              {[
                { label: "🎥 Video Lesson Completed", xp: "+10 XP", desc: "Watch assigned video timeline boundary", color: "text-primary-color" },
                { label: "📝 Practice Task Submitted", xp: "+25 XP", desc: "Solve compiler challenges & quizzes", color: "text-emerald-color" },
                { label: "🏖️ Review Checkpoint Checked", xp: "+15 XP", desc: "Complete rest days and OOP reviews", color: "text-amber-color" },
                { label: "🔥 Active Streak Multiplier", xp: "+5 XP / day", desc: "Maintain streak by studying daily", color: "text-orange-color" }
              ].map((rule, idx) => (
                <div key={idx} className="flex justify-between items-start gap-4 text-xs font-sans">
                  <div>
                    <span className="font-bold text-foreground block">{rule.label}</span>
                    <span className="text-[10px] text-muted-text mt-0.5 block">{rule.desc}</span>
                  </div>
                  <span className={`font-black shrink-0 ${rule.color}`}>{rule.xp}</span>
                </div>
              ))}
            </div>

            <div className="bg-primary-color/5 border border-primary-color/15 rounded-xl p-3.5 text-[11px] text-muted-text leading-relaxed font-sans">
              <Sparkles className="h-4 w-4 text-primary-color mb-1.5 inline mr-1" />
              Keep your streak active and complete tasks daily to climb rankings. Register multiple users to test classroom competition!
            </div>
          </div>

          {/* Classroom Live Activity Ticker */}
          <div className="glass-panel rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2 pb-3 border-b border-custom-border">
              <Activity className="h-4.5 w-4.5 text-secondary-color" />
              Class Active Feed
            </h3>

            <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
              {tickerActivities.map((act) => (
                <div key={act.id} className="flex gap-2.5 items-start text-xs font-sans">
                  <div className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                    act.type === 'video' ? 'bg-primary-color' :
                    act.type === 'task' ? 'bg-emerald-color' : 'bg-amber-color'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground leading-normal font-medium">
                      <span className="font-bold text-foreground mr-1">{act.name}</span>
                      {act.text}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-text">
                      <span>{act.time}</span>
                      <span>•</span>
                      <span className="font-extrabold text-amber-color">{act.points}</span>
                    </div>
                  </div>
                </div>
              ))}

              {tickerActivities.length === 0 && (
                <p className="text-xs text-muted-text italic py-4 text-center">No recent cohort activity logged yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
