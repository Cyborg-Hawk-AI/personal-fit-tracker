'use client';

import { format } from 'date-fns';
import { StorageManager } from '@/lib/storage/storage-manager';
import { CURRENT_SCHEMA_VERSION } from '@/lib/schema/version';
import type { WorkoutDay, ExerciseLog, SetLog } from '@/lib/schema/types';
import { getProgramDayForDate } from '@/lib/program/workout-program';

function generateId(): string {
  return `wd_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function now(): string {
  return new Date().toISOString();
}

/** Get or create exercise logs for today from program template. */
export function getOrCreateExerciseLogsForDate(date: Date): ExerciseLog[] {
  const program = getProgramDayForDate(date);
  if (!program || !program.exercises.length) return [];
  return program.exercises.map((ex) => ({
    exerciseName: ex.name,
    sets: Array.from({ length: ex.sets }, () => ({ completed: false })),
    targetSets: ex.sets,
    targetReps: ex.reps,
    intensityPercent: ex.intensityPercent,
  }));
}

export function getWorkoutForDate(dateStr: string): WorkoutDay | null {
  const days = StorageManager.getWorkoutDays();
  return days.find((d) => d.date === dateStr) ?? null;
}

export function saveWorkout(workout: WorkoutDay): void {
  const days = StorageManager.getWorkoutDays();
  const index = days.findIndex((d) => d.id === workout.id);
  const updated = [...days];
  if (index >= 0) {
    updated[index] = { ...workout, updatedAt: now() };
  } else {
    updated.push(workout);
  }
  StorageManager.setWorkoutDays(updated);
}

export function createWorkoutForDate(dateStr: string): WorkoutDay {
  const date = new Date(dateStr);
  const program = getProgramDayForDate(date);
  const dayLabel = program?.label ?? 'Rest';
  const exerciseLogs = getOrCreateExerciseLogsForDate(date);
  const workout: WorkoutDay = {
    id: generateId(),
    date: dateStr,
    dayLabel,
    exerciseLogs,
    createdAt: now(),
    updatedAt: now(),
    schemaVersion: CURRENT_SCHEMA_VERSION,
  };
  saveWorkout(workout);
  return workout;
}

export function updateExerciseSet(
  workout: WorkoutDay,
  exerciseIndex: number,
  setIndex: number,
  update: Partial<SetLog>
): WorkoutDay {
  const next = { ...workout, exerciseLogs: [...workout.exerciseLogs] };
  const ex = next.exerciseLogs[exerciseIndex];
  if (!ex) return workout;
  next.exerciseLogs[exerciseIndex] = {
    ...ex,
    sets: ex.sets.map((s, i) =>
      i === setIndex ? { ...s, ...update } : s
    ),
  };
  next.updatedAt = now();
  return next;
}

/** Mark entire exercise as done with default sets/reps (no custom weight/reps). */
export function markExerciseDoneWithDefaults(
  workout: WorkoutDay,
  exerciseIndex: number
): WorkoutDay {
  const next = { ...workout, exerciseLogs: [...workout.exerciseLogs] };
  const ex = next.exerciseLogs[exerciseIndex];
  if (!ex) return workout;
  next.exerciseLogs[exerciseIndex] = {
    ...ex,
    sets: ex.sets.map(() => ({ completed: true })),
  };
  next.updatedAt = now();
  return next;
}

/** Check if all sets of an exercise are completed. */
export function isExerciseFullyCompleted(workout: WorkoutDay, exerciseIndex: number): boolean {
  const ex = workout.exerciseLogs[exerciseIndex];
  return ex?.sets.every((s) => s.completed) ?? false;
}

export function getAllWorkoutDays(): WorkoutDay[] {
  return StorageManager.getWorkoutDays();
}
