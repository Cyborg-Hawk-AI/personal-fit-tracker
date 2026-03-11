'use client';

import { format } from 'date-fns';
import { StorageManager, MediaStorage } from '@/lib/storage';
import { CURRENT_SCHEMA_VERSION } from '@/lib/schema/version';
import type { MediaEntry, MediaType } from '@/lib/schema/types';

function generateId(): string {
  return `me_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function now(): string {
  return new Date().toISOString();
}

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const MAX_VIDEO_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

export async function addMedia(
  dateStr: string,
  file: File,
  mediaType: MediaType,
  notes?: string
): Promise<MediaEntry> {
  const size = file.size;
  if (mediaType === 'photo' && size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error('Image too large (max 5 MB).');
  }
  if (mediaType === 'video' && size > MAX_VIDEO_SIZE_BYTES) {
    throw new Error('Video too large (max 50 MB).');
  }

  const id = generateId();
  const blob = file.type.startsWith('image/') ? await compressImageIfNeeded(file) : file;
  await MediaStorage.saveBlob(id, blob, file.type);

  const entry: MediaEntry = {
    id,
    date: dateStr,
    mediaType,
    fileReference: id,
    notes,
    createdAt: now(),
    schemaVersion: CURRENT_SCHEMA_VERSION,
  };
  const entries = StorageManager.getMediaEntries();
  StorageManager.setMediaEntries([...entries, entry]);
  return entry;
}

async function compressImageIfNeeded(file: File): Promise<Blob> {
  if (file.size <= 1024 * 1024) return file; // under 1 MB keep as is
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      const max = 1200;
      let w = img.width;
      let h = img.height;
      if (w > max || h > max) {
        if (w > h) {
          h = (h * max) / w;
          w = max;
        } else {
          w = (w * max) / h;
          h = max;
        }
      }
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(file);
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      canvas.toBlob(
        (blob) => resolve(blob || file),
        'image/jpeg',
        0.85
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };
    img.src = url;
  });
}

export function getMediaEntries(): MediaEntry[] {
  return StorageManager.getMediaEntries();
}

export function getMediaEntriesByDate(dateStr: string): MediaEntry[] {
  return getMediaEntries().filter((e) => e.date === dateStr);
}

export function getMediaEntriesSortedByDate(): MediaEntry[] {
  return [...getMediaEntries()].sort((a, b) => b.date.localeCompare(a.date));
}

export async function getMediaBlobUrl(entry: MediaEntry): Promise<string | null> {
  const record = await MediaStorage.getBlob(entry.fileReference);
  if (!record) return null;
  return URL.createObjectURL(record.blob);
}

export async function deleteMedia(entry: MediaEntry): Promise<void> {
  await MediaStorage.deleteBlob(entry.fileReference);
  const entries = StorageManager.getMediaEntries().filter((e) => e.id !== entry.id);
  StorageManager.setMediaEntries(entries);
}
