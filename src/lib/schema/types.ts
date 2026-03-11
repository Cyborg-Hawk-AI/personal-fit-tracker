/**
 * Entity types for the fitness tracker.
 * All dates are ISO 8601 strings.
 */

export type MediaType = 'photo' | 'video';

export interface SetLog {
  reps?: number;
  weight?: number;
  completed: boolean;
}

export interface ExerciseLog {
  exerciseName: string;
  sets: SetLog[];
  targetSets: number;
  targetReps: number | 'Max';
  intensityPercent?: number;
  notes?: string;
}

export interface WorkoutDay {
  id: string;
  date: string; // ISO date
  dayLabel: string; // e.g. "Chest", "Back + Biceps"
  exerciseLogs: ExerciseLog[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
  schemaVersion: number;
}

export interface NutritionLog {
  id: string;
  date: string;
  meals: { name: string; compliant: boolean }[];
  supplements: { name: string; taken: boolean }[];
  compliant?: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  schemaVersion: number;
}

export interface DailyNote {
  id: string;
  date: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  schemaVersion: number;
}

export interface ProgressMetric {
  id: string;
  date: string;
  bodyweightKg?: number;
  bodyFatPercent?: number;
  customMetrics?: Record<string, number>;
  createdAt: string;
  schemaVersion: number;
}

export interface MediaEntry {
  id: string;
  date: string;
  mediaType: MediaType;
  fileReference: string; // IndexedDB key
  notes?: string;
  createdAt: string;
  schemaVersion: number;
}

export interface User {
  id: string;
  email: string;
  createdAt: string;
  schemaVersion: number;
}

export interface Session {
  token: string;
  email: string;
  expiresAt: string;
}

// IndexedDB blob record (internal)
export interface MediaBlobRecord {
  id: string;
  blob: Blob;
  mimeType: string;
  createdAt: string;
}

// Program day template (hardcoded)
export interface ExerciseTemplate {
  name: string;
  sets: number;
  reps: number | 'Max';
  intensityPercent?: number;
}

export interface ProgramDayTemplate {
  dayOfWeek: number; // 0 = Sunday, 3 = Wednesday, etc.
  label: string;
  exercises: ExerciseTemplate[];
}
