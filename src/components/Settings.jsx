'use client';

import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { updateUserProgress, updateUserProfile, logoutUser, resetStoredSchedule, saveGlobalConfig, deleteUserAccount } from '../lib/storage';
import { saveGithubRepoAction, disconnectGithubAction, getGithubReposAction } from '../app/actions';

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
  
  // GitHub OAuth states
  const [githubRepo, setGithubRepo]         = useState(user?.settings?.githubRepo || '');
  const [githubRepoSaved, setGithubRepoSaved] = useState(false);
  const [githubRepoError, setGithubRepoError] = useState('');
  const [githubToast, setGithubToast]         = useState(null); // 'connected' | 'error' | null
  const [githubToastMsg, setGithubToastMsg]   = useState('');
  const githubConnected = !!(user?.settings?.githubToken);
  const githubLogin     = user?.settings?.githubLogin || null;

  // Repo picker state
  const [repoPickerOpen, setRepoPickerOpen]   = useState(false);
  const [repoList, setRepoList]               = useState([]);
  const [repoLoading, setRepoLoading]         = useState(false);
  const [repoError, setRepoError]             = useState('');
  const [repoSearch, setRepoSearch]           = useState('');

  // Read ?github= param on mount and show toast
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const gh = params.get('github');
    if (gh === 'connected') {
      setGithubToast('connected');
      // Clean the URL
      window.history.replaceState({}, '', window.location.pathname);
      setTimeout(() => setGithubToast(null), 5000);
    } else if (gh === 'error') {
      const reason = params.get('reason') || 'unknown';
      setGithubToast('error');
      setGithubToastMsg(reason.replace(/_/g, ' '));
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);



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
  const canUseGithub = true;

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

  const handleSaveRepo = async (repoFullName) => {
    setGithubRepoError('');
    setGithubRepoSaved(false);
    const repo = repoFullName || githubRepo;
    if (!repo.trim() || !repo.includes('/')) {
      setGithubRepoError('Invalid repo name.');
      return;
    }
    const res = await saveGithubRepoAction(repo.trim());
    if (res?.success) {
      if (res.user) onUserUpdate(res.user);
      setGithubRepo(repo.trim());
      setGithubRepoSaved(true);
      setRepoPickerOpen(false);
      setTimeout(() => setGithubRepoSaved(false), 3000);
    } else {
      setGithubRepoError(res?.error || 'Failed to save repo.');
    }
  };

  const loadRepos = async () => {
    setRepoLoading(true);
    setRepoError('');
    const res = await getGithubReposAction();
    setRepoLoading(false);
    if (res?.success) {
      setRepoList(res.repos);
    } else {
      setRepoError(res?.error || 'Failed to load repositories.');
    }
  };

  const handleDisconnect = async () => {
    const res = await disconnectGithubAction();
    if (res?.success) {
      if (res.user) onUserUpdate(res.user);
      setGithubRepo('');
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

        {/* GitHub Integration (admin + مدثر only for now) */}
        {canUseGithub && (
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 mb-6">
            {/* Card header */}
            <h2 className="font-bold text-on-background text-label-md mb-1 flex items-center gap-2 border-b border-outline-variant/30 pb-3">
              <span className="material-symbols-outlined text-primary">hub</span>
              GitHub Integration
              <span className={`ml-auto flex items-center gap-1 text-caption font-bold px-2 py-0.5 rounded-full ${
                githubConnected
                  ? 'bg-tertiary/10 text-tertiary'
                  : 'bg-surface-container-high text-on-surface-variant'
              }`}>
                <span
                  className="material-symbols-outlined text-[14px]"
                  style={{ fontVariationSettings: githubConnected ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {githubConnected ? 'check_circle' : 'radio_button_unchecked'}
                </span>
                {githubConnected ? `Connected${githubLogin ? ` as @${githubLogin}` : ''}` : 'Not connected'}
              </span>
            </h2>

            {/* OAuth result toasts */}
            {githubToast === 'connected' && (
              <div className="flex items-center gap-2 p-3 mb-4 bg-tertiary-container text-on-tertiary-container rounded-xl text-body-sm font-bold">
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                GitHub connected successfully!
              </div>
            )}
            {githubToast === 'error' && (
              <div className="flex items-center gap-2 p-3 mb-4 bg-error-container text-on-error-container rounded-xl text-body-sm">
                <span className="material-symbols-outlined text-[18px]">error</span>
                GitHub connection failed{githubToastMsg ? `: ${githubToastMsg}` : ''}. Please try again.
              </div>
            )}

            {!githubConnected ? (
              /* ── Not connected ── */
              <div className="space-y-4">
                <p className="text-body-sm text-on-surface-variant">
                  Connect your GitHub account to push exercise solutions to a repository automatically after solving a task.
                </p>
                <a
                  href="/api/auth/github/connect"
                  className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-[#24292f] hover:bg-[#30363d] text-white font-bold rounded-xl transition-colors shadow-sm cursor-pointer select-none"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
                  </svg>
                  Connect with GitHub
                </a>
              </div>
            ) : (
              /* ── Connected ── */
              <div className="space-y-5">
                {/* GitHub user badge */}
                {githubLogin && (
                  <div className="flex items-center gap-3 p-3 bg-surface-container-low border border-outline-variant/60 rounded-xl">
                    <img
                      src={`https://github.com/${githubLogin}.png?size=40`}
                      alt={githubLogin}
                      className="w-9 h-9 rounded-full border border-outline-variant"
                    />
                    <div>
                      <p className="font-bold text-body-sm text-on-surface">@{githubLogin}</p>
                      <p className="text-caption text-on-surface-variant">GitHub account connected</p>
                    </div>
                  </div>
                )}

                {/* Repo picker */}
                <div>
                  <label className="block text-caption font-bold text-on-surface-variant mb-1.5">
                    Target Repository
                  </label>

                  {/* Selected repo badge */}
                  {githubRepo && !repoPickerOpen && (
                    <div className="flex items-center gap-2 p-3 mb-2 bg-surface-container-low border border-outline-variant/60 rounded-xl">
                      <span className="material-symbols-outlined text-primary text-xl">folder</span>
                      <span className="font-bold text-body-sm text-on-surface flex-1 truncate">{githubRepo}</span>
                      <button
                        onClick={() => { setRepoPickerOpen(true); setRepoSearch(''); if (repoList.length === 0) loadRepos(); }}
                        className="text-caption font-bold text-primary hover:underline cursor-pointer bg-transparent border-0 shrink-0"
                      >
                        Change
                      </button>
                    </div>
                  )}

                  {/* Open picker button (when no repo selected yet) */}
                  {!githubRepo && !repoPickerOpen && (
                    <button
                      onClick={() => { setRepoPickerOpen(true); setRepoSearch(''); loadRepos(); }}
                      className="w-full flex items-center gap-2.5 px-4 py-3 bg-surface-container border border-outline-variant rounded-xl text-on-surface-variant hover:border-primary hover:text-primary transition-all cursor-pointer font-semibold text-body-sm"
                    >
                      <span className="material-symbols-outlined text-xl">folder_open</span>
                      Choose a repository…
                      <span className="material-symbols-outlined text-xl ml-auto">expand_more</span>
                    </button>
                  )}

                  {/* Dropdown repo list */}
                  {repoPickerOpen && (
                    <div className="border border-outline-variant rounded-xl overflow-hidden shadow-xl bg-surface-container-lowest">
                      {/* Search bar */}
                      <div className="flex items-center gap-2 p-3 border-b border-outline-variant/50 bg-surface-container">
                        <span className="material-symbols-outlined text-outline text-xl shrink-0">search</span>
                        <input
                          autoFocus
                          type="text"
                          value={repoSearch}
                          onChange={e => setRepoSearch(e.target.value)}
                          placeholder="Search repositories…"
                          className="flex-1 bg-transparent outline-none text-on-surface text-body-sm font-semibold placeholder:text-on-surface-variant/50"
                        />
                        <button
                          onClick={() => setRepoPickerOpen(false)}
                          className="shrink-0 text-outline hover:text-on-surface cursor-pointer bg-transparent border-0 p-0 flex items-center"
                        >
                          <span className="material-symbols-outlined text-xl">close</span>
                        </button>
                      </div>

                      {/* List */}
                      <div className="max-h-64 overflow-y-auto custom-scrollbar">
                        {repoLoading && (
                          <div className="flex items-center justify-center gap-2 py-8 text-on-surface-variant">
                            <span className="material-symbols-outlined animate-spin text-primary text-2xl">progress_activity</span>
                            <span className="text-body-sm font-semibold">Loading repositories…</span>
                          </div>
                        )}
                        {repoError && !repoLoading && (
                          <div className="flex items-center gap-2 p-4 text-error text-body-sm">
                            <span className="material-symbols-outlined text-xl">error</span>
                            {repoError}
                          </div>
                        )}
                        {!repoLoading && !repoError && repoList
                          .filter(r => r.full_name.toLowerCase().includes(repoSearch.toLowerCase()))
                          .map(repo => (
                            <button
                              key={repo.id}
                              onClick={() => handleSaveRepo(repo.full_name)}
                              className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-surface-container-high transition-colors cursor-pointer border-0 border-b border-outline-variant/20 last:border-b-0 ${
                                githubRepo === repo.full_name ? 'bg-primary/5' : ''
                              }`}
                            >
                              <span className="material-symbols-outlined text-outline text-xl mt-0.5 shrink-0">
                                {repo.private ? 'lock' : 'folder'}
                              </span>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-body-sm text-on-surface truncate">{repo.full_name}</span>
                                  {repo.private && (
                                    <span className="shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant uppercase tracking-wider">Private</span>
                                  )}
                                  {githubRepo === repo.full_name && (
                                    <span className="material-symbols-outlined text-primary text-[16px] shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                  )}
                                </div>
                                {repo.description && (
                                  <p className="text-caption text-on-surface-variant truncate mt-0.5">{repo.description}</p>
                                )}
                              </div>
                            </button>
                          ))
                        }
                        {!repoLoading && !repoError && repoList.length > 0 &&
                          repoList.filter(r => r.full_name.toLowerCase().includes(repoSearch.toLowerCase())).length === 0 && (
                          <p className="px-4 py-6 text-center text-on-surface-variant text-body-sm">No repositories match "{repoSearch}"</p>
                        )}
                      </div>
                    </div>
                  )}

                  {githubRepoError && (
                    <div className="flex items-center gap-2 mt-2 p-3 bg-error-container text-on-error-container rounded-xl text-body-sm">
                      <span className="material-symbols-outlined text-[18px]">error</span>
                      {githubRepoError}
                    </div>
                  )}
                  {githubRepoSaved && (
                    <div className="flex items-center gap-2 mt-2 p-3 bg-tertiary-container text-on-tertiary-container rounded-xl text-body-sm font-bold">
                      <span className="material-symbols-outlined text-[18px]">check_circle</span>
                      Repository saved!
                    </div>
                  )}
                </div>

                {/* Disconnect */}
                <div className="border-t border-outline-variant/30 pt-4">
                  <button
                    onClick={handleDisconnect}
                    className="flex items-center gap-2 px-4 py-2 bg-error/10 text-error hover:bg-error/20 border border-error/20 font-bold rounded-xl transition-all cursor-pointer text-caption"
                  >
                    <span className="material-symbols-outlined text-[18px]">link_off</span>
                    Disconnect GitHub
                  </button>
                </div>
              </div>
            )}
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
