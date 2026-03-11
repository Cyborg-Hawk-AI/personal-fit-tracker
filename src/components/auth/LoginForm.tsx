'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/stores/auth-store';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useAuthStore((s) => s.login);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const ok = login(username.trim(), password);
    if (!ok) setError('Invalid username or password.');
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-surface-300 mb-2">
          Email
        </label>
        <input
          id="username"
          type="email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoComplete="username"
          className="w-full rounded-xl border border-white/10 bg-surface-800/80 px-4 py-3 text-white placeholder-surface-400 transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          placeholder="ygbarakat@gmail.com"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-surface-300 mb-2">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="w-full rounded-xl border border-white/10 bg-surface-800/80 px-4 py-3 text-white placeholder-surface-400 transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        />
      </div>
      {error && (
        <p className="text-sm text-red-400/90 rounded-lg bg-red-500/10 px-3 py-2" role="alert">
          {error}
        </p>
      )}
      <button
        type="submit"
        className="btn-primary w-full py-3 text-base"
      >
        Sign in
      </button>
    </form>
  );
}
