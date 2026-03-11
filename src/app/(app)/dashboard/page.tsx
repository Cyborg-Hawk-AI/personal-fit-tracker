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
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          {isToday(today) ? "Today's overview" : format(today, 'EEEE, MMM d')}
        </h1>
        <p className="text-surface-400 mt-1 text-sm">
          {programDay?.label ?? 'Rest day'} · {todayStr}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/workouts"
          className="card card-hover p-5 block group"
        >
          <h2 className="font-semibold text-white">Workout</h2>
          <p className="mt-1 text-sm text-surface-400">
            {todayWorkout ? 'Logged' : programDay?.exercises.length ? 'Not logged' : 'Rest day'}
          </p>
          <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent opacity-90 group-hover:opacity-100">
            View <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </span>
        </Link>

        <Link
          href="/nutrition"
          className="card card-hover p-5 block group"
        >
          <h2 className="font-semibold text-white">Nutrition</h2>
          <p className="mt-1 text-sm text-surface-400">
            {todayNutrition ? (todayNutrition.compliant ? 'Compliant' : 'Logged') : 'Not logged'}
          </p>
          <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent opacity-90 group-hover:opacity-100">
            View <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </span>
        </Link>

        <Link
          href="/analytics"
          className="card card-hover p-5 block group"
        >
          <h2 className="font-semibold text-white">Bodyweight</h2>
          <p className="mt-1 text-sm text-surface-400">
            {latestWeight != null ? `${latestWeight} kg` : 'No data'}
          </p>
          <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent opacity-90 group-hover:opacity-100">
            Analytics <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </span>
        </Link>

        <Link
          href="/media"
          className="card card-hover p-5 block group"
        >
          <h2 className="font-semibold text-white">Progress media</h2>
          <p className="mt-1 text-sm text-surface-400">Photos & videos</p>
          <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent opacity-90 group-hover:opacity-100">
            Timeline <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </span>
        </Link>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">Quick actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/workouts" className="btn-primary">
            Log workout
          </Link>
          <Link href="/nutrition" className="btn-ghost">
            Log nutrition
          </Link>
          <Link href="/notes" className="btn-ghost">
            Daily note
          </Link>
        </div>
      </section>
    </div>
  );
}
