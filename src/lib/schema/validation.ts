import { z } from 'zod';
import { CURRENT_SCHEMA_VERSION } from './version';

const setLogSchema = z.object({
  reps: z.number().optional(),
  weight: z.number().optional(),
  completed: z.boolean(),
});

const exerciseLogSchema = z.object({
  exerciseName: z.string(),
  sets: z.array(setLogSchema),
  targetSets: z.number(),
  targetReps: z.union([z.number(), z.literal('Max')]),
  intensityPercent: z.number().optional(),
  notes: z.string().optional(),
});

export const workoutDaySchema = z.object({
  id: z.string(),
  date: z.string(),
  dayLabel: z.string(),
  exerciseLogs: z.array(exerciseLogSchema),
  notes: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  schemaVersion: z.number().min(1).max(CURRENT_SCHEMA_VERSION),
});

export const nutritionLogSchema = z.object({
  id: z.string(),
  date: z.string(),
  meals: z.array(z.object({ name: z.string(), compliant: z.boolean() })),
  supplements: z.array(z.object({ name: z.string(), taken: z.boolean() })),
  compliant: z.boolean().optional(),
  notes: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  schemaVersion: z.number().min(1).max(CURRENT_SCHEMA_VERSION),
});

export const dailyNoteSchema = z.object({
  id: z.string(),
  date: z.string(),
  content: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  schemaVersion: z.number().min(1).max(CURRENT_SCHEMA_VERSION),
});

export const progressMetricSchema = z.object({
  id: z.string(),
  date: z.string(),
  bodyweightKg: z.number().optional(),
  bodyFatPercent: z.number().optional(),
  customMetrics: z.record(z.number()).optional(),
  createdAt: z.string(),
  schemaVersion: z.number().min(1).max(CURRENT_SCHEMA_VERSION),
});

export const mediaEntrySchema = z.object({
  id: z.string(),
  date: z.string(),
  mediaType: z.enum(['photo', 'video']),
  fileReference: z.string(),
  notes: z.string().optional(),
  createdAt: z.string(),
  schemaVersion: z.number().min(1).max(CURRENT_SCHEMA_VERSION),
});

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  createdAt: z.string(),
  schemaVersion: z.number().min(1).max(CURRENT_SCHEMA_VERSION),
});

export const sessionSchema = z.object({
  token: z.string(),
  email: z.string(),
  expiresAt: z.string(),
});

export type WorkoutDayInput = z.infer<typeof workoutDaySchema>;
export type NutritionLogInput = z.infer<typeof nutritionLogSchema>;
export type DailyNoteInput = z.infer<typeof dailyNoteSchema>;
export type ProgressMetricInput = z.infer<typeof progressMetricSchema>;
export type MediaEntryInput = z.infer<typeof mediaEntrySchema>;
export type UserInput = z.infer<typeof userSchema>;
export type SessionInput = z.infer<typeof sessionSchema>;
