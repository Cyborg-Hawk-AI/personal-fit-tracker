'use client';

import {
  workoutDaySchema,
  nutritionLogSchema,
  dailyNoteSchema,
  progressMetricSchema,
  mediaEntrySchema,
  userSchema,
  sessionSchema,
} from '@/lib/schema/validation';
import type {
  WorkoutDay,
  NutritionLog,
  DailyNote,
  ProgressMetric,
  MediaEntry,
  User,
  Session,
} from '@/lib/schema/types';
import { CURRENT_SCHEMA_VERSION } from '@/lib/schema/version';
import { STORAGE_KEYS } from './constants';
import {
  saveMediaBlob,
  getMediaBlob,
  deleteMediaBlob,
  getAllMediaBlobIds,
} from './indexed-db';

const isBrowser = typeof window !== 'undefined';

function safeGetItem<T>(key: string): T | null {
  if (!isBrowser) return null;
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function safeSetItem(key: string, value: unknown): void {
  if (!isBrowser) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('localStorage setItem failed', key, e);
  }
}

function safeRemoveItem(key: string): void {
  if (!isBrowser) return;
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

/** Storage manager: single entry point for all persistence. */
export const StorageManager = {
  // --- Session ---
  getSession(): Session | null {
    const data = safeGetItem<unknown>(STORAGE_KEYS.SESSION);
    if (!data) return null;
    const parsed = sessionSchema.safeParse(data);
    return parsed.success ? parsed.data : null;
  },
  setSession(session: Session): void {
    safeSetItem(STORAGE_KEYS.SESSION, session);
  },
  clearSession(): void {
    safeRemoveItem(STORAGE_KEYS.SESSION);
  },

  // --- User ---
  getUser(): User | null {
    const data = safeGetItem<unknown>(STORAGE_KEYS.USER);
    if (!data) return null;
    const parsed = userSchema.safeParse(data);
    return parsed.success ? parsed.data : null;
  },
  setUser(user: User): void {
    safeSetItem(STORAGE_KEYS.USER, user);
  },

  // --- Workout days ---
  getWorkoutDays(): WorkoutDay[] {
    const data = safeGetItem<unknown[]>(STORAGE_KEYS.WORKOUT_DAYS);
    if (!Array.isArray(data)) return [];
    return data
      .map((item) => workoutDaySchema.safeParse(item))
      .filter((r): r is { success: true; data: WorkoutDay } => r.success)
      .map((r) => r.data);
  },
  setWorkoutDays(days: WorkoutDay[]): void {
    safeSetItem(STORAGE_KEYS.WORKOUT_DAYS, days);
  },

  // --- Nutrition logs ---
  getNutritionLogs(): NutritionLog[] {
    const data = safeGetItem<unknown[]>(STORAGE_KEYS.NUTRITION_LOGS);
    if (!Array.isArray(data)) return [];
    return data
      .map((item) => nutritionLogSchema.safeParse(item))
      .filter((r): r is { success: true; data: NutritionLog } => r.success)
      .map((r) => r.data);
  },
  setNutritionLogs(logs: NutritionLog[]): void {
    safeSetItem(STORAGE_KEYS.NUTRITION_LOGS, logs);
  },

  // --- Daily notes ---
  getDailyNotes(): DailyNote[] {
    const data = safeGetItem<unknown[]>(STORAGE_KEYS.DAILY_NOTES);
    if (!Array.isArray(data)) return [];
    return data
      .map((item) => dailyNoteSchema.safeParse(item))
      .filter((r): r is { success: true; data: DailyNote } => r.success)
      .map((r) => r.data);
  },
  setDailyNotes(notes: DailyNote[]): void {
    safeSetItem(STORAGE_KEYS.DAILY_NOTES, notes);
  },

  // --- Progress metrics ---
  getProgressMetrics(): ProgressMetric[] {
    const data = safeGetItem<unknown[]>(STORAGE_KEYS.PROGRESS_METRICS);
    if (!Array.isArray(data)) return [];
    return data
      .map((item) => progressMetricSchema.safeParse(item))
      .filter((r): r is { success: true; data: ProgressMetric } => r.success)
      .map((r) => r.data);
  },
  setProgressMetrics(metrics: ProgressMetric[]): void {
    safeSetItem(STORAGE_KEYS.PROGRESS_METRICS, metrics);
  },

  // --- Media entries (metadata) ---
  getMediaEntries(): MediaEntry[] {
    const data = safeGetItem<unknown[]>(STORAGE_KEYS.MEDIA_ENTRIES);
    if (!Array.isArray(data)) return [];
    return data
      .map((item) => mediaEntrySchema.safeParse(item))
      .filter((r): r is { success: true; data: MediaEntry } => r.success)
      .map((r) => r.data);
  },
  setMediaEntries(entries: MediaEntry[]): void {
    safeSetItem(STORAGE_KEYS.MEDIA_ENTRIES, entries);
  },

  // --- Schema version ---
  getSchemaVersion(): number {
    const v = safeGetItem<number>(STORAGE_KEYS.SCHEMA_VERSION);
    return typeof v === 'number' ? v : CURRENT_SCHEMA_VERSION;
  },
  setSchemaVersion(version: number): void {
    safeSetItem(STORAGE_KEYS.SCHEMA_VERSION, version);
  },
};

/** IndexedDB media operations (used by MediaService). */
export const MediaStorage = {
  saveBlob: saveMediaBlob,
  getBlob: getMediaBlob,
  deleteBlob: deleteMediaBlob,
  getAllBlobIds: getAllMediaBlobIds,
};
