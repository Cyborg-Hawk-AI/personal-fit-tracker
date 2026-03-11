# Troubleshooting

**Last updated:** 2025-03-11

## Login not working

- Ensure credentials are exactly: **ygbarakat@gmail.com** / **tool7060**.
- Check that localStorage is enabled and not full (e.g. private mode or strict settings can block it).

## Data disappeared

- Data lives only in the browser. Clearing site data or using a different browser/device will show no data.
- **Restore:** Use Backup → Restore from a previously exported JSON file.

## Charts or list empty

- **Analytics:** Add at least one bodyweight entry (Analytics → Bodyweight → enter kg → Save).
- **Exercise progression:** Log completed sets with weight for that exercise, then select the exercise in the dropdown.
- **Media timeline:** Add photos/videos on the Media page for the selected date.

## Export/import fails

- **Export:** If the backup JSON is very large (many media files), download may be slow or the file may be big; this is expected.
- **Import:** Ensure the file is a valid JSON backup produced by this app. Corrupt or edited files may throw; check the browser console for the exact error.

## Build (Vercel) fails

- Run `npm run build` locally. Fix any TypeScript or lint errors.
- Ensure `output: 'export'` in next.config.js for static export.
- No server-side code should depend on localStorage or window; use `'use client'` and guard with `typeof window !== 'undefined'` where needed.

## Media upload fails

- Check file size (images ≤ 5 MB, videos ≤ 50 MB).
- Supported: image/*, video/*. Unsupported formats may fail.

---

**Status:** ✅ Validated
