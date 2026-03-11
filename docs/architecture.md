# System Architecture

**Last updated:** 2025-03-11 (ISO 8601)

## Overview

Personal Fit Tracker is a single-user, client-only web application for fitness, nutrition, and progress tracking. All data persists in the browser. No backend or external databases are used.

## Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                      UI Layer (React)                        │
│  Pages, components, forms, charts                           │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                   State Layer (Zustand)                      │
│  Auth store, workout store, nutrition store, media store     │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                  Service Layer                               │
│  WorkoutService, NutritionService, MediaService, etc.        │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│               Storage Layer (StorageManager)                 │
│  localStorage (structured data), IndexedDB (media blobs)     │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                   Schema Layer                               │
│  Types, Zod schemas, versioning, validation                 │
└─────────────────────────────────────────────────────────────┘
```

## Layer Responsibilities

| Layer | Responsibility |
|-------|----------------|
| **UI** | Rendering, user input, navigation. No direct storage access. |
| **State** | Client-side state, derived data, cache. Calls services. |
| **Service** | Business logic, validation before write, orchestration. Uses StorageManager. |
| **Storage** | Read/write to localStorage and IndexedDB. Schema versioning. |
| **Schema** | Entity types, Zod validation, default values, migrations. |

## Data Flow

- **Read:** UI → State (or direct service call) → Service → StorageManager → localStorage/IndexedDB
- **Write:** UI → Service (validate) → StorageManager → localStorage/IndexedDB → State updated

All persistence goes through `StorageManager`. No component or store writes directly to localStorage or IndexedDB.

## Key Directories

```
src/
├── app/                 # Next.js App Router (pages, layout)
├── components/          # Reusable UI components
├── lib/
│   ├── schema/          # Types, Zod schemas, schema version
│   ├── storage/         # StorageManager, localStorage, IndexedDB
│   ├── services/        # Business logic services
│   └── stores/          # Zustand stores
```

## Deployment

- **Platform:** Vercel
- **Build:** Static export (`next build` → `out/`)
- **Runtime:** Client-side only; no server persistence

## Security Model

- Single user; credentials hardcoded for local validation.
- Session token in localStorage; no server-side sessions.
- All data stays in the browser; no transmission of fitness/nutrition data to external services.

---

**Status:** ✅ Validated
