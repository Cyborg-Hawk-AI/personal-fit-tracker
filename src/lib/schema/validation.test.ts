import { describe, it, expect } from 'vitest';
import {
  workoutDaySchema,
  nutritionLogSchema,
  progressMetricSchema,
  mediaEntrySchema,
  sessionSchema,
} from './validation';

describe('validation', () => {
  it('accepts valid WorkoutDay', () => {
    const valid = {
      id: 'wd_1',
      date: '2025-03-11',
      dayLabel: 'Chest',
      exerciseLogs: [
        {
          exerciseName: 'Incline Press',
          sets: [{ completed: true }, { completed: false }],
          targetSets: 2,
          targetReps: 10,
          intensityPercent: 70,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      schemaVersion: 1,
    };
    expect(workoutDaySchema.safeParse(valid).success).toBe(true);
  });

  it('rejects WorkoutDay with missing required field', () => {
    const invalid = {
      id: 'wd_1',
      date: '2025-03-11',
      dayLabel: 'Chest',
      // missing exerciseLogs
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      schemaVersion: 1,
    };
    expect(workoutDaySchema.safeParse(invalid).success).toBe(false);
  });

  it('accepts valid NutritionLog', () => {
    const valid = {
      id: 'nl_1',
      date: '2025-03-11',
      meals: [{ name: 'Breakfast', compliant: true }],
      supplements: [{ name: 'D3', taken: true }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      schemaVersion: 1,
    };
    expect(nutritionLogSchema.safeParse(valid).success).toBe(true);
  });

  it('accepts valid ProgressMetric', () => {
    const valid = {
      id: 'pm_1',
      date: '2025-03-11',
      bodyweightKg: 82.5,
      createdAt: new Date().toISOString(),
      schemaVersion: 1,
    };
    expect(progressMetricSchema.safeParse(valid).success).toBe(true);
  });

  it('accepts valid MediaEntry', () => {
    const valid = {
      id: 'me_1',
      date: '2025-03-11',
      mediaType: 'photo' as const,
      fileReference: 'me_1',
      createdAt: new Date().toISOString(),
      schemaVersion: 1,
    };
    expect(mediaEntrySchema.safeParse(valid).success).toBe(true);
  });

  it('accepts valid Session', () => {
    const valid = {
      token: 'fit_123_abc',
      email: 'user@example.com',
      expiresAt: new Date().toISOString(),
    };
    expect(sessionSchema.safeParse(valid).success).toBe(true);
  });
});
