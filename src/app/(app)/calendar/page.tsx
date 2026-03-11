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
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Calendar</h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewDate(subMonths(viewDate, 1))}
            className="rounded-lg border border-surface-200/20 px-3 py-2 text-sm font-medium text-white hover:bg-surface-800"
          >
            ←
          </button>
          <span className="min-w-[180px] text-center font-medium text-white">
            {format(viewDate, 'MMMM yyyy')}
          </span>
          <button
            type="button"
            onClick={() => setViewDate(addMonths(viewDate, 1))}
            className="rounded-lg border border-surface-200/20 px-3 py-2 text-sm font-medium text-white hover:bg-surface-800"
          >
            →
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-surface-200/10 bg-surface-800 overflow-hidden">
        <div className="grid grid-cols-7 text-center text-sm font-medium text-surface-400 border-b border-surface-200/10">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="py-2">
              {day}
            </div>
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
                className={`min-h-[80px] border-b border-r border-surface-200/10 p-1 ${
                  isSameMonth(day, viewDate) ? 'bg-surface-800' : 'bg-surface-900/50'
                }`}
              >
                <Link
                  href={`/workouts?date=${dateStr}`}
                  className={`block rounded p-1 text-sm ${
                    isToday(day) ? 'ring-1 ring-accent' : ''
                  } ${!isSameMonth(day, viewDate) ? 'text-surface-500' : 'text-white'}`}
                >
                  {format(day, 'd')}
                </Link>
                <div className="flex flex-wrap gap-0.5 mt-0.5">
                  {hasWorkout && (
                    <span className="rounded bg-accent/30 px-1 text-xs text-accent">W</span>
                  )}
                  {hasNutrition && (
                    <span className="rounded bg-blue-500/30 px-1 text-xs text-blue-300">N</span>
                  )}
                  {hasNote && (
                    <span className="rounded bg-amber-500/30 px-1 text-xs text-amber-300">Note</span>
                  )}
                  {isSameMonth(day, viewDate) && isRest && !hasWorkout && (
                    <span className="text-surface-500 text-xs">Rest</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-4 text-sm text-surface-400">
        <span><span className="inline-block w-4 h-4 rounded bg-accent/30 mr-1" /> Workout</span>
        <span><span className="inline-block w-4 h-4 rounded bg-blue-500/30 mr-1" /> Nutrition</span>
        <span><span className="inline-block w-4 h-4 rounded bg-amber-500/30 mr-1" /> Note</span>
      </div>
    </div>
  );
}
