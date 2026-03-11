'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/stores/auth-store';

const NAV_LINKS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/workouts', label: 'Workouts' },
  { href: '/nutrition', label: 'Nutrition' },
  { href: '/notes', label: 'Notes' },
  { href: '/calendar', label: 'Calendar' },
  { href: '/analytics', label: 'Analytics' },
  { href: '/media', label: 'Media' },
  { href: '/backup', label: 'Backup' },
];

export default function ProtectedShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, checkAuth, logout } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isAuthenticated && pathname !== '/') {
      router.replace('/');
    }
  }, [isAuthenticated, pathname, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 border-b border-surface-200/10 bg-surface-900/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link href="/dashboard" className="font-semibold text-white">
            Fit Tracker
          </Link>
          <nav className="flex items-center gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === href
                    ? 'bg-accent/20 text-accent'
                    : 'text-surface-200 hover:bg-surface-800 hover:text-white'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => logout()}
            className="rounded-md px-3 py-2 text-sm text-surface-300 hover:text-white hover:bg-surface-800"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="flex-1 mx-auto w-full max-w-6xl p-4 md:p-6">{children}</main>
    </div>
  );
}
