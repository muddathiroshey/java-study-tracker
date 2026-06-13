'use client';

import { useState, useEffect } from 'react';
import { getDB, saveDB, saveStoredSchedule, getStoredSchedule, calculateUserPoints, createAdminAccount } from '../lib/storage';
import { courseSchedule } from '../lib/courseData';

export default function AdminPanel({ user, schedule, onScheduleUpdate }) {
  const [tab, setTab] = useState('overview'); // 'overview' | 'users' | 'schedule' | 'editor'
  const [users, setUsers] = useState([]);
  const [editingDay, setEditingDay] = useState(null);
  const [editorForm, setEditorForm] = useState(null);
  const [saved, setSaved] = useState(false);
  const [dbLoaded, setDbLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Create admin states
  const [createAdminOpen, setCreateAdminOpen] = useState(false);
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [createAdminError, setCreateAdminError] = useState('');
  const [createAdminSuccess, setCreateAdminSuccess] = useState('');

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setCreateAdminError('');
    setCreateAdminSuccess('');

    if (!adminName.trim() || !adminPassword.trim()) {
      setCreateAdminError('Please fill in Name and Password');
      return;
    }

    if (adminPassword.length < 6) {
      setCreateAdminError('Password must be at least 6 characters');
      return;
    }

    if (adminEmail.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(adminEmail.trim())) {
        setCreateAdminError('Please enter a valid email address');
        return;
      }
    }

    const res = await createAdminAccount(adminName.trim(), adminEmail.trim(), adminPassword);
    if (res.success) {
      setCreateAdminSuccess('Admin account created successfully!');
      setAdminName('');
      setAdminEmail('');
      setAdminPassword('');
      await loadUsers(); // Refresh registry list
      setTimeout(() => {
        setCreateAdminSuccess('');
        setCreateAdminOpen(false);
      }, 2000);
    } else {
      setCreateAdminError(res.error);
    }
  };

  const loadUsers = async () => {
    const db = await getDB();
    const scored = db.users.map(u => ({
      ...u,
      points: calculateUserPoints(u),
      videoCount: Object.keys(u.lessonsProgress || {}).filter(k => !k.startsWith('review_') && u.lessonsProgress[k]?.completed).length,
      taskCount: Object.keys(u.tasksProgress || {}).filter(k => u.tasksProgress[k]?.completed).length,
    })).sort((a, b) => b.points - a.points);
    setUsers(scored);
    setDbLoaded(true);
  };

  useEffect(() => { loadUsers(); }, [tab]);

  const openEditor = (day) => {
    setEditingDay(day.day);
    setEditorForm({
      title: day.title,
      type: day.type || 'video',
      chapterNum: day.chapterNum || '',
      chapterTitle: day.chapterTitle || '',
      videoId: day.videos?.[0]?.videoId || '',
      videoTitle: day.videos?.[0]?.title || '',
      videoDuration: day.videos?.[0]?.duration || '00:00:00',
      assignedStart: day.videos?.[0]?.assignedStart || '00:00:00',
      assignedEnd: day.videos?.[0]?.assignedEnd || '00:00:00',
      taskTitle: day.task?.title || '',
      taskDescription: day.task?.description || '',
    });
    setTab('editor');
  };

  const saveEditorDay = () => {
    const newSchedule = schedule.map(day => {
      if (day.day !== editingDay) return day;
      const updatedDay = {
        ...day,
        title: editorForm.title,
        type: editorForm.type,
        chapterNum: parseInt(editorForm.chapterNum) || null,
        chapterTitle: editorForm.chapterTitle,
      };
      if (editorForm.videoId) {
        updatedDay.videos = [{
          videoId: editorForm.videoId,
          title: editorForm.videoTitle,
          duration: editorForm.videoDuration,
          assignedStart: editorForm.assignedStart,
          assignedEnd: editorForm.assignedEnd,
          thumbnail: `https://i.ytimg.com/vi/${editorForm.videoId}/hqdefault.jpg`,
          url: `https://www.youtube.com/watch?v=${editorForm.videoId}`,
        }];
      }
      if (editorForm.taskTitle) {
        updatedDay.task = {
          taskId: day.task?.taskId || `task_day_${day.day}`,
          title: editorForm.taskTitle,
          description: editorForm.taskDescription,
          codeTemplate: day.task?.codeTemplate || '// Type your solution here\npublic class Solution {\n    //...\n}',
          testCases: day.task?.testCases || [{ description: 'Test 1', expected: 'Output' }],
        };
      }
      return updatedDay;
    });
    saveStoredSchedule(newSchedule);
    onScheduleUpdate(newSchedule);
    setSaved(true);
    setTimeout(() => { setSaved(false); setTab('schedule'); }, 1500);
  };

  const resetScheduleToDefault = () => {
    if (confirm("Are you sure you want to reset all curriculum schedule edits back to default?")) {
      saveStoredSchedule(courseSchedule);
      onScheduleUpdate(courseSchedule);
    }
  };

  // Stats calculators
  const totalVideos = schedule.filter(d => d.type === 'video').length;
  const totalTasks = schedule.filter(d => d.task).length;
  const totalRestDays = schedule.filter(d => d.type === 'off').length;

  const filteredSchedule = schedule.filter(day => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return day.title.toLowerCase().includes(q) || 
           day.chapterTitle?.toLowerCase().includes(q) ||
           day.day.toString() === q;
  });

  return (
    <div className="flex-grow overflow-y-auto pt-24 pb-12 px-4 md:px-8 select-none min-h-screen">
      <main className="max-w-6xl mx-auto w-full">
        
        {/* Shared Dashboard Header */}
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-on-primary text-2xl font-bold">admin_panel_settings</span>
            </div>
            <div>
              <h1 className="text-display-lg font-headline-lg font-black text-on-background">Admin Console</h1>
              <p className="text-body-sm text-on-surface-variant mt-0.5">Control curriculum day paths, monitor student streaks, and edit code templates</p>
            </div>
          </div>
          <div className="flex gap-2">
            {['overview', 'users', 'submissions', 'schedule'].map(key => (
              <button
                key={key}
                onClick={() => { setTab(key); setEditingDay(null); }}
                className={`px-4 py-2 rounded-xl text-label-md font-bold border transition-colors cursor-pointer capitalize ${
                  tab === key
                    ? 'bg-primary text-on-primary shadow-sm border-transparent'
                    : 'bg-surface-container-lowest text-on-surface border-outline-variant hover:bg-surface-container-low'
                }`}
              >
                {key === 'schedule' ? 'Curriculum' : key}
              </button>
            ))}
          </div>
        </header>

        {/* ====== OVERVIEW TAB ====== */}
        {tab === 'overview' && (
          <div className="space-y-8">
            {/* Bento Grid Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-lg">
              <div className="bg-primary text-on-primary rounded-xl p-lg flex flex-col justify-between shadow-md relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-caption font-bold opacity-75 uppercase tracking-wide">Total Lessons</p>
                    <h3 className="text-display-lg font-headline-lg font-black mt-1">{schedule.length} Days</h3>
                  </div>
                  <span className="material-symbols-outlined text-3xl opacity-40">calendar_today</span>
                </div>
                <p className="text-caption opacity-80 mt-6">{totalVideos} video segments · {totalRestDays} off days</p>
              </div>

              <div className="bg-surface-container-low border border-outline-variant rounded-xl p-lg flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-caption font-bold text-on-surface-variant uppercase tracking-wide">Total Students</p>
                    <h3 className="text-display-lg font-headline-lg font-black text-on-surface mt-1">{users.length} Enrolled</h3>
                  </div>
                  <span className="material-symbols-outlined text-3xl text-outline">groups</span>
                </div>
                <p className="text-caption text-on-surface-variant mt-6">Live cohort sync from localStorage database</p>
              </div>

              <div className="bg-surface-container-highest rounded-xl p-lg flex flex-col justify-between border border-outline-variant">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-caption font-bold text-on-surface-variant uppercase tracking-wide">Assignments Board</p>
                    <h3 className="text-display-lg font-headline-lg font-black text-on-surface mt-1">{totalTasks} Solvers</h3>
                  </div>
                  <span className="material-symbols-outlined text-3xl text-outline">terminal</span>
                </div>
                <p className="text-caption text-on-surface-variant mt-6">Coding tasks validated by Java test suites</p>
              </div>
            </div>

            {/* Engagement Details Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Asymmetric Activity Updates Feed */}
              <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-on-background text-label-md mb-4 flex items-center gap-2 border-b border-outline-variant/30 pb-3">
                  <span className="material-symbols-outlined text-primary">feed</span>
                  Recent Cohort Activity Log
                </h3>
                <div className="space-y-4">
                  {users.slice(0, 5).map((u, i) => {
                    const solved = u.taskCount;
                    const vids = u.videoCount;
                    return (
                      <div key={u.username} className="flex gap-4 items-start border-b border-outline-variant/30 last:border-0 pb-3 last:pb-0">
                        <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black shrink-0">
                          {u.username[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-body-sm text-on-surface">
                            Student <strong className="text-primary">{u.username}</strong> completed <strong>{vids}</strong> video lectures and solved <strong>{solved}</strong> coding labs.
                          </p>
                          <span className="text-[10px] text-outline font-bold mt-1 block">Joined: {u.enrolledDate || 'recently'}</span>
                        </div>
                        <span className="text-caption font-bold text-primary shrink-0">{u.points} XP</span>
                      </div>
                    );
                  })}
                  {users.length === 0 && (
                    <p className="text-on-surface-variant text-caption italic py-4 text-center">No enrolled students logged.</p>
                  )}
                </div>
              </div>

              {/* Quick Admin Actions */}
              <div className="space-y-6">
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
                  <h3 className="font-bold text-on-background text-label-md mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">construction</span>
                    Curriculum Tools
                  </h3>
                  <div className="space-y-3">
                    <button 
                      onClick={() => setTab('schedule')}
                      className="w-full text-left p-3 hover:bg-surface-container-low rounded-lg transition-colors border border-outline-variant/50 flex items-center gap-2 text-body-sm font-semibold text-on-surface cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-primary text-xl">edit_note</span>
                      Edit Scheduled Days
                    </button>
                    <button 
                      onClick={resetScheduleToDefault}
                      className="w-full text-left p-3 hover:bg-red-500/5 rounded-lg transition-colors border border-red-500/20 flex items-center gap-2 text-body-sm font-semibold text-error cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-error text-xl">restart_alt</span>
                      Revert Course Schedule
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ====== USERS TAB USERS LIST ====== */}
        {tab === 'users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-surface-bright p-4 rounded-xl border border-outline-variant/50">
              <h2 className="font-title-md text-on-surface font-bold">Classroom Registry ({users.length} Enrolled)</h2>
              <div className="flex gap-2">
                <button 
                  onClick={() => setCreateAdminOpen(!createAdminOpen)}
                  className="px-4 py-2 border border-primary/20 text-primary hover:bg-primary/5 font-bold text-caption rounded-lg bg-surface-container-lowest flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
                >
                  <span className="material-symbols-outlined text-xl">
                    {createAdminOpen ? 'close' : 'add'}
                  </span>
                  {createAdminOpen ? 'Cancel' : 'Create Admin'}
                </button>
                <button 
                  onClick={loadUsers} 
                  className="px-4 py-2 border border-outline-variant text-on-surface-variant hover:text-on-surface font-bold text-caption rounded-lg bg-surface-container-lowest flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
                >
                  <span className="material-symbols-outlined text-xl">refresh</span>
                  Sync database
                </button>
              </div>
            </div>

            {createAdminOpen && (
              <form onSubmit={handleCreateAdmin} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm space-y-4 max-w-xl">
                <h3 className="font-bold text-on-surface text-label-md flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">admin_panel_settings</span>
                  Create New Admin Account
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-caption font-bold text-on-surface-variant mb-1">Full Name / Username</label>
                    <input 
                      type="text"
                      placeholder="Jane Doe"
                      value={adminName}
                      onChange={e => setAdminName(e.target.value)}
                      className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded-xl text-on-surface text-body-sm focus:outline-none focus:border-primary transition-all font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-caption font-bold text-on-surface-variant mb-1">Email (Optional)</label>
                    <input 
                      type="email"
                      placeholder="jane@example.com"
                      value={adminEmail}
                      onChange={e => setAdminEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded-xl text-on-surface text-body-sm focus:outline-none focus:border-primary transition-all font-semibold"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-caption font-bold text-on-surface-variant mb-1">Password</label>
                  <input 
                    type="password"
                    placeholder="At least 6 characters"
                    value={adminPassword}
                    onChange={e => setAdminPassword(e.target.value)}
                    className="w-full max-w-xs px-3 py-2 bg-surface-container border border-outline-variant rounded-xl text-on-surface text-body-sm focus:outline-none focus:border-primary transition-all font-semibold"
                  />
                </div>

                {createAdminError && (
                  <div className="text-error font-bold text-caption flex items-center gap-1">
                    <span className="material-symbols-outlined text-lg">error</span>
                    {createAdminError}
                  </div>
                )}
                
                {createAdminSuccess && (
                  <div className="text-tertiary font-bold text-caption flex items-center gap-1">
                    <span className="material-symbols-outlined text-lg">check_circle</span>
                    {createAdminSuccess}
                  </div>
                )}

                <button 
                  type="submit"
                  className="px-5 py-2.5 bg-primary text-on-primary font-bold text-caption rounded-xl hover:bg-primary/90 transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-lg">save</span>
                  Save Admin Account
                </button>
              </form>
            )}
            
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-surface-container-low text-on-surface-variant border-b border-outline-variant text-caption font-bold uppercase">
                      <th className="py-3 px-6">Rank</th>
                      <th className="py-3 px-6">Student</th>
                      <th className="py-3 px-6">Enrolled Date</th>
                      <th className="py-3 px-6 text-center">Active Streak</th>
                      <th className="py-3 px-6 text-center">Video Progress</th>
                      <th className="py-3 px-6 text-center">Tasks Solved</th>
                      <th className="py-3 px-6 text-right">Points Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/50 text-caption font-semibold">
                    {users.map((u, i) => (
                      <tr key={u.username} className="hover:bg-surface-container transition-colors">
                        <td className="py-4 px-6 text-on-surface-variant">#{i + 1}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-xs shrink-0">
                              {u.username[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-on-surface">{u.username}</p>
                              {(u.username.toLowerCase() === 'muddathiradmin' || u.isAdmin) && (
                                <span className="text-[8px] bg-primary text-on-primary px-1 rounded-full font-bold">ADMIN</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-on-surface-variant font-mono">{u.enrolledDate || 'N/A'}</td>
                        <td className="py-4 px-6 text-center">
                          <span className="inline-flex items-center gap-0.5 text-error font-bold">
                            <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                            {u.streak || 0}d
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center text-on-surface">{u.videoCount} / {totalVideos}</td>
                        <td className="py-4 px-6 text-center text-on-surface">{u.taskCount} / {totalTasks}</td>
                        <td className="py-4 px-6 text-right text-primary font-black text-body-md">{u.points} XP</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ====== SCHEDULE TAB COURSE MANAGEMENT ====== */}
        {tab === 'schedule' && (
          <div className="space-y-6">
            
            {/* Search/Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-surface-bright p-4 rounded-xl border border-outline-variant/50 shadow-sm">
              <div className="relative w-full sm:w-80">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
                <input 
                  type="text"
                  placeholder="Filter curriculum schedule..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl pl-9 pr-4 py-2 text-body-sm focus:outline-none focus:border-primary font-medium"
                />
              </div>
              
              <button
                onClick={resetScheduleToDefault}
                className="w-full sm:w-auto px-4 py-2 bg-error/10 hover:bg-error/15 text-error rounded-xl font-bold text-caption border border-error/20 flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-inner"
              >
                <span className="material-symbols-outlined text-xl">restart_alt</span>
                Reset Curriculum
              </button>
            </div>

            {/* Course Card Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
              {filteredSchedule.map((day) => {
                const hasVideo = day.videos && day.videos.length > 0;
                return (
                  <div 
                    key={day.day} 
                    className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl flex flex-col justify-between hover:border-primary hover:shadow-md transition-all h-[180px]"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="bg-primary-fixed text-on-primary-fixed-variant px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                          {day.chapterNum ? `Ch ${day.chapterNum}` : day.type}
                        </span>
                        <span className="text-caption text-outline font-bold">
                          Day {day.day}
                        </span>
                      </div>
                      <h3 className="font-bold text-on-background truncate text-label-md" title={day.title}>
                        {day.title}
                      </h3>
                      <p className="text-caption text-on-surface-variant line-clamp-2 mt-1">
                        {day.task ? day.task.description : day.chapterTitle || 'Review module or REST break.'}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-outline-variant/40 flex justify-between items-center text-caption font-bold">
                      <span className={`capitalize ${day.type === 'off' ? 'text-amber-600' : 'text-primary'}`}>
                        {day.type}
                      </span>
                      <div className="flex gap-2">
                        {day.type !== 'off' && (
                          <button 
                            onClick={() => openEditor(day)}
                            className="text-primary hover:underline flex items-center gap-0.5 cursor-pointer bg-transparent border-0"
                          >
                            <span className="material-symbols-outlined text-[15px]">edit</span>
                            Edit
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ====== EDITOR TAB COURSE MATERIAL EDITOR ====== */}
        {tab === 'editor' && editorForm && (
          <div className="space-y-6">
            
            {/* Back Row */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => { setTab('schedule'); setEditingDay(null); }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface-container border border-outline-variant text-on-surface-variant hover:text-on-surface text-label-md font-bold transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">arrow_back</span>
                Cancel
              </button>
              <h2 className="font-headline-lg text-headline-lg font-black text-on-background">Edit Day {editingDay} Material</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-xl items-start">
              
              {/* Left Form Column */}
              <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 space-y-6 shadow-sm">
                
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="font-bold text-on-surface text-title-md border-b border-outline-variant/30 pb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-xl">info</span>
                    General Details
                  </h3>
                  <div>
                    <label className="block text-caption font-bold text-on-surface-variant mb-1.5">Day Title</label>
                    <input
                      value={editorForm.title}
                      onChange={e => setEditorForm({ ...editorForm, title: e.target.value })}
                      className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface text-body-md focus:outline-none focus:border-primary transition-all font-semibold"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-caption font-bold text-on-surface-variant mb-1.5">Day Type</label>
                      <select
                        value={editorForm.type}
                        onChange={e => setEditorForm({ ...editorForm, type: e.target.value })}
                        className="w-full px-3 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface text-body-md focus:outline-none focus:border-primary transition-all font-semibold"
                      >
                        <option value="video">Video Lecture</option>
                        <option value="review">Review Module</option>
                        <option value="off">Off Day</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-caption font-bold text-on-surface-variant mb-1.5">Chapter Number</label>
                      <input
                        type="number"
                        value={editorForm.chapterNum}
                        onChange={e => setEditorForm({ ...editorForm, chapterNum: e.target.value })}
                        className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface text-body-md focus:outline-none focus:border-primary transition-all font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-caption font-bold text-on-surface-variant mb-1.5">Chapter Group Title</label>
                      <input
                        value={editorForm.chapterTitle}
                        onChange={e => setEditorForm({ ...editorForm, chapterTitle: e.target.value })}
                        className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface text-body-md focus:outline-none focus:border-primary transition-all font-semibold"
                      />
                    </div>
                  </div>
                </div>

                {/* Video Fields */}
                <div className="space-y-4 pt-4 border-t border-outline-variant/40">
                  <h3 className="font-bold text-on-surface text-title-md border-b border-outline-variant/30 pb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-xl">play_circle</span>
                    YouTube Lecture Video
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-caption font-bold text-on-surface-variant mb-1.5">Video ID</label>
                      <input
                        value={editorForm.videoId}
                        onChange={e => setEditorForm({ ...editorForm, videoId: e.target.value })}
                        className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface font-mono text-body-md focus:outline-none focus:border-primary transition-all"
                        placeholder="e.g. WnMPk6_8qDo"
                      />
                    </div>
                    <div>
                      <label className="block text-caption font-bold text-on-surface-variant mb-1.5">Video Heading Title</label>
                      <input
                        value={editorForm.videoTitle}
                        onChange={e => setEditorForm({ ...editorForm, videoTitle: e.target.value })}
                        className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface text-body-md focus:outline-none focus:border-primary transition-all font-semibold"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { key: 'videoDuration', label: 'Duration (hh:mm:ss)' },
                      { key: 'assignedStart', label: 'Start Boundary' },
                      { key: 'assignedEnd', label: 'End Boundary' },
                    ].map(field => (
                      <div key={field.key}>
                        <label className="block text-caption font-bold text-on-surface-variant mb-1.5">{field.label}</label>
                        <input
                          value={editorForm[field.key]}
                          onChange={e => setEditorForm({ ...editorForm, [field.key]: e.target.value })}
                          className="w-full px-3 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface font-mono text-body-sm focus:outline-none focus:border-primary transition-all"
                          placeholder="00:00:00"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Coding Task Fields */}
                <div className="space-y-4 pt-4 border-t border-outline-variant/40">
                  <h3 className="font-bold text-on-surface text-title-md border-b border-outline-variant/30 pb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-xl font-bold">terminal</span>
                    Practice Coding Task
                  </h3>
                  <div>
                    <label className="block text-caption font-bold text-on-surface-variant mb-1.5">Task Short Title</label>
                    <input
                      value={editorForm.taskTitle}
                      onChange={e => setEditorForm({ ...editorForm, taskTitle: e.target.value })}
                      className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface text-body-md focus:outline-none focus:border-primary transition-all font-semibold"
                      placeholder="e.g. Variable Declarations"
                    />
                  </div>
                  <div>
                    <label className="block text-caption font-bold text-on-surface-variant mb-1.5">Task Objective Instructions</label>
                    <textarea
                      value={editorForm.taskDescription}
                      onChange={e => setEditorForm({ ...editorForm, taskDescription: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface text-body-md focus:outline-none focus:border-primary transition-all resize-y"
                      placeholder="Type instructions and constraints..."
                    />
                  </div>
                </div>

                {/* Form Save Action */}
                <div className="pt-4 border-t border-outline-variant/30 flex items-center gap-3">
                  <button
                    onClick={saveEditorDay}
                    className="px-lg py-sm bg-primary text-on-primary font-bold rounded-lg text-caption hover:opacity-90 transition-all cursor-pointer shadow-md"
                  >
                    Save Changes
                  </button>
                  {saved && (
                    <span className="text-tertiary font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      Day {editingDay} saved successfully
                    </span>
                  )}
                </div>

              </div>

              {/* Right Live-Preview Column */}
              <div className="lg:col-span-1 space-y-lg sticky top-24">
                
                {/* Live Day Card Preview */}
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm relative overflow-hidden">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-black text-outline uppercase tracking-wider">Live Preview</span>
                    <span className="w-2.5 h-2.5 bg-tertiary rounded-full animate-ping" />
                  </div>
                  
                  <div className="border border-outline-variant/60 rounded-xl p-md bg-surface">
                    <div className="flex justify-between items-start mb-2">
                      <span className="bg-primary-fixed text-on-primary-fixed-variant px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
                        {editorForm.chapterNum ? `Ch ${editorForm.chapterNum}` : editorForm.type}
                      </span>
                      <span className="text-caption text-outline font-bold">
                        Day {editingDay}
                      </span>
                    </div>
                    <h4 className="font-bold text-on-background truncate text-body-md">
                      {editorForm.title || 'Untitled Lecture'}
                    </h4>
                    <p className="text-caption text-on-surface-variant line-clamp-2 mt-1 leading-relaxed">
                      {editorForm.taskDescription || 'No code assignment configured.'}
                    </p>
                    
                    <div className="mt-4 pt-2 border-t border-outline-variant/40 flex justify-between text-caption font-bold text-outline-variant">
                      <span className="text-primary capitalize">{editorForm.type}</span>
                      <span>{editorForm.videoId ? 'Video lecture ok' : 'No Video'}</span>
                    </div>
                  </div>
                </div>

                {/* Dynamic details info card */}
                <div className="bg-surface p-lg border border-outline-variant rounded-xl flex items-start gap-3 select-text">
                  <span className="material-symbols-outlined text-primary text-xl">info</span>
                  <div className="text-caption font-semibold leading-relaxed text-on-surface-variant">
                    Editing this form writes changes directly to the localStorage database file. 
                    Day states will instantly sync inside the timeline outline and client player dashboards.
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* ====== SUBMISSIONS TAB ====== */}
        {tab === 'submissions' && (() => {
          const allSubmissions = [];
          users.forEach(u => {
            if (u.submissions) {
              Object.keys(u.submissions).forEach(dayNum => {
                allSubmissions.push({
                  username: u.username,
                  day: dayNum,
                  ...u.submissions[dayNum]
                });
              });
            }
          });
          allSubmissions.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

          return (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-surface-bright p-4 rounded-xl border border-outline-variant/50 shadow-sm">
                <h2 className="font-title-md text-on-surface font-bold">Student Project Submissions ({allSubmissions.length})</h2>
                
                <button
                  onClick={() => {
                    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allSubmissions, null, 2));
                    const downloadAnchor = document.createElement('a');
                    downloadAnchor.setAttribute("href",     dataStr);
                    downloadAnchor.setAttribute("download", "student_submissions.json");
                    document.body.appendChild(downloadAnchor);
                    downloadAnchor.click();
                    downloadAnchor.remove();
                  }}
                  className="px-4 py-2 border border-outline-variant text-primary hover:text-primary/95 font-bold text-caption rounded-lg bg-surface-container-lowest flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
                >
                  <span className="material-symbols-outlined text-xl">download</span>
                  Export Submissions (JSON)
                </button>
              </div>

              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="bg-surface-container-low text-on-surface-variant border-b border-outline-variant text-caption font-bold uppercase">
                        <th className="py-3 px-6">Student</th>
                        <th className="py-3 px-6">Project Name</th>
                        <th className="py-3 px-6">Day</th>
                        <th className="py-3 px-6">Submitted Date</th>
                        <th className="py-3 px-6">GitHub Link</th>
                        <th className="py-3 px-6">Developer Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/50 text-caption font-semibold">
                      {allSubmissions.map((sub, idx) => (
                        <tr key={idx} className="hover:bg-surface-container transition-colors align-top">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-xs shrink-0">
                                {sub.username[0].toUpperCase()}
                              </div>
                              <span className="font-bold text-on-surface">{sub.username}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-on-surface font-bold">{sub.projectName || 'Mini-Project'}</td>
                          <td className="py-4 px-6 text-on-surface-variant font-mono">Day {sub.day}</td>
                          <td className="py-4 px-6 text-on-surface-variant font-mono">
                            {new Date(sub.submittedAt).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-6">
                            <a
                              href={sub.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline font-bold flex items-center gap-1 w-fit"
                            >
                              <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                              Repository
                            </a>
                          </td>
                          <td className="py-4 px-6 text-on-surface-variant max-w-xs whitespace-pre-wrap select-text leading-relaxed font-semibold">
                            {sub.notes || <span className="italic text-outline">No notes provided.</span>}
                          </td>
                        </tr>
                      ))}
                      {allSubmissions.length === 0 && (
                        <tr>
                          <td colSpan="6" className="py-8 px-6 text-center text-on-surface-variant italic">
                            No student mini-projects have been submitted yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })()}

      </main>
    </div>
  );
}
