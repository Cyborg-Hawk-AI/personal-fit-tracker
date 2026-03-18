'use client';

import { useEffect, useState } from 'react';
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

const SIDEBAR_WIDTH = 220;
const SIDEBAR_COLLAPSED = 56;

export default function ProtectedShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, checkAuth, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
    <div className="min-h-screen flex">
      {/* Side panel */}
      <aside
        className="fixed left-0 top-0 z-20 flex h-full flex-col border-r border-white/[0.06] bg-surface-950/95 backdrop-blur-xl transition-[width] duration-200 ease-out"
        style={{ width: sidebarOpen ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED }}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-white/[0.06] px-3">
          {sidebarOpen && (
            <Link href="/dashboard" className="font-bold text-white truncate tracking-tight">
              Fit Tracker
            </Link>
          )}
          <button
            type="button"
            onClick={() => setSidebarOpen((o) => !o)}
            className="rounded-lg p-2 text-surface-400 hover:bg-white/5 hover:text-accent transition-colors"
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {sidebarOpen ? (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                pathname === href
                  ? 'bg-accent/15 text-accent shadow-glow-accent-sm'
                  : 'text-surface-300 hover:bg-white/5 hover:text-white'
              } ${!sidebarOpen ? 'justify-center px-2' : ''}`}
              title={!sidebarOpen ? label : undefined}
            >
              {sidebarOpen ? label : <span className="text-base font-bold text-surface-400">{label.charAt(0)}</span>}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/[0.06] p-2">
          <button
            type="button"
            onClick={() => logout()}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-surface-400 hover:bg-white/5 hover:text-white transition-colors ${!sidebarOpen ? 'justify-center px-2' : ''}`}
            title={!sidebarOpen ? 'Logout' : undefined}
          >
            {sidebarOpen ? 'Logout' : (
              <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            )}
          </button>
        </div>
      </aside>
      {/* Main content */}
      <main
        className="relative z-0 flex-1 flex flex-col min-h-screen transition-[margin] duration-200 ease-out"
        style={{ marginLeft: sidebarOpen ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED }}
      >
        <div className="relative z-0 flex-1 mx-auto w-full max-w-4xl p-4 md:p-6">{children}</div>
      </main>
    </div>
  );
}
