# Personal Fit Tracker

Single-user web app for personal fitness tracking, nutrition, and physique progress. All data is stored in the browser (localStorage + IndexedDB). No backend. Deployable as a static site on Vercel.

## Features

- **Dashboard** — Today’s overview (workout, nutrition, bodyweight, media)
- **Workout tracker** — Hardcoded weekly program; log sets, reps, weight
- **Nutrition** — Daily meal and supplement checklist; compliance
- **Daily notes** — One note per day
- **Calendar** — Month view with workout/nutrition/note indicators
- **Progress analytics** — Bodyweight trend and exercise progression (Recharts)
- **Media timeline** — Progress photos/videos by date; compare two dates side-by-side
- **Backup & restore** — Export/import full data as JSON

## Tech stack

- Next.js 14 (App Router), TypeScript, Tailwind CSS
- Zustand (auth state), Recharts (charts), Zod (validation)
- localStorage (structured data), IndexedDB (media)

## Login (single user)

- **Email:** `ygbarakat@gmail.com`
- **Password:** `tool7060`

Session is stored in localStorage. No multi-user support.

## Local development

If you see `UNABLE_TO_GET_ISSUER_CERT_LOCALLY` during install, run:

```bash
NODE_TLS_REJECT_UNAUTHORIZED=0 npm install
```

Otherwise:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Log in with the credentials above, then check **Network** and **Console** in DevTools to confirm no errors.

## Build (static export for Vercel)

```bash
npm run build
```

Output is in `out/`. Deploy the `out` directory as a static site (e.g. Vercel with output directory `out`).

## Tests

```bash
npm run test
```

## Documentation

See the `/docs` folder:

- `architecture.md` — Layers and data flow
- `database_schema.md` — Entities and storage keys
- `data_flow.md` — Read/write and backup flow
- `media_storage.md` — IndexedDB and limits
- `testing_strategy.md` — Validation and manual checks
- `troubleshooting.md` — Common issues
- `development_log.md` — Changelog

## Data durability

Data lives only in the browser. Use **Backup** to export a JSON file. If you clear site data or switch devices, restore from that file.
