/**
 * Hardcoded weekly training schedule.
 * Day of week: 0 = Sunday, 1 = Monday, ... 6 = Saturday
 */
import type { ProgramDayTemplate } from '@/lib/schema/types';

export const WEEKLY_PROGRAM: ProgramDayTemplate[] = [
  {
    dayOfWeek: 0, // Sunday — Shoulders + Chest Pump
    label: 'Shoulders + Chest Pump',
    exercises: [
      { name: 'Leaning Lateral Raise', sets: 6, reps: 15, intensityPercent: 60 },
      { name: 'Incline Dumbbell Press', sets: 4, reps: 10, intensityPercent: 70 },
      { name: 'Rear Delt Fly', sets: 4, reps: 15, intensityPercent: 60 },
      { name: 'Resistance Band Chest Fly', sets: 3, reps: 15, intensityPercent: 60 },
    ],
  },
  {
    dayOfWeek: 1, // Monday — Arms + Shoulder Pump
    label: 'Arms + Shoulder Pump',
    exercises: [
      { name: 'Dumbbell Curl', sets: 4, reps: 12, intensityPercent: 65 },
      { name: 'Hammer Curl', sets: 4, reps: 12, intensityPercent: 65 },
      { name: 'Overhead Dumbbell Triceps Extension', sets: 4, reps: 12, intensityPercent: 65 },
      { name: 'Resistance Band Triceps Pushdown', sets: 3, reps: 15, intensityPercent: 60 },
      { name: 'Lateral Raise', sets: 4, reps: 15, intensityPercent: 60 },
    ],
  },
  {
    dayOfWeek: 2, // Tuesday — (not in spec; treat as rest or optional)
    label: 'Rest',
    exercises: [],
  },
  {
    dayOfWeek: 3, // Wednesday — Chest
    label: 'Chest',
    exercises: [
      { name: 'Incline Dumbbell Press', sets: 4, reps: 10, intensityPercent: 70 },
      { name: 'Dumbbell Squeeze Press', sets: 4, reps: 12, intensityPercent: 65 },
      { name: 'Resistance Band Chest Fly', sets: 4, reps: 15, intensityPercent: 60 },
      { name: 'Dumbbell Pullover', sets: 4, reps: 12, intensityPercent: 65 },
    ],
  },
  {
    dayOfWeek: 4, // Thursday — Shoulders + Triceps
    label: 'Shoulders + Triceps',
    exercises: [
      { name: 'Seated Dumbbell Shoulder Press', sets: 4, reps: 10, intensityPercent: 70 },
      { name: 'Leaning Lateral Raise', sets: 6, reps: 15, intensityPercent: 60 },
      { name: 'Rear Delt Dumbbell Fly', sets: 4, reps: 15, intensityPercent: 60 },
      { name: 'Overhead Dumbbell Triceps Extension', sets: 4, reps: 12, intensityPercent: 65 },
    ],
  },
  {
    dayOfWeek: 5, // Friday — Rest
    label: 'Rest',
    exercises: [],
  },
  {
    dayOfWeek: 6, // Saturday — Back + Biceps
    label: 'Back + Biceps',
    exercises: [
      { name: 'Pull-ups', sets: 5, reps: 'Max', intensityPercent: undefined },
      { name: 'Single Arm Dumbbell Row', sets: 4, reps: 12, intensityPercent: 70 },
      { name: 'Resistance Band Straight Arm Pulldown', sets: 4, reps: 15, intensityPercent: 60 },
      { name: 'Dumbbell Curl', sets: 4, reps: 12, intensityPercent: 65 },
      { name: 'Hammer Curl', sets: 3, reps: 12, intensityPercent: 65 },
    ],
  },
];

export function getProgramDay(dayOfWeek: number): ProgramDayTemplate | undefined {
  return WEEKLY_PROGRAM.find((d) => d.dayOfWeek === dayOfWeek);
}

export function getProgramDayForDate(date: Date): ProgramDayTemplate | undefined {
  return getProgramDay(date.getDay());
}
