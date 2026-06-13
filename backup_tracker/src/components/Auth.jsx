'use client';

import { useState } from 'react';
import { loginUser, registerUser } from '../lib/storage';
import { GraduationCap, Lock, User, UserPlus, Key } from 'lucide-react';

export default function Auth({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!isLogin) {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (password.length < 4) {
        setError('Password must be at least 4 characters long');
        return;
      }
      
      const res = registerUser(username, password);
      if (res.success) {
        onLoginSuccess(res.user);
      } else {
        setError(res.error);
      }
    } else {
      const res = loginUser(username, password);
      if (res.success) {
        onLoginSuccess(res.user);
      } else {
        setError(res.error);
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden px-4">
      {/* Background gradients */}
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary-color/5 blur-3xl"></div>
      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-secondary-color/5 blur-3xl"></div>
      
      <div className="w-full max-w-md glass-panel rounded-2xl p-8 flex flex-col relative z-10 glow-active">
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-color/10 text-primary-color border border-primary-color/20 mb-3">
            <GraduationCap className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Java Study Tracker</h1>
          <p className="text-sm text-muted-text mt-1">
            {isLogin ? 'Sign in to access your course' : 'Create an account to start learning'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-text uppercase tracking-wider block">Username</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-text">
                <User className="h-4 w-4" />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-custom-border bg-black/20 text-foreground placeholder-muted-text focus:outline-none focus:border-primary-color/50 text-sm"
                placeholder="Enter username"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-text uppercase tracking-wider block">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-text">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-custom-border bg-black/20 text-foreground placeholder-muted-text focus:outline-none focus:border-primary-color/50 text-sm"
                placeholder="Enter password"
              />
            </div>
          </div>

          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-text uppercase tracking-wider block">Confirm Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-text">
                  <Key className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-custom-border bg-black/20 text-foreground placeholder-muted-text focus:outline-none focus:border-primary-color/50 text-sm"
                  placeholder="Repeat password"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-primary-color text-white font-medium text-sm hover:bg-primary-hover transition-colors flex items-center justify-center gap-2 mt-2 cursor-pointer shadow-lg shadow-primary-glow"
          >
            {isLogin ? (
              <>
                <User className="h-4 w-4" />
                Sign In
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                Register Account
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setUsername('');
              setPassword('');
              setConfirmPassword('');
            }}
            className="text-xs text-primary-color hover:underline focus:outline-none cursor-pointer"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}
