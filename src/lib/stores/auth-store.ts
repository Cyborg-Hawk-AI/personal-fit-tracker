'use client';

import { create } from 'zustand';
import { AUTH_CREDENTIALS, SESSION_DURATION_MS } from '@/lib/auth/config';
import { StorageManager } from '@/lib/storage/storage-manager';

function generateToken(): string {
  return `fit_${Date.now()}_${Math.random().toString(36).slice(2, 15)}`;
}

interface AuthState {
  isAuthenticated: boolean;
  email: string | null;
  checkAuth: () => void;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  email: null,

  checkAuth() {
    if (typeof window === 'undefined') return;
    const session = StorageManager.getSession();
    if (!session || session.email !== AUTH_CREDENTIALS.username) {
      set({ isAuthenticated: false, email: null });
      return;
    }
    const expiresAt = new Date(session.expiresAt).getTime();
    if (Date.now() >= expiresAt) {
      StorageManager.clearSession();
      set({ isAuthenticated: false, email: null });
      return;
    }
    set({ isAuthenticated: true, email: session.email });
  },

  login(username: string, password: string) {
    const ok =
      username === AUTH_CREDENTIALS.username && password === AUTH_CREDENTIALS.password;
    if (!ok) return false;
    const expiresAt = new Date(Date.now() + SESSION_DURATION_MS).toISOString();
    StorageManager.setSession({
      token: generateToken(),
      email: AUTH_CREDENTIALS.username,
      expiresAt,
    });
    set({ isAuthenticated: true, email: AUTH_CREDENTIALS.username });
    return true;
  },

  logout() {
    StorageManager.clearSession();
    set({ isAuthenticated: false, email: null });
  },
}));
