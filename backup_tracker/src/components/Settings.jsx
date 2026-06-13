'use client';

import { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Trash2, 
  CalendarClock, 
  Check 
} from 'lucide-react';

export default function Settings({ 
  user, 
  currentDate, 
  onUpdateSettings, 
  onResetProgress 
}) {
  const [warpEnabled, setWarpEnabled] = useState(user.settings?.devWarpTime || false);
  const [fakeDateVal, setFakeDateVal] = useState(currentDate);
  const [showSaved, setShowSaved] = useState(false);

  const handleSaveSettings = () => {
    onUpdateSettings({
      devWarpTime: warpEnabled,
      currentFakeDate: warpEnabled ? fakeDateVal : null
    });
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  const handleResetClick = () => {
    if (confirm("Are you sure you want to reset all your learning progress, streaks, and completed lessons? This cannot be undone.")) {
      onResetProgress();
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="border-b border-custom-border pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <SettingsIcon className="h-6 w-6 text-primary-color" />
          Settings
        </h1>
        <p className="text-sm text-muted-text mt-1">
          Manage account settings, reset your profile statistics, and simulate date warps.
        </p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Profile Card */}
        <div className="glass-panel rounded-2xl p-5 md:p-6 space-y-4">
          <h3 className="font-bold text-base text-foreground flex items-center gap-2">
            <User className="h-4.5 w-4.5 text-primary-color" />
            Account Information
          </h3>
          
          <div className="grid gap-4 grid-cols-2">
            <div className="space-y-1">
              <span className="text-xxs font-bold text-muted-text uppercase tracking-wider block">Username</span>
              <span className="text-sm font-semibold text-foreground">{user.username}</span>
            </div>
            <div className="space-y-1">
              <span className="text-xxs font-bold text-muted-text uppercase tracking-wider block">Enrollment Date</span>
              <span className="text-sm font-semibold text-foreground">{user.enrolledDate}</span>
            </div>
          </div>
        </div>

        {/* Targets & Warp Settings */}
        <div className="glass-panel rounded-2xl p-5 md:p-6 space-y-5">
          <h3 className="font-bold text-base text-foreground flex items-center gap-2">
            <CalendarClock className="h-4.5 w-4.5 text-primary-color" />
            Study Preferences
          </h3>

          <div className="space-y-4">
            {/* Developer Warp Time Toggle */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    Developer Time-Warp Mode
                  </h4>
                  <p className="text-[10px] text-muted-text mt-0.5">
                    Enable this option to override date checking and unlock future lessons or simulate study dates.
                  </p>
                </div>
                
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={warpEnabled}
                    onChange={(e) => setWarpEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-white/10 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-secondary-color"></div>
                </label>
              </div>

              {warpEnabled && (
                <div className="bg-black/20 p-4 rounded-xl border border-custom-border space-y-3 animate-fade-in">
                  <label className="text-xxs font-bold text-muted-text uppercase tracking-wider block font-sans">
                    Simulate System Date
                  </label>
                  <input
                    type="date"
                    value={fakeDateVal}
                    min="2026-06-15"
                    max="2026-07-31"
                    onChange={(e) => setFakeDateVal(e.target.value)}
                    className="w-full max-w-xs px-4 py-2 rounded-lg border border-custom-border bg-black/30 text-white focus:outline-none focus:border-secondary-color/40 text-xs font-sans"
                  />
                  <p className="text-[9px] text-muted-text leading-relaxed font-sans">
                    Set a date between **June 15, 2026** and **July 31, 2026** to check layout contents, off days, and lesson lists for that calendar point.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-custom-border pt-4 flex items-center gap-4">
            <button
              onClick={handleSaveSettings}
              className="px-5 py-2.5 rounded-lg bg-primary-color hover:bg-primary-hover text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-md transition-colors"
            >
              Save Settings
            </button>
            {showSaved && (
              <span className="text-xs font-bold text-emerald-color flex items-center gap-1">
                <Check className="h-4 w-4" />
                Saved!
              </span>
            )}
          </div>
        </div>

        {/* Reset Progress Panel */}
        <div className="glass-panel rounded-2xl p-5 md:p-6 border-red-500/20 bg-red-500/3 space-y-4">
          <div>
            <h3 className="font-bold text-base text-red-400 flex items-center gap-2">
              <Trash2 className="h-4.5 w-4.5" />
              Danger Zone
            </h3>
            <p className="text-[10px] text-muted-text mt-1 leading-normal font-sans">
              Reset all lesson completions, completed code tasks, and streak statistics. This action cannot be reversed.
            </p>
          </div>
          
          <button
            onClick={handleResetClick}
            className="px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-semibold cursor-pointer transition-colors"
          >
            Reset Account Progress
          </button>
        </div>
      </div>
    </div>
  );
}
