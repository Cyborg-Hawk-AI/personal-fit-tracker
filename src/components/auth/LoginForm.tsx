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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-surface-200 mb-1">
          Email
        </label>
        <input
          id="username"
          type="email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoComplete="username"
          className="w-full rounded-lg border border-surface-200/20 bg-surface-900 px-4 py-2.5 text-white placeholder-surface-400 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          placeholder="ygbarakat@gmail.com"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-surface-200 mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="w-full rounded-lg border border-surface-200/20 bg-surface-900 px-4 py-2.5 text-white placeholder-surface-400 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
      </div>
      {error && (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
      <button
        type="submit"
        className="w-full rounded-lg bg-accent py-2.5 font-medium text-surface-900 hover:bg-accent-dark transition-colors"
      >
        Sign in
      </button>
    </form>
  );
}
