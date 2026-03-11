# Database Schema

**Last updated:** 2025-03-11  
**Schema version:** 1

All structured data lives in localStorage under namespaced keys. Large binary data (photos, videos) lives in IndexedDB.

## Schema Version

Every stored root object includes:

- `schemaVersion: number` — used for migrations and validation.

## Entities (localStorage)

### User (single record)

- **Key:** `fit_user`
- **Shape:** `{ schemaVersion, id, email, createdAt }`
- One user only; created on first run or restore.

### WorkoutDay

- **Key:** `fit_workout_days` (array)
- **Shape:** `{ schemaVersion, id, date (ISO), dayLabel, exerciseLogs[], notes?, createdAt, updatedAt }`
- One record per calendar day when a workout is logged.

### Exercise (template from program)

- Defined in code (hardcoded program). Not stored as entity; referenced by name in ExerciseLog.

### ExerciseLog

- **Embedded in WorkoutDay.exerciseLogs[]**
- **Shape:** `{ exerciseName, sets[], targetSets, targetReps, intensityPercent?, notes? }`
- **sets:** `{ reps?, weight?, completed: boolean }[]`

### NutritionLog

- **Key:** `fit_nutrition_logs` (array)
- **Shape:** `{ schemaVersion, id, date (ISO), meals[], supplements[], compliant: boolean?, notes?, createdAt, updatedAt }`
- One record per day.

### DailyNote

- **Key:** `fit_daily_notes` (array)
- **Shape:** `{ schemaVersion, id, date (ISO), content, createdAt, updatedAt }`
- One note per day (optional).

### ProgressMetric

- **Key:** `fit_progress_metrics` (array)
- **Shape:** `{ schemaVersion, id, date (ISO), bodyweightKg?, bodyFatPercent?, customMetrics?, createdAt }`
- Used for bodyweight trend and analytics.

### MediaEntry (metadata in localStorage)

- **Key:** `fit_media_entries` (array)
- **Shape:** `{ schemaVersion, id, date (ISO), mediaType: 'photo'|'video', fileReference (IDB key/id), notes?, createdAt }`
- Actual file blobs stored in IndexedDB; `fileReference` links to them.

## IndexedDB (media)

- **DB name:** `fit_media_db`
- **Store:** `media` — key: `id` (uuid), value: `{ id, blob, mimeType, createdAt }`
- `MediaEntry.fileReference` matches `id` in this store.

## localStorage Keys Summary

| Key | Content |
|-----|---------|
| `fit_session` | `{ token, email, expiresAt }` |
| `fit_user` | User entity |
| `fit_workout_days` | WorkoutDay[] |
| `fit_nutrition_logs` | NutritionLog[] |
| `fit_daily_notes` | DailyNote[] |
| `fit_progress_metrics` | ProgressMetric[] |
| `fit_media_entries` | MediaEntry[] (metadata only) |
| `fit_schema_version` | number (current schema version) |

---

**Status:** ✅ Validated
