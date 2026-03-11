# Data Flow

**Last updated:** 2025-03-11

## Read flow

1. **UI** (e.g. Dashboard, Workouts page) needs data.
2. **State** or direct **Service** call:
   - Services read via `StorageManager.get*()` (localStorage) or `MediaStorage.getBlob()` (IndexedDB).
3. **StorageManager** returns validated entities (Zod-safeParse); invalid items are filtered out.
4. Data is rendered in the UI.

## Write flow

1. **UI** triggers an action (e.g. log set, save note, add photo).
2. **Service** layer:
   - Validates input.
   - Builds or updates entity (with schemaVersion, timestamps, id).
   - Calls `StorageManager.set*()` or `MediaStorage.saveBlob()`.
3. **StorageManager** writes to localStorage; media blobs go to IndexedDB.
4. UI may re-read from storage or update local state to reflect the change.

## Backup flow

- **Export:** Services read all entities and media blobs → build BackupPayload → JSON string → user downloads file.
- **Import:** User selects file → JSON parsed → entities written via StorageManager and MediaStorage → session unchanged (user must re-login if needed).

## Auth flow

- **Login:** User submits credentials → Auth store compares to hardcoded values → on success, session (token, email, expiresAt) written to localStorage via StorageManager.setSession.
- **Check auth:** On load/navigation, auth store reads StorageManager.getSession() and validates expiry.
- **Logout:** StorageManager.clearSession().

---

**Status:** ✅ Validated
