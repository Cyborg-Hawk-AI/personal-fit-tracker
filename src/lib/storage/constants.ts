/**
 * localStorage keys. All persistence goes through StorageManager.
 */
export const STORAGE_KEYS = {
  SESSION: 'fit_session',
  USER: 'fit_user',
  WORKOUT_DAYS: 'fit_workout_days',
  NUTRITION_LOGS: 'fit_nutrition_logs',
  DAILY_NOTES: 'fit_daily_notes',
  PROGRESS_METRICS: 'fit_progress_metrics',
  MEDIA_ENTRIES: 'fit_media_entries',
  SCHEMA_VERSION: 'fit_schema_version',
} as const;

export const INDEXED_DB_NAME = 'fit_media_db';
export const INDEXED_DB_STORE = 'media';
export const INDEXED_DB_VERSION = 1;
