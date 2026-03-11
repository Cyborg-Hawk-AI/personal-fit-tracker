# Testing Strategy

**Last updated:** 2025-03-11

## Scope

- **Data validation:** Zod schemas reject invalid or corrupt data; StorageManager filters to valid items only.
- **Storage integrity:** No direct localStorage/IndexedDB access outside StorageManager and MediaStorage.
- **Component tests:** Critical flows (login, workout log, backup) can be covered by Vitest + React Testing Library.

## Data validation tests

- Parse valid WorkoutDay, NutritionLog, etc. with Zod → success.
- Parse object with wrong schemaVersion or missing required fields → failure or filtered out in StorageManager.

## Storage integrity

- All writes go through StorageManager or MediaStorage.
- Reads validate via schema.safeParse; invalid entries are skipped and not returned.

## Manual verification

1. **Login:** Wrong credentials → error; correct (ygbarakat@gmail.com / tool7060) → redirect to dashboard.
2. **Workout:** Select date → log sets → refresh page → data persists.
3. **Nutrition:** Toggle meals/supplements → refresh → state persists.
4. **Notes:** Type and blur → refresh → content persists.
5. **Analytics:** Add bodyweight → chart shows point.
6. **Media:** Upload photo → appears in timeline; compare mode shows two dates.
7. **Backup:** Export → open JSON and verify structure; Import → data restored.

## Vitest

- Run: `npm run test`
- Place tests in `src/**/*.test.ts` or `__tests__/**`.

---

**Status:** ✅ Validated
