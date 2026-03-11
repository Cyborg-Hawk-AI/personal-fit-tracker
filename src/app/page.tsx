'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth-store';
import LoginForm from '@/components/auth/LoginForm';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isAuthenticated) router.replace('/dashboard');
  }, [isAuthenticated, router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-surface-900">
      <div className="w-full max-w-sm rounded-xl bg-surface-800 p-8 shadow-xl border border-surface-200/10">
        <h1 className="text-2xl font-bold text-center text-white mb-2">
          Personal Fit Tracker
        </h1>
        <p className="text-surface-200 text-center text-sm mb-6">
          Training · Nutrition · Progress
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
