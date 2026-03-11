'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns';
import { StorageManager } from '@/lib/storage/storage-manager';
import { getProgramDayForDate } from '@/lib/program/workout-program';

export default function CalendarPage() {
  const [viewDate, setViewDate] = useState(() => new Date());

  const { days, workoutDates, nutritionDates, noteDates } = useMemo(() => {
    const workouts = StorageManager.getWorkoutDays();
    const nutrition = StorageManager.getNutritionLogs();
    const notes = StorageManager.getDailyNotes();
    const workoutDates = new Set(workouts.map((w) => w.date));
    const nutritionDates = new Set(nutrition.map((n) => n.date));
    const noteDates = new Set(notes.map((n) => n.date));

    const monthStart = startOfMonth(viewDate);
    const monthEnd = endOfMonth(viewDate);
    const calStart = startOfWeek(monthStart);
    const calEnd = endOfWeek(monthEnd);
    const days: Date[] = [];
    let d = calStart;
    while (d <= calEnd) {
      days.push(d);
      d = addDays(d, 1);
    }
    return { days, workoutDates, nutritionDates, noteDates };
  }, [viewDate]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-white">Calendar</h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewDate(subMonths(viewDate, 1))}
            className="btn-ghost py-2 px-3"
          >
            ←
          </button>
          <span className="min-w-[180px] text-center font-medium text-white">
            {format(viewDate, 'MMMM yyyy')}
          </span>
          <button
            type="button"
            onClick={() => setViewDate(addMonths(viewDate, 1))}
            className="btn-ghost py-2 px-3"
          >
            →
          </button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="grid grid-cols-7 text-center text-sm font-medium text-surface-400 border-b border-white/[0.06]">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="py-3">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((day) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const hasWorkout = workoutDates.has(dateStr);
            const hasNutrition = nutritionDates.has(dateStr);
            const hasNote = noteDates.has(dateStr);
            const program = getProgramDayForDate(day);
            const isRest = program?.exercises.length === 0;
            return (
              <div
                key={dateStr}
                className={`min-h-[80px] border-b border-r border-white/[0.06] p-1.5 last:border-r-0 ${
                  isSameMonth(day, viewDate) ? 'bg-surface-800/50' : 'bg-surface-900/30'
                }`}
              >
                <Link
                  href={`/workouts?date=${dateStr}`}
                  className={`block rounded-lg p-1.5 text-sm transition-colors hover:bg-white/5 ${
                    isToday(day) ? 'ring-1 ring-accent bg-accent/10 text-accent font-semibold' : ''
                  } ${!isSameMonth(day, viewDate) ? 'text-surface-500' : 'text-white'}`}
                >
                  {format(day, 'd')}
                </Link>
                <div className="flex flex-wrap gap-1 mt-1">
                  {hasWorkout && (
                    <span className="rounded-md bg-accent/25 px-1.5 py-0.5 text-[10px] font-medium text-accent">W</span>
                  )}
                  {hasNutrition && (
                    <span className="rounded-md bg-blue-500/25 px-1.5 py-0.5 text-[10px] font-medium text-blue-300">N</span>
                  )}
                  {hasNote && (
                    <span className="rounded-md bg-amber-500/25 px-1.5 py-0.5 text-[10px] font-medium text-amber-300">Note</span>
                  )}
                  {isSameMonth(day, viewDate) && isRest && !hasWorkout && (
                    <span className="text-surface-500 text-[10px]">Rest</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-6 text-sm text-surface-400">
        <span className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-accent/30" /> Workout</span>
        <span className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-blue-500/30" /> Nutrition</span>
        <span className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-amber-500/30" /> Note</span>
      </div>
    </div>
  );
}
