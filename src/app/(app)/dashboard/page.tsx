'use client';

import { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { format, isToday } from 'date-fns';
import { StorageManager } from '@/lib/storage/storage-manager';
import { getProgramDayForDate } from '@/lib/program/workout-program';

export default function DashboardPage() {
  const today = useMemo(() => new Date(), []);
  const todayStr = format(today, 'yyyy-MM-dd');
  const programDay = getProgramDayForDate(today);

  const [workoutDays, nutritionLogs, progressMetrics] = [
    StorageManager.getWorkoutDays(),
    StorageManager.getNutritionLogs(),
    StorageManager.getProgressMetrics(),
  ];

  const todayWorkout = workoutDays.find((w) => w.date === todayStr);
  const todayNutrition = nutritionLogs.find((n) => n.date === todayStr);
  const latestWeight = useMemo(() => {
    const sorted = [...progressMetrics].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return sorted.find((m) => m.bodyweightKg != null)?.bodyweightKg;
  }, [progressMetrics]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">
          {isToday(today) ? "Today's overview" : format(today, 'EEEE, MMM d')}
        </h1>
        <p className="text-surface-300 mt-1">
          {programDay?.label ?? 'Rest day'} · {todayStr}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/workouts"
          className="rounded-xl border border-surface-200/10 bg-surface-800 p-5 transition hover:border-accent/30"
        >
          <h2 className="font-semibold text-white">Workout</h2>
          <p className="mt-1 text-sm text-surface-300">
            {todayWorkout ? 'Logged' : programDay?.exercises.length ? 'Not logged' : 'Rest day'}
          </p>
          <span className="mt-2 inline-block text-sm text-accent">View →</span>
        </Link>

        <Link
          href="/nutrition"
          className="rounded-xl border border-surface-200/10 bg-surface-800 p-5 transition hover:border-accent/30"
        >
          <h2 className="font-semibold text-white">Nutrition</h2>
          <p className="mt-1 text-sm text-surface-300">
            {todayNutrition ? (todayNutrition.compliant ? 'Compliant' : 'Logged') : 'Not logged'}
          </p>
          <span className="mt-2 inline-block text-sm text-accent">View →</span>
        </Link>

        <Link
          href="/analytics"
          className="rounded-xl border border-surface-200/10 bg-surface-800 p-5 transition hover:border-accent/30"
        >
          <h2 className="font-semibold text-white">Bodyweight</h2>
          <p className="mt-1 text-sm text-surface-300">
            {latestWeight != null ? `${latestWeight} kg` : 'No data'}
          </p>
          <span className="mt-2 inline-block text-sm text-accent">Analytics →</span>
        </Link>

        <Link
          href="/media"
          className="rounded-xl border border-surface-200/10 bg-surface-800 p-5 transition hover:border-accent/30"
        >
          <h2 className="font-semibold text-white">Progress media</h2>
          <p className="mt-1 text-sm text-surface-300">Photos & videos</p>
          <span className="mt-2 inline-block text-sm text-accent">Timeline →</span>
        </Link>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">Quick actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/workouts"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-surface-900 hover:bg-accent-dark"
          >
            Log workout
          </Link>
          <Link
            href="/nutrition"
            className="rounded-lg border border-surface-200/20 px-4 py-2 text-sm font-medium text-white hover:bg-surface-800"
          >
            Log nutrition
          </Link>
          <Link
            href="/notes"
            className="rounded-lg border border-surface-200/20 px-4 py-2 text-sm font-medium text-white hover:bg-surface-800"
          >
            Daily note
          </Link>
        </div>
      </section>
    </div>
  );
}
