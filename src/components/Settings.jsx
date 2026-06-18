'use client';

import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { updateUserProgress, updateUserProfile, logoutUser, resetStoredSchedule, saveGlobalConfig, deleteUserAccount } from '../lib/storage';
import { saveGithubSettingsAction } from '../app/actions';
import InstructionsModal from './InstructionsModal';
export default function Settings({ user, onUserUpdate, onLogout }) {
  const { globalConfig, onGlobalConfigUpdate } = useApp();
  // Profile editing states
  const [name, setName] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);

  // Admin settings states
  const [openAvailability, setOpenAvailability] = useState(user?.settings?.openAvailability || false);
  const [openAvailabilityForAll, setOpenAvailabilityForAll] = useState(globalConfig?.openAvailabilityForAll || false);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  
  // GitHub integration states (admin only)
  const [githubToken, setGithubToken] = useState(user?.settings?.githubToken ? '••••••••••••••••' : '');
  const [githubRepo, setGithubRepo] = useState(user?.settings?.githubRepo || '');
  const [githubSaved, setGithubSaved] = useState(false);
  const [githubError, setGithubError] = useState('');
  const [showGithubToken, setShowGithubToken] = useState(false);
  const githubConfigured = !!(user?.settings?.githubToken && user?.settings?.githubRepo);

  // Instructions modal state
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);

  useEffect(() => {
    if (globalConfig) {
      setOpenAvailabilityForAll(globalConfig.openAvailabilityForAll || false);
    }
  }, [globalConfig]);

  const handleToggleGlobalOpenAvailability = async () => {
    const nextVal = !openAvailabilityForAll;
    setOpenAvailabilityForAll(nextVal);
    
    const updatedConfig = { ...globalConfig, openAvailabilityForAll: nextVal };
    const res = await saveGlobalConfig(updatedConfig);
    if (res && res.success) {
      onGlobalConfigUpdate(updatedConfig);
    }
  };

  const isAdmin = user?.username?.toLowerCase() === 'muddathiradmin' || user?.isAdmin === true;

  const handleSaveProfile = async () => {
    setProfileError('');
    setProfileSaved(false);

    if (!name.trim()) {
      setProfileError('Name cannot be empty');
      return;
    }

    if (email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        setProfileError('Please enter a valid email address');
        return;
      }
    }

    const res = await updateUserProfile(user.username, name.trim(), email.trim(), password);
    if (res.success) {
      onUserUpdate(res.user);
      setProfileSaved(true);
      setPassword('');
      setTimeout(() => setProfileSaved(false), 3000);
    } else {
      setProfileError(res.error);
    }
  };

  const handleSaveGithub = async () => {
    setGithubError('');
    setGithubSaved(false);
    const tokenToSave = githubToken.includes('•') ? user?.settings?.githubToken : githubToken;
    if (!tokenToSave?.trim()) {
      setGithubError('Please enter a GitHub Personal Access Token.');
      return;
    }
    if (!githubRepo.trim() || !githubRepo.includes('/')) {
      setGithubError('Repo must be in owner/repo-name format.');
      return;
    }
    const res = await saveGithubSettingsAction(tokenToSave, githubRepo.trim());
    if (res?.success) {
      if (res.user) onUserUpdate(res.user);
      setGithubSaved(true);
      setGithubToken('••••••••••••••••');
      setTimeout(() => setGithubSaved(false), 3000);
    } else {
      setGithubError(res?.error || 'Failed to save GitHub settings.');
    }
  };

  const handleToggleOpenAvailability = async () => {
    const nextVal = !openAvailability;
    setOpenAvailability(nextVal);
    
    const updated = await updateUserProgress(user.username, (u) => ({
      ...u,
      settings: {
        ...u.settings,
        openAvailability: nextVal,
      }
    }));
    if (updated) onUserUpdate(updated);
  };

  const handleReset = async () => {
    if (!resetConfirm) {
      setResetConfirm(true);
      return;
    }
    // Reset just this user's progress
    const updated = await updateUserProgress(user.username, (u) => ({
      ...u,
      streak: 0,
      lastActiveDate: null,
      totalStudyTime: 0,
      lessonsProgress: {},
      tasksProgress: {},
      studySessions: [],
    }));
    resetStoredSchedule();
    if (updated) onUserUpdate(updated);
    setResetConfirm(false);
  };

  const handleDeleteAccount = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }
    // Actually delete the account
    const res = await deleteUserAccount(user.username);
    if (res?.success) {
      await logoutUser();
      onLogout();
    }
  };

  return (
    <div className="flex-1 overflow-y-auto pt-24 pb-12 px-4 md:px-8 min-h-screen">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-display-lg font-headline-lg font-black text-on-background">Settings</h1>
          <p className="text-body-md text-on-surface-variant mt-1">Manage your account and study preferences</p>
        </div>

        {/* Profile Card */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 mb-6">
          <h2 className="font-bold text-on-background text-label-md mb-5 flex items-center gap-2 border-b border-outline-variant/30 pb-3">
            <span className="material-symbols-outlined text-primary">person</span>
            Profile Details
          </h2>
          
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-caption font-bold text-on-surface-variant mb-1.5">Full Name</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-xl">
                  person
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-surface-container border border-outline-variant rounded-xl text-on-surface text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-semibold"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-caption font-bold text-on-surface-variant mb-1.5">Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-xl">
                  mail
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Add an email address"
                  className="w-full pl-11 pr-4 py-2.5 bg-surface-container border border-outline-variant rounded-xl text-on-surface text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-semibold"
                />
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-caption font-bold text-on-surface-variant mb-1.5">Change Password (leave blank to keep current)</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-xl">
                  lock
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full pl-11 pr-11 py-2.5 bg-surface-container border border-outline-variant rounded-xl text-on-surface text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-semibold"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface-variant transition-colors cursor-pointer select-none bg-transparent border-0 p-0 flex items-center outline-none focus:text-primary"
                >
                  <span className="material-symbols-outlined text-xl">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Error/Success Messages */}
            {profileError && (
              <div className="flex items-center gap-2 p-3 bg-error-container text-on-error-container rounded-xl text-body-sm">
                <span className="material-symbols-outlined text-[18px]">error</span>
                {profileError}
              </div>
            )}

            {profileSaved && (
              <div className="flex items-center gap-2 p-3 bg-tertiary-container text-on-tertiary-container rounded-xl text-body-sm font-bold">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                Profile updated successfully!
              </div>
            )}

            {/* Save Button for Profile */}
            <button
              onClick={handleSaveProfile}
              className="mt-2 flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary font-bold rounded-xl hover:bg-primary/90 transition-all cursor-pointer shadow-sm"
            >
              <span className="material-symbols-outlined text-xl">save</span>
              Save Profile
            </button>
          </div>
        </div>

        {/* Study Preferences (Admin Only) */}
        {isAdmin && (
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 mb-6">
            <h2 className="font-bold text-on-background text-label-md mb-5 flex items-center gap-2 border-b border-outline-variant/30 pb-3">
              <span className="material-symbols-outlined text-primary">tune</span>
              Admin Study Preferences
            </h2>
            <div className="space-y-5">
              {/* Open availability */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-label-md font-bold text-on-surface">Open Availability</p>
                  <p className="text-body-sm text-on-surface-variant">Unlock all lessons regardless of date</p>
                </div>
                <button
                  onClick={handleToggleOpenAvailability}
                  className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
                    openAvailability ? 'bg-primary' : 'bg-surface-container-high border border-outline-variant'
                  }`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    openAvailability ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              {/* Global Open availability for all users */}
              <div className="flex items-center justify-between border-t border-outline-variant/30 pt-4 mt-4">
                <div>
                  <p className="text-label-md font-bold text-on-surface">Global Open Availability</p>
                  <p className="text-body-sm text-on-surface-variant">Unlock all lessons for all users regardless of date</p>
                </div>
                <button
                  onClick={handleToggleGlobalOpenAvailability}
                  className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
                    openAvailabilityForAll ? 'bg-primary' : 'bg-surface-container-high border border-outline-variant'
                  }`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    openAvailabilityForAll ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* GitHub Integration (Admin Only) */}
        {isAdmin && (
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 mb-6">
            <h2 className="font-bold text-on-background text-label-md mb-1 flex items-center gap-2 border-b border-outline-variant/30 pb-3">
              <span className="material-symbols-outlined text-primary">hub</span>
              GitHub Integration
              <span className={`ml-auto flex items-center gap-1 text-caption font-bold px-2 py-0.5 rounded-full ${
                githubConfigured
                  ? 'bg-tertiary/10 text-tertiary'
                  : 'bg-surface-container-high text-on-surface-variant'
              }`}>
                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: githubConfigured ? "'FILL' 1" : "'FILL' 0" }}>
                  {githubConfigured ? 'check_circle' : 'radio_button_unchecked'}
                </span>
                {githubConfigured ? 'Connected' : 'Not configured'}
              </span>
            </h2>
            <p className="text-body-sm text-on-surface-variant mb-4">
              Automatically push exercise solutions to a GitHub repository when you click the upload button after solving a task.
              Requires a{' '}
              <a
                href="https://github.com/settings/tokens/new?scopes=repo&description=Java+Study+Tracker"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline hover:opacity-80"
              >
                Personal Access Token
              </a>{' '}
              with <code className="bg-surface-container-high px-1 rounded text-caption">repo</code> scope.
            </p>

            <div className="space-y-4">
              {/* PAT input */}
              <div>
                <label className="block text-caption font-bold text-on-surface-variant mb-1.5">Personal Access Token</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-xl">key</span>
                  <input
                    type={showGithubToken ? 'text' : 'password'}
                    value={githubToken}
                    onChange={e => { setGithubToken(e.target.value); setGithubSaved(false); }}
                    onFocus={() => { if (githubToken.includes('•')) setGithubToken(''); }}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                    className="w-full pl-11 pr-11 py-2.5 bg-surface-container border border-outline-variant rounded-xl text-on-surface text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-mono text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowGithubToken(!showGithubToken)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface-variant transition-colors cursor-pointer bg-transparent border-0 p-0 flex items-center"
                  >
                    <span className="material-symbols-outlined text-xl">{showGithubToken ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>

              {/* Repo input */}
              <div>
                <label className="block text-caption font-bold text-on-surface-variant mb-1.5">Repository (owner/repo-name)</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-xl">folder_open</span>
                  <input
                    type="text"
                    value={githubRepo}
                    onChange={e => { setGithubRepo(e.target.value); setGithubSaved(false); }}
                    placeholder="muddathiroshey/java-solutions"
                    className="w-full pl-11 pr-4 py-2.5 bg-surface-container border border-outline-variant rounded-xl text-on-surface text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-semibold"
                  />
                </div>
              </div>

              {/* Error / Success */}
              {githubError && (
                <div className="flex items-center gap-2 p-3 bg-error-container text-on-error-container rounded-xl text-body-sm">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  {githubError}
                </div>
              )}
              {githubSaved && (
                <div className="flex items-center gap-2 p-3 bg-tertiary-container text-on-tertiary-container rounded-xl text-body-sm font-bold">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  GitHub settings saved!
                </div>
              )}

              <button
                onClick={handleSaveGithub}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary font-bold rounded-xl hover:bg-primary/90 transition-all cursor-pointer shadow-sm"
              >
                <span className="material-symbols-outlined text-xl">save</span>
                Save GitHub Settings
              </button>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 mb-6">
          <h2 className="font-bold text-on-background text-label-md mb-5 flex items-center gap-2 border-b border-outline-variant/30 pb-3">
            <span className="material-symbols-outlined text-primary">info</span>
            Instructions
          </h2>
          <p className="text-body-sm text-on-surface-variant mb-4">
            Learn how to use the Java Study Platform by watching the instructional video.
          </p>
          <button
            onClick={() => setShowInstructionsModal(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary font-bold rounded-xl hover:bg-primary/90 transition-all cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-xl">play_circle</span>
            Watch Instructions
          </button>
        </div>

        {/* Danger Zone */}
        <div className="bg-error/5 border border-error/20 rounded-2xl p-6 mb-6">
          <h2 className="font-bold text-error text-label-md mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined">warning</span>
            Danger Zone
          </h2>
          <p className="text-body-sm text-on-surface-variant mb-4">
            Reset your progress. This cannot be undone and will clear all lesson completions and task submissions.
          </p>
          <button
            onClick={handleReset}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-label-md transition-all cursor-pointer ${
              resetConfirm
                ? 'bg-error text-on-error animate-pulse'
                : 'bg-error/10 text-error hover:bg-error/20 border border-error/20'
            }`}
          >
            <span className="material-symbols-outlined text-xl">delete_sweep</span>
            {resetConfirm ? 'Click Again to Confirm Reset' : 'Reset My Progress'}
          </button>

          {/* Divider */}
          <div className="border-t border-error/20 pt-4 mt-2">
            <p className="text-body-sm text-on-surface-variant mb-3">
              Permanently delete your account and all associated data. <strong className="text-error">This cannot be undone.</strong>
            </p>
            <button
              onClick={handleDeleteAccount}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-label-md transition-all cursor-pointer ${
                deleteConfirm
                  ? 'bg-error text-on-error animate-pulse'
                  : 'bg-error/20 text-error hover:bg-error/30 border border-error/30'
              }`}
            >
              <span className="material-symbols-outlined text-xl">person_remove</span>
              {deleteConfirm ? '⚠️ Click Again — Account will be DELETED' : 'Delete My Account Permanently'}
            </button>
          </div>
        </div>

        {/* Logout */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6">
          <h2 className="font-bold text-on-background text-label-md mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-on-surface-variant">logout</span>
            Sign Out
          </h2>
          <p className="text-body-sm text-on-surface-variant mb-4">
            Your progress is saved locally. You can log back in anytime.
          </p>
          <button
            onClick={() => { logoutUser(); onLogout(); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-surface-container border border-outline-variant text-on-surface hover:bg-surface-container-high text-label-md font-bold rounded-xl transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
            Sign Out
          </button>
        </div>

        {/* Instructions Modal */}
        {showInstructionsModal && (
          <InstructionsModal 
            onClose={() => setShowInstructionsModal(false)}
          />
        )}
      </div>
    </div>
  );
}
