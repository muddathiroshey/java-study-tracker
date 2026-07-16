'use client';

import { useState, useEffect } from 'react';
import { PROJECTS_LIST, COVER_SHEET_CHECKLIST, COVER_SHEET_NOTES, TOTAL_POINTS } from '../lib/projectsData';
import { getProjectAssignment, assignProject, bulkAssignProjects, getDB } from '../lib/storage';

// ── Gradient palettes per project ID (1-13) ──────────────────────────────────
const PROJECT_GRADIENTS = {
  1:  'from-indigo-600 via-violet-600 to-purple-700',
  2:  'from-sky-500 via-blue-600 to-cyan-700',
  3:  'from-emerald-500 via-green-600 to-teal-700',
  4:  'from-amber-500 via-yellow-500 to-orange-600',
  5:  'from-violet-600 via-purple-600 to-indigo-700',
  6:  'from-red-600 via-rose-600 to-pink-700',
  7:  'from-orange-500 via-amber-500 to-yellow-600',
  8:  'from-pink-500 via-rose-500 to-red-600',
  9:  'from-teal-500 via-cyan-500 to-blue-600',
  10: 'from-cyan-500 via-sky-500 to-blue-600',
  11: 'from-yellow-500 via-amber-500 to-orange-600',
  12: 'from-purple-600 via-violet-500 to-indigo-600',
  13: 'from-teal-700 via-emerald-600 to-green-700',
};

