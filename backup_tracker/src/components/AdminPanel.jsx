'use client';

import { useState } from 'react';
import { 
  Settings, 
  Plus, 
  Trash2, 
  Save, 
  BookOpen, 
  FileText, 
  FileCode, 
  ListTodo, 
  RefreshCw,
  Video,
  Clock,
  ArrowRight,
  HelpCircle,
  Terminal,
  Info
} from 'lucide-react';

const isValidTimeFormat = (timeStr) => {
  if (!timeStr) return false;
  return /^\d{2}:\d{2}:\d{2}$/.test(timeStr.toString());
};

export default function AdminPanel({ 
  schedule, 
  onSaveSchedule, 
  onResetSchedule, 
  openAvailability, 
  onToggleOpenAvailability 
}) {
  const [selectedDayNum, setSelectedDayNum] = useState(1);
  const [editedDay, setEditedDay] = useState(null);

  // Sync edits when selected day changes
  const handleSelectDay = (dayNum) => {
    setSelectedDayNum(dayNum);
    const day = schedule.find(d => d.day === dayNum);
    if (day) {
      // Create a deep copy of the day
      setEditedDay(JSON.parse(JSON.stringify(day)));
    }
  };

  // Initialize selected day on load
  if (!editedDay && schedule.length > 0) {
    const day = schedule.find(d => d.day === selectedDayNum);
    if (day) {
      setEditedDay(JSON.parse(JSON.stringify(day)));
    }
  }

  const handleFieldChange = (field, val) => {
    setEditedDay(prev => ({
      ...prev,
      [field]: val
    }));
  };

  // Video helpers
  const handleAddVideo = () => {
    const newVideo = {
      videoId: '',
      title: 'New Video Lesson',
      duration: '00:10:00',
      assignedStart: '00:00:00',
      assignedEnd: '00:10:00',
      thumbnail: 'https://i.ytimg.com/vi/WnMPk6_8qDo/hqdefault.jpg',
      url: 'https://www.youtube.com/watch?v='
    };
    
    setEditedDay(prev => ({
      ...prev,
      videos: [...(prev.videos || []), newVideo]
    }));
  };

  const handleVideoFieldChange = (idx, field, val) => {
    setEditedDay(prev => {
      const copy = [...prev.videos];
      copy[idx] = {
        ...copy[idx],
        [field]: val
      };
      
      // Update url and thumbnail if videoId changes
      if (field === 'videoId') {
        copy[idx].url = `https://www.youtube.com/watch?v=${val}`;
        copy[idx].thumbnail = `https://i.ytimg.com/vi/${val}/hqdefault.jpg`;
      }
      return { ...prev, videos: copy };
    });
  };

  const handleRemoveVideo = (idx) => {
    setEditedDay(prev => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== idx)
    }));
  };

  // Task Helpers
  const handleToggleTask = (e) => {
    const hasTask = e.target.checked;
    if (hasTask) {
      setEditedDay(prev => ({
        ...prev,
        task: {
          taskId: `task_${prev.day}`,
          title: `Practice Task ${prev.day}`,
          description: 'Write Java statements to solve the problem.',
          codeTemplate: 'public class TaskSolution {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}',
          testCases: [{ id: 1, input: '', expected: 'Success', description: 'Checks output matching' }],
          quiz: [{ question: 'What is Java?', options: ['Programming Language', 'Coffee'], correctIdx: 0 }]
        }
      }));
    } else {
      setEditedDay(prev => {
        const copy = { ...prev };
        delete copy.task;
        return copy;
      });
    }
  };

  const handleTaskFieldChange = (field, val) => {
    setEditedDay(prev => ({
      ...prev,
      task: {
        ...prev.task,
        [field]: val
      }
    }));
  };

  // Validate if all time formats are valid
  const hasInvalidTimeFormats = editedDay?.videos?.some(vid => 
    !isValidTimeFormat(vid.duration) ||
    !isValidTimeFormat(vid.assignedStart) ||
    !isValidTimeFormat(vid.assignedEnd)
  ) || false;

  // Save Day
  const handleSaveDay = () => {
    if (hasInvalidTimeFormats) {
      alert("Please correct the invalid time formats (hh:mm:ss) before saving.");
      return;
    }
    const updatedSchedule = schedule.map(d => d.day === editedDay.day ? editedDay : d);
    onSaveSchedule(updatedSchedule);
    alert(`Day ${editedDay.day} changes saved successfully!`);
  };

  return (
    <div className="flex-grow overflow-y-auto p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-custom-border pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Settings className="h-6 w-6 text-secondary-color" />
            Admin Control Center
          </h1>
          <p className="text-sm text-muted-text mt-1">
            Configure calendar locking, reallocate videos/tasks, and customize target durations.
          </p>
        </div>

        {/* Reset Button */}
        <button
          onClick={() => {
            if (confirm("Reset schedule back to the default 47-day layout? All customized videos, times, and edits will be lost.")) {
              onResetSchedule();
              alert("Schedule reset successfully!");
              handleSelectDay(1);
            }
          }}
          className="px-4 py-2 rounded-lg border border-red-500/20 text-red-400 bg-red-500/5 hover:bg-red-500/10 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
        >
          <RefreshCw className="h-4.5 w-4.5" />
          Reset Schedule Layout
        </button>
      </div>

      {/* Global settings */}
      <div className="glass-panel rounded-2xl p-5 md:p-6 flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
            <Info className="h-4 w-4 text-primary-color" />
            Global Open Availability Mode
          </h3>
          <p className="text-xxs text-muted-text max-w-xl">
            Toggle this on to instantly unlock all 47 days in the roadmap for all accounts. When off, days unlock sequentially based on the system date.
          </p>
        </div>
        
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={openAvailability}
            onChange={(e) => onToggleOpenAvailability(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary-color"></div>
        </label>
      </div>

      {/* Layout Editor Columns */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Days Navigator list */}
        <div className="glass-panel rounded-2xl p-5 flex flex-col space-y-3 h-[500px]">
          <span className="text-xxs font-bold text-muted-text uppercase tracking-widest block pb-2 border-b border-custom-border">Day Selector</span>
          
          <div className="overflow-y-auto flex-1 space-y-1.5 pr-2">
            {schedule.map(d => {
              const isSelected = selectedDayNum === d.day;
              return (
                <button
                  key={d.day}
                  onClick={() => handleSelectDay(d.day)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex justify-between items-center transition-all cursor-pointer border ${
                    isSelected 
                      ? 'bg-secondary-color/10 border-secondary-color text-secondary-color font-bold' 
                      : 'bg-white/2 border-custom-border text-muted-text hover:text-foreground'
                  }`}
                >
                  <span>Day {d.day}: {d.title}</span>
                  <span className="text-[10px] text-muted-text uppercase font-semibold">{d.type}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Day Details Editor Form */}
        {editedDay && (
          <div className="lg:col-span-2 glass-panel rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-custom-border pb-4">
              <h3 className="font-bold text-sm text-foreground">Editing Day {editedDay.day} Configuration</h3>
              
              <div className="flex items-center gap-3">
                {hasInvalidTimeFormats && (
                  <span className="text-[10px] text-red-400 font-bold border border-red-500/20 bg-red-500/5 px-2.5 py-1 rounded-lg">
                    Fix invalid hh:mm:ss format(s) to save
                  </span>
                )}
                <button
                  onClick={handleSaveDay}
                  disabled={hasInvalidTimeFormats}
                  className={`px-4 py-2 rounded-lg text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all ${
                    hasInvalidTimeFormats 
                      ? 'bg-gray-500/50 border border-gray-500/20 cursor-not-allowed opacity-50' 
                      : 'bg-secondary-color hover:bg-secondary-color/90 cursor-pointer'
                  }`}
                >
                  <Save className="h-4 w-4" />
                  Save Day Changes
                </button>
              </div>
            </div>

            <div className="grid gap-4 grid-cols-2">
              {/* Day Title */}
              <div className="space-y-1.5">
                <label className="text-xxs font-bold text-muted-text uppercase tracking-wider block">Day Title</label>
                <input
                  type="text"
                  value={editedDay.title}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-custom-border bg-black/20 text-white text-xs focus:outline-none"
                />
              </div>

              {/* Day Type Selector */}
              <div className="space-y-1.5">
                <label className="text-xxs font-bold text-muted-text uppercase tracking-wider block">Day Type</label>
                <select
                  value={editedDay.type}
                  onChange={(e) => handleFieldChange('type', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-custom-border bg-[#0d1426] text-foreground text-xs focus:outline-none"
                >
                  <option value="video">Video Lecture & Lesson</option>
                  <option value="review">Revision & Milestone Review</option>
                  <option value="off">🏖️ Off Rest Day</option>
                </select>
              </div>

              {/* Chapter Number */}
              <div className="space-y-1.5">
                <label className="text-xxs font-bold text-muted-text uppercase tracking-wider block">Chapter Number</label>
                <input
                  type="number"
                  value={editedDay.chapterNum || ''}
                  onChange={(e) => handleFieldChange('chapterNum', e.target.value ? Number(e.target.value) : null)}
                  className="w-full px-4 py-2 rounded-lg border border-custom-border bg-black/20 text-white text-xs focus:outline-none"
                />
              </div>

              {/* Chapter Title */}
              <div className="space-y-1.5">
                <label className="text-xxs font-bold text-muted-text uppercase tracking-wider block">Chapter Title</label>
                <input
                  type="text"
                  value={editedDay.chapterTitle || ''}
                  onChange={(e) => handleFieldChange('chapterTitle', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-custom-border bg-black/20 text-white text-xs focus:outline-none"
                />
              </div>
            </div>

            {/* Video Lessons List Editor */}
            {editedDay.type === 'video' && (
              <div className="border-t border-custom-border pt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Video className="h-4.5 w-4.5 text-secondary-color" />
                    Assigned Video Lessons
                  </h4>
                  <button
                    onClick={handleAddVideo}
                    className="px-2.5 py-1.5 rounded bg-white/5 border border-custom-border hover:bg-white/10 text-[10px] font-bold text-foreground flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                    Add Video
                  </button>
                </div>

                <div className="space-y-4">
                  {(editedDay.videos || []).map((vid, idx) => (
                    <div key={idx} className="bg-black/20 border border-custom-border rounded-xl p-4 space-y-3 relative">
                      <button
                        onClick={() => handleRemoveVideo(idx)}
                        className="absolute top-4 right-4 text-muted-text hover:text-red-400 p-1 cursor-pointer"
                        title="Remove Video"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                      <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-muted-text uppercase tracking-wider block">YouTube Video ID</label>
                          <input
                            type="text"
                            value={vid.videoId}
                            onChange={(e) => handleVideoFieldChange(idx, 'videoId', e.target.value)}
                            className="w-full px-3 py-1.5 rounded bg-[#0d1426] border border-custom-border text-foreground text-xxs focus:outline-none"
                            placeholder="e.g. WnMPk6_8qDo"
                          />
                        </div>
                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-[9px] font-bold text-muted-text uppercase tracking-wider block">Video Title</label>
                          <input
                            type="text"
                            value={vid.title}
                            onChange={(e) => handleVideoFieldChange(idx, 'title', e.target.value)}
                            className="w-full px-3 py-1.5 rounded bg-[#0d1426] border border-custom-border text-foreground text-xxs focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Video Assigned Segments */}
                      <div className="grid gap-3 grid-cols-3 border-t border-custom-border/50 pt-2">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-muted-text uppercase tracking-wider block">Total Duration</label>
                          <input
                            type="text"
                            value={vid.duration}
                            onChange={(e) => handleVideoFieldChange(idx, 'duration', e.target.value)}
                            className={`w-full px-3 py-1.5 rounded bg-[#0d1426] border text-foreground text-xxs focus:outline-none ${
                              !isValidTimeFormat(vid.duration) ? 'border-red-500/50 ring-1 ring-red-500/30' : 'border-custom-border'
                            }`}
                            placeholder="e.g. 00:59:30"
                          />
                          {!isValidTimeFormat(vid.duration) && (
                            <span className="text-[8px] text-red-400 font-semibold block leading-tight">Must be hh:mm:ss</span>
                          )}
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-muted-text uppercase tracking-wider block">Start Time</label>
                          <input
                            type="text"
                            value={vid.assignedStart ?? '00:00:00'}
                            onChange={(e) => handleVideoFieldChange(idx, 'assignedStart', e.target.value)}
                            className={`w-full px-3 py-1.5 rounded bg-[#0d1426] border text-foreground text-xxs focus:outline-none ${
                              !isValidTimeFormat(vid.assignedStart) ? 'border-red-500/50 ring-1 ring-red-500/30' : 'border-custom-border'
                            }`}
                            placeholder="e.g. 00:00:00"
                          />
                          {!isValidTimeFormat(vid.assignedStart) && (
                            <span className="text-[8px] text-red-400 font-semibold block leading-tight">Must be hh:mm:ss</span>
                          )}
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-muted-text uppercase tracking-wider block">End Time</label>
                          <input
                            type="text"
                            value={vid.assignedEnd ?? '00:00:00'}
                            onChange={(e) => handleVideoFieldChange(idx, 'assignedEnd', e.target.value)}
                            className={`w-full px-3 py-1.5 rounded bg-[#0d1426] border text-foreground text-xxs focus:outline-none ${
                              !isValidTimeFormat(vid.assignedEnd) ? 'border-red-500/50 ring-1 ring-red-500/30' : 'border-custom-border'
                            }`}
                            placeholder="e.g. 00:45:00"
                          />
                          {!isValidTimeFormat(vid.assignedEnd) && (
                            <span className="text-[8px] text-red-400 font-semibold block leading-tight">Must be hh:mm:ss</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {(editedDay.videos || []).length === 0 && (
                    <p className="text-xxs text-muted-text italic py-2">No videos currently configured for this day.</p>
                  )}
                </div>
              </div>
            )}

            {/* Task Enable Checker */}
            {editedDay.type === 'video' && (
              <div className="border-t border-custom-border pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Terminal className="h-4.5 w-4.5 text-emerald-color" />
                    Connect Practice Task
                  </h4>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!editedDay.task}
                      onChange={handleToggleTask}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-white/10 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-color"></div>
                  </label>
                </div>

                {editedDay.task && (
                  <div className="bg-emerald-color/3 border border-emerald-color/10 rounded-xl p-4 space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold text-muted-text uppercase tracking-wider block">Task Title</label>
                      <input
                        type="text"
                        value={editedDay.task.title}
                        onChange={(e) => handleTaskFieldChange('title', e.target.value)}
                        className="w-full px-3 py-1.5 rounded bg-[#0d1426] border border-custom-border text-foreground text-xxs focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold text-muted-text uppercase tracking-wider block">Task Description</label>
                      <textarea
                        value={editedDay.task.description}
                        onChange={(e) => handleTaskFieldChange('description', e.target.value)}
                        className="w-full h-16 p-3 rounded bg-[#0d1426] border border-custom-border text-foreground text-xxs focus:outline-none resize-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold text-muted-text uppercase tracking-wider block">Starting Code Template (Java)</label>
                      <textarea
                        value={editedDay.task.codeTemplate}
                        onChange={(e) => handleTaskFieldChange('codeTemplate', e.target.value)}
                        className="w-full h-24 p-3 font-mono rounded bg-[#0d1426] border border-custom-border text-emerald-400 text-xxs focus:outline-none resize-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
