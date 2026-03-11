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
    <main className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background gradient + grid */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#08090c] via-[#0c0e14] to-[#060708]" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />
      <div className="absolute top-1/4 left-1/2 w-[600px] h-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/5 blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-md">
        <div className="rounded-card-lg border border-white/[0.08] bg-surface-900/90 p-8 shadow-card backdrop-blur-xl animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Personal Fit Tracker
            </h1>
            <p className="mt-2 text-surface-300 text-sm">
              Training · Nutrition · Progress
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