export default function ProjectView({ user }) {
  const isAdmin = user?.isAdmin === true;

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [project, setProject] = useState(null);

  // Admin: list of all students with their project assignments
  const [allUsers, setAllUsers]   = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [assigningTo, setAssigningTo]   = useState(null);
  const [newProjectNum, setNewProjectNum] = useState('');
  const [assignMsg, setAssignMsg]         = useState('');
  const [bulkLoading, setBulkLoading]     = useState(false);
  const [bulkMsg, setBulkMsg]             = useState('');

  // ── Fetch current user's project (or all users for admin) ──────────────────
  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await getProjectAssignment(selectedUser || null);
      setResult(res);
      if (res?.success && !res.locked && res.projectNumber) {
        setProject(PROJECTS_LIST.find(p => p.id === res.projectNumber) || null);
      } else {
        setProject(null);
      }
      if (isAdmin && allUsers.length === 0) {
        const db = await getDB();
        setAllUsers(db.users.filter(u => !u.isAdmin));
      }
      setLoading(false);
    }
    load();
  }, [selectedUser]);

  // ── Admin: reassign project ─────────────────────────────────────────────────
  const handleAssign = async (username) => {
    if (!newProjectNum) return;
    const res = await assignProject(username, parseInt(newProjectNum));
    if (res.success) {
      setAssignMsg(`✓ Project ${newProjectNum} assigned to ${username}`);
      // Refresh the view
      const db = await getDB();
      setAllUsers(db.users.filter(u => !u.isAdmin));
      setAssigningTo(null);
      setNewProjectNum('');
      setTimeout(() => setAssignMsg(''), 3000);
    } else {
      setAssignMsg(`Error: ${res.error}`);
    }
  };

  const handleBulkAssign = async () => {
    setBulkLoading(true);
    const res = await bulkAssignProjects();
    if (res.success) {
      setBulkMsg(`✓ Assigned projects to ${res.assignedCount} unassigned students`);
      const db = await getDB();
      setAllUsers(db.users.filter(u => !u.isAdmin));
    } else {
      setBulkMsg(`Error: ${res.error}`);
    }
    setBulkLoading(false);
    setTimeout(() => setBulkMsg(''), 4000);
  };

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex-grow overflow-y-auto pt-24 pb-12 px-4 md:px-8 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center animate-pulse shadow-xl">
            <span className="material-symbols-outlined text-on-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>assignment</span>
          </div>
          <p className="text-on-surface-variant font-bold">Loading project assignment…</p>
        </div>
      </div>
    );
  }

  const gradient = project ? PROJECT_GRADIENTS[project.id] : PROJECT_GRADIENTS[1];

  // ═══════════════════════════════════════════════════════════════════════════
  // ADMIN VIEW
  // ═══════════════════════════════════════════════════════════════════════════
  if (isAdmin) {
    return (
      <div className="flex-grow overflow-y-auto pt-24 pb-12 px-4 md:px-8 min-h-screen">
        <main className="max-w-6xl mx-auto w-full space-y-8">

          {/* Header */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md bg-gradient-to-br from-indigo-500 to-violet-600">
                <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>assignment</span>
              </div>
              <div>
                <h1 className="text-display-lg font-headline-lg font-black text-on-background">
                  Final Project Assignments
                </h1>
                <p className="text-body-sm text-on-surface-variant mt-0.5">
                  View and manage project assignments for all students — Dr. Mohammed El-Said
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <button
                onClick={handleBulkAssign}
                disabled={bulkLoading}
                className="px-4 py-2 bg-primary text-on-primary rounded-xl font-bold text-caption flex items-center gap-2 cursor-pointer hover:opacity-90 transition-all shadow-md disabled:opacity-60"
              >
                <span className="material-symbols-outlined text-xl">shuffle</span>
                {bulkLoading ? 'Assigning…' : 'Auto-Assign Missing Projects'}
              </button>
              {bulkMsg && (
                <span className="text-caption font-bold text-tertiary">{bulkMsg}</span>
              )}
              {assignMsg && (
                <span className="text-caption font-bold text-tertiary">{assignMsg}</span>
              )}
            </div>
          </header>

          {/* Admin: view selected student's project details */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-on-surface text-title-md mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">person_search</span>
              Preview Any Student's Project
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <select
                value={selectedUser}
                onChange={e => { setSelectedUser(e.target.value); setProject(null); }}
                className="px-3 py-2.5 bg-surface-container border border-outline-variant rounded-xl text-on-surface text-body-sm focus:outline-none focus:border-primary font-semibold w-full sm:w-72"
              >
                <option value="">— Select a student —</option>
                {allUsers.map(u => (
                  <option key={u.username} value={u.username}>
                    {u.username} → Project #{u.settings?.assignedProject ?? 'Unassigned'}
                  </option>
                ))}
              </select>
              {selectedUser && result?.success && !result.locked && project && (
                <div className="flex items-center gap-2 px-4 py-2 bg-secondary-container text-on-secondary-container rounded-xl font-bold text-caption">
                  <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>{project.icon}</span>
                  {project.title}
                </div>
              )}
            </div>
          </div>

          {/* Project details for selected student */}
          {selectedUser && project && (
            <ProjectCard project={project} gradient={gradient} isAdmin={true} />
          )}
          {selectedUser && result?.success && !project && (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 text-center text-on-surface-variant shadow-sm">
              <span className="material-symbols-outlined text-4xl text-outline mb-3 block">assignment_late</span>
              <p className="font-bold text-on-surface">No project assigned to this student yet.</p>
              <p className="text-caption mt-1">Use the reassign button in the table below, or click Auto-Assign.</p>
            </div>
          )}

          {/* Students Table */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant border-b border-outline-variant text-caption font-bold uppercase">
                    <th className="py-3 px-5">#</th>
                    <th className="py-3 px-5">Student</th>
                    <th className="py-3 px-5">Assigned Project</th>
                    <th className="py-3 px-5">Project Name</th>
                    <th className="py-3 px-5 text-right">Reassign</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/50 text-caption font-semibold">
                  {allUsers.length === 0 && (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-on-surface-variant italic">
                        No student accounts found.
                      </td>
                    </tr>
                  )}
                  {allUsers.map((u, i) => {
                    const pNum = u.settings?.assignedProject ?? null;
                    const pInfo = pNum ? PROJECTS_LIST.find(p => p.id === pNum) : null;
                    const isReassigning = assigningTo === u.username;
                    return (
                      <tr key={u.username} className="hover:bg-surface-container transition-colors align-middle">
                        <td className="py-3 px-5 text-on-surface-variant">{i + 1}</td>
                        <td className="py-3 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-xs shrink-0">
                              {u.username[0].toUpperCase()}
                            </div>
                            <span className="font-bold text-on-surface">{u.username}</span>
                          </div>
                        </td>
                        <td className="py-3 px-5">
                          {pNum ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary font-black text-[11px]">
                              <span className="material-symbols-outlined text-[14px]">tag</span>
                              Project {pNum}
                            </span>
                          ) : (
                            <span className="text-outline italic text-[11px]">Unassigned</span>
                          )}
                        </td>
                        <td className="py-3 px-5 text-on-surface max-w-[240px]">
                          {pInfo ? (
                            <span className="flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-[14px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>{pInfo.icon}</span>
                              <span className="truncate">{pInfo.title}</span>
                            </span>
                          ) : (
                            <span className="text-outline italic">—</span>
                          )}
                        </td>
                        <td className="py-3 px-5 text-right">
                          {isReassigning ? (
                            <div className="flex items-center gap-2 justify-end">
                              <select
                                value={newProjectNum}
                                onChange={e => setNewProjectNum(e.target.value)}
                                className="px-2 py-1 bg-surface-container border border-outline-variant rounded-lg text-on-surface text-[11px] font-semibold focus:outline-none focus:border-primary"
                              >
                                <option value="">Pick project…</option>
                                {PROJECTS_LIST.map(p => (
                                  <option key={p.id} value={p.id}>
                                    #{p.id} — {p.title.length > 28 ? p.title.slice(0, 28) + '…' : p.title}
                                  </option>
                                ))}
                              </select>
                              <button
                                onClick={() => handleAssign(u.username)}
                                disabled={!newProjectNum}
                                className="px-2 py-1 bg-primary text-on-primary rounded-lg text-[11px] font-bold cursor-pointer disabled:opacity-50"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => { setAssigningTo(null); setNewProjectNum(''); }}
                                className="px-2 py-1 bg-surface-container border border-outline-variant text-on-surface-variant rounded-lg text-[11px] font-bold cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => { setAssigningTo(u.username); setNewProjectNum(pNum ? String(pNum) : ''); }}
                              className="px-3 py-1 border border-outline-variant text-on-surface-variant hover:text-primary hover:border-primary rounded-lg text-[11px] font-bold cursor-pointer transition-colors flex items-center gap-1 ml-auto"
                            >
                              <span className="material-symbols-outlined text-[13px]">swap_horiz</span>
                              Reassign
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cover Sheet Checklist Info */}
          <CoverSheetSection />
        </main>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // STUDENT VIEW — LOCKED
  // ═══════════════════════════════════════════════════════════════════════════
  if (result?.locked) {
    const { videosCompleted = 0, totalVideos = 1 } = result;
    const pct = Math.min(100, Math.round((videosCompleted / totalVideos) * 100));

    return (
      <div className="flex-grow overflow-y-auto pt-24 pb-12 px-4 md:px-8 min-h-screen">
        <main className="max-w-2xl mx-auto w-full">

          {/* Locked Hero Card */}
          <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10 p-8 text-center mb-8">
            {/* Glowing backdrop */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-violet-600/20 rounded-full blur-3xl" />
            </div>

            {/* Lock icon */}
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-600/20 border border-indigo-500/30 flex items-center justify-center backdrop-blur-sm">
                <span
                  className="material-symbols-outlined text-5xl text-indigo-300"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  lock
                </span>
              </div>
            </div>

            <h1 className="text-2xl font-black text-white mb-3 relative">
              Your Final Project is Locked
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed relative max-w-[480px] mx-auto mb-8">
              Complete <strong className="text-white">all course videos</strong> to unlock your randomly assigned final project.
              Keep studying — you're almost there!
            </p>

            {/* Progress ring area */}
            <div className="relative bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm mx-auto max-w-[380px]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-300 text-sm font-bold">Videos Watched</span>
                <span className="text-indigo-300 font-black text-lg">{videosCompleted} / {totalVideos}</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-3 mb-3 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                <span>{pct}% complete</span>
                <span>{totalVideos - videosCompleted} videos remaining</span>
              </div>
            </div>

            {/* Motivation */}
            <div className="mt-6 relative">
              <p className="text-xs text-slate-500 font-medium">
                🔒 Your project is already randomly assigned and waiting — finish the course to reveal it!
              </p>
            </div>
          </div>

          {/* Preview: what to expect */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-on-surface text-title-md mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">preview</span>
              What Awaits You
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PROJECTS_LIST.slice(0, 4).map(p => (
                <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl border border-outline-variant/50 bg-surface-container">
                  <span className="material-symbols-outlined text-outline text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>{p.icon}</span>
                  <span className="text-caption font-semibold text-on-surface-variant line-clamp-1">{p.title}</span>
                </div>
              ))}
            </div>
            <p className="text-caption text-on-surface-variant mt-4 text-center italic">
              …and {PROJECTS_LIST.length - 4} more possible projects. Which one will you get? 🎲
            </p>
          </div>
        </main>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // STUDENT VIEW — UNLOCKED
  // ═══════════════════════════════════════════════════════════════════════════
  if (result?.success && !result.locked && project) {
    return (
      <div className="flex-grow overflow-y-auto pt-24 pb-12 px-4 md:px-8 min-h-screen">
        <main className="max-w-4xl mx-auto w-full space-y-8">

          {/* Congrats banner */}
          <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-green-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-center gap-4">
            <span className="material-symbols-outlined text-3xl text-emerald-500" style={{ fontVariationSettings: "'FILL' 1" }}>celebration</span>
            <div>
              <p className="font-black text-on-surface">🎉 Course Complete — Project Revealed!</p>
              <p className="text-caption text-on-surface-variant">You've unlocked your final project assignment. Good luck building it!</p>
            </div>
          </div>

          <ProjectCard project={project} gradient={gradient} isAdmin={false} />
          <CoverSheetSection />
        </main>
      </div>
    );
  }

  // Error / no assignment
  return (
    <div className="flex-grow overflow-y-auto pt-24 pb-12 px-4 md:px-8 min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <span className="material-symbols-outlined text-5xl text-outline block">assignment_late</span>
        <p className="font-bold text-on-surface">No project assigned yet.</p>
        <p className="text-caption text-on-surface-variant">Contact your instructor or ask an admin to assign your project.</p>
      </div>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function ProjectCard({ project, gradient, isAdmin }) {
  const [openModule, setOpenModule] = useState(null);

  return (
    <div className="space-y-6">
      {/* Hero banner */}
      <div className={`relative bg-gradient-to-br ${gradient} rounded-3xl overflow-hidden shadow-2xl`}>
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-white rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative p-8 md:p-10">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
              <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                {project.icon}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-3 py-0.5 bg-white/20 backdrop-blur-sm border border-white/20 rounded-full text-white font-black text-[11px] uppercase tracking-wider">
                  Final Project #{project.id}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white leading-tight mt-2">
                {project.title}
              </h1>
              <p className="text-white/80 text-sm mt-2 leading-relaxed">
                {project.tagline}
              </p>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-4 text-white/70 text-caption font-semibold">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">layers</span>
              {project.modules.length} Modules
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">task_alt</span>
              Dr. Mohammed El-Said
            </span>
            {isAdmin && (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-white/20 rounded-full">
                <span className="material-symbols-outlined text-[15px]">admin_panel_settings</span>
                Admin View
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Modules accordion */}
      <div className="space-y-3">
        <h2 className="font-black text-on-surface text-title-md flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">account_tree</span>
          System Modules
        </h2>
        {project.modules.map((mod, idx) => {
          const isOpen = openModule === idx;
          return (
            <div key={idx} className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm transition-all duration-200">
              <button
                onClick={() => setOpenModule(isOpen ? null : idx)}
                className="w-full flex items-center justify-between px-6 py-4 text-left cursor-pointer hover:bg-surface-container-low transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-xs shrink-0">
                    {idx + 1}
                  </span>
                  <span className="font-bold text-on-surface text-body-md">{mod.name}</span>
                  <span className="text-[10px] text-on-surface-variant font-semibold bg-surface-container px-2 py-0.5 rounded-full border border-outline-variant/50">
                    {mod.items.length} features
                  </span>
                </div>
                <span
                  className={`material-symbols-outlined text-primary transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                >
                  expand_more
                </span>
              </button>
              {isOpen && (
                <div className="px-6 pb-5 border-t border-outline-variant/40">
                  <ul className="mt-4 space-y-2.5">
                    {mod.items.map((item, ii) => (
                      <li key={ii} className="flex items-start gap-3">
                        <span
                          className="material-symbols-outlined text-primary text-[18px] mt-0.5 shrink-0"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          check_circle
                        </span>
                        <span className="text-body-sm text-on-surface leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CoverSheetSection() {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-low">
        <h2 className="font-black text-on-surface text-title-md flex items-center gap-2">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>grading</span>
          Cover Sheet Evaluation Checklist
        </h2>
        <p className="text-caption text-on-surface-variant mt-0.5">
          All projects are evaluated using these criteria — Programming 2, Dr. Mohammed El-Said
        </p>
      </div>

      <div className="divide-y divide-outline-variant/50">
        {COVER_SHEET_CHECKLIST.map(item => (
          <div key={item.id} className="flex items-center gap-4 px-6 py-4 hover:bg-surface-container/50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-on-surface text-body-sm">{item.label}</p>
              <p className="text-caption text-on-surface-variant mt-0.5 leading-relaxed">{item.description}</p>
            </div>
            <div className="shrink-0 text-right">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full font-black text-[11px]">
                {item.points} pts
              </span>
            </div>
          </div>
        ))}

        {/* Notes */}
        <div className="px-6 py-4 bg-amber-500/5 border-t border-amber-500/20">
          <p className="font-bold text-amber-700 dark:text-amber-400 text-caption mb-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
            Important Notes
          </p>
          <ul className="space-y-1">
            {COVER_SHEET_CHECKLIST && COVER_SHEET_NOTES.map((note, i) => (
              <li key={i} className="flex items-start gap-2 text-caption text-on-surface-variant">
                <span className="material-symbols-outlined text-[14px] text-amber-600 mt-0.5 shrink-0">priority_high</span>
                {note}
              </li>
            ))}
          </ul>
        </div>

        {/* Total */}
        <div className="px-6 py-4 bg-primary/5 flex justify-between items-center">
          <span className="font-black text-on-surface text-body-md">Total Graded Points</span>
          <span className="px-4 py-1.5 bg-primary text-on-primary rounded-xl font-black text-body-md shadow-md">
            {TOTAL_POINTS} / 12 pts
          </span>
        </div>
      </div>
    </div>
  );
}
