'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { format, addDays, subDays } from 'date-fns';
import {
  getWorkoutForDate,
  createWorkoutForDate,
  saveWorkout,
  updateExerciseSet,
} from '@/lib/services/workout-service';
import { getProgramDayForDate } from '@/lib/program/workout-program';
import type { WorkoutDay } from '@/lib/schema/types';

export default function WorkoutsPage() {
  const searchParams = useSearchParams();
  const dateParam = searchParams.get('date');
  const [selectedDate, setSelectedDate] = useState(() =>
    dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam) ? dateParam : format(new Date(), 'yyyy-MM-dd')
  );
  useEffect(() => {
    if (dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam)) setSelectedDate(dateParam);
  }, [dateParam]);
  const [workout, setWorkout] = useState<WorkoutDay | null>(null);
  const [initialized, setInitialized] = useState(false);

  const load = useCallback(() => {
    let w = getWorkoutForDate(selectedDate);
    const program = getProgramDayForDate(new Date(selectedDate));
    if (!w && program?.exercises.length) {
      w = createWorkoutForDate(selectedDate);
    }
    setWorkout(w);
    setInitialized(true);
  }, [selectedDate]);

  useEffect(() => {
    load();
  }, [load]);

  const handlePrev = () => setSelectedDate((d) => format(subDays(new Date(d), 1), 'yyyy-MM-dd'));
  const handleNext = () => setSelectedDate((d) => format(addDays(new Date(d), 1), 'yyyy-MM-dd'));

  const toggleSet = (exIndex: number, setIndex: number) => {
    if (!workout) return;
    const ex = workout.exerciseLogs[exIndex];
    const set = ex?.sets[setIndex];
    if (!set) return;
    const next = updateExerciseSet(workout, exIndex, setIndex, {
      completed: !set.completed,
    });
    saveWorkout(next);
    setWorkout(next);
  };

  const updateSetValues = (exIndex: number, setIndex: number, reps?: number, weight?: number) => {
    if (!workout) return;
    const next = updateExerciseSet(workout, exIndex, setIndex, { reps, weight });
    saveWorkout(next);
    setWorkout(next);
  };

  const programDay = getProgramDayForDate(new Date(selectedDate));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Workout</h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            className="rounded-lg border border-surface-200/20 px-4 py-2 text-sm font-medium text-white hover:bg-surface-800"
          >
            ← Prev
          </button>
          <span className="min-w-[140px] text-center font-medium text-white">
            {format(new Date(selectedDate), 'EEE, MMM d')}
          </span>
          <button
            type="button"
            onClick={handleNext}
            className="rounded-lg border border-surface-200/20 px-4 py-2 text-sm font-medium text-white hover:bg-surface-800"
          >
            Next →
          </button>
        </div>
      </div>

      {!initialized ? (
        <p className="text-surface-400">Loading…</p>
      ) : programDay?.exercises.length === 0 ? (
        <div className="rounded-xl border border-surface-200/10 bg-surface-800 p-8 text-center text-surface-300">
          Rest day — no exercises scheduled.
        </div>
      ) : workout ? (
        <div className="space-y-6">
          <p className="text-surface-300">{workout.dayLabel}</p>
          {workout.exerciseLogs.map((ex, exIndex) => (
            <div
              key={`${ex.exerciseName}-${exIndex}`}
              className="rounded-xl border border-surface-200/10 bg-surface-800 p-4"
            >
              <h2 className="font-semibold text-white mb-3">{ex.exerciseName}</h2>
              <p className="text-sm text-surface-400 mb-3">
                {ex.targetSets}×{ex.targetReps}
                {ex.intensityPercent != null ? ` @ ${ex.intensityPercent}%` : ''}
              </p>
              <div className="space-y-2">
                {ex.sets.map((set, setIndex) => (
                  <div
                    key={setIndex}
                    className="flex flex-wrap items-center gap-3 rounded-lg bg-surface-900/50 px-3 py-2"
                  >
                    <span className="text-surface-400 w-8">Set {setIndex + 1}</span>
                    <input
                      type="number"
                      placeholder="Reps"
                      value={set.reps ?? ''}
                      onChange={(e) =>
                        updateSetValues(
                          exIndex,
                          setIndex,
                          e.target.value === '' ? undefined : Number(e.target.value),
                          set.weight
                        )
                      }
                      className="w-20 rounded border border-surface-200/20 bg-surface-800 px-2 py-1 text-white"
                    />
                    <input
                      type="number"
                      placeholder="Weight"
                      value={set.weight ?? ''}
                      onChange={(e) =>
                        updateSetValues(
                          exIndex,
                          setIndex,
                          set.reps,
                          e.target.value === '' ? undefined : Number(e.target.value)
                        )
                      }
                      className="w-20 rounded border border-surface-200/20 bg-surface-800 px-2 py-1 text-white"
                    />
                    <button
                      type="button"
                      onClick={() => toggleSet(exIndex, setIndex)}
                      className={`rounded-lg px-4 py-1.5 text-sm font-medium ${
                        set.completed
                          ? 'bg-accent text-surface-900'
                          : 'border border-surface-200/20 text-surface-300 hover:bg-surface-700'
                      }`}
                    >
                      {set.completed ? 'Done' : 'Complete'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
