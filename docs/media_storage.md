# Media Storage

**Last updated:** 2025-03-11

## Overview

Photos and videos are stored in **IndexedDB** to avoid localStorage size limits. Metadata (date, type, fileReference) is stored in localStorage under `fit_media_entries`.

## IndexedDB

- **Database:** `fit_media_db`
- **Store:** `media`
- **Key path:** `id` (string, matches MediaEntry.fileReference)
- **Value:** `{ id, blob, mimeType, createdAt }`

## Limits

- **Images:** max 5 MB per file; images over 1 MB are compressed (max dimension 1200px, JPEG 0.85).
- **Videos:** max 50 MB per file; no compression.

## Flow

1. User selects file → MediaService.addMedia() validates size and type.
2. Image compression (if applicable) runs in browser.
3. Blob is saved to IndexedDB via MediaStorage.saveBlob().
4. MediaEntry (metadata) is appended to localStorage list.
5. To display: get MediaEntry → getMediaBlobUrl(entry) loads blob from IndexedDB and returns object URL.

## Backup

- Export: each blob is read, converted to base64, and included in the JSON backup.
- Restore: base64 decoded to Blob, then saved to IndexedDB via MediaStorage.saveBlob().

---

**Status:** ✅ Validated
