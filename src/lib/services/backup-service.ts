'use client';

import { StorageManager, MediaStorage } from '@/lib/storage';
import type { MediaEntry } from '@/lib/schema/types';

export interface BackupPayload {
  version: 1;
  exportedAt: string;
  schemaVersion: number;
  user: unknown;
  workoutDays: unknown[];
  nutritionLogs: unknown[];
  dailyNotes: unknown[];
  progressMetrics: unknown[];
  mediaEntries: MediaEntry[];
  mediaBlobs: { id: string; mimeType: string; base64: string }[];
}

export async function exportBackup(): Promise<string> {
  const user = StorageManager.getUser();
  const workoutDays = StorageManager.getWorkoutDays();
  const nutritionLogs = StorageManager.getNutritionLogs();
  const dailyNotes = StorageManager.getDailyNotes();
  const progressMetrics = StorageManager.getProgressMetrics();
  const mediaEntries = StorageManager.getMediaEntries();

  const mediaBlobs: { id: string; mimeType: string; base64: string }[] = [];
  for (const entry of mediaEntries) {
    const record = await MediaStorage.getBlob(entry.fileReference);
    if (record) {
      const base64 = await blobToBase64(record.blob);
      mediaBlobs.push({
        id: record.id,
        mimeType: record.mimeType,
        base64,
      });
    }
  }

  const payload: BackupPayload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    schemaVersion: StorageManager.getSchemaVersion(),
    user: user ?? null,
    workoutDays,
    nutritionLogs,
    dailyNotes,
    progressMetrics,
    mediaEntries,
    mediaBlobs,
  };
  return JSON.stringify(payload, null, 2);
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1] ?? '');
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function base64ToBlob(base64: string, mimeType: string): Blob {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mimeType });
}

export async function importBackup(json: string): Promise<void> {
  const raw = JSON.parse(json) as BackupPayload;
  if (raw.version !== 1 || !raw.workoutDays || !Array.isArray(raw.workoutDays)) {
    throw new Error('Invalid backup format.');
  }

  if (raw.user) StorageManager.setUser(raw.user as Parameters<typeof StorageManager.setUser>[0]);
  StorageManager.setWorkoutDays((raw.workoutDays as Parameters<typeof StorageManager.setWorkoutDays>[0]) ?? []);
  StorageManager.setNutritionLogs((raw.nutritionLogs as Parameters<typeof StorageManager.setNutritionLogs>[0]) ?? []);
  StorageManager.setDailyNotes((raw.dailyNotes as Parameters<typeof StorageManager.setDailyNotes>[0]) ?? []);
  StorageManager.setProgressMetrics((raw.progressMetrics as Parameters<typeof StorageManager.setProgressMetrics>[0]) ?? []);
  StorageManager.setMediaEntries((raw.mediaEntries as MediaEntry[]) ?? []);

  if (raw.mediaBlobs && Array.isArray(raw.mediaBlobs)) {
    for (const item of raw.mediaBlobs) {
      if (item.id && item.mimeType && item.base64) {
        const blob = base64ToBlob(item.base64, item.mimeType);
        await MediaStorage.saveBlob(item.id, blob, item.mimeType);
      }
    }
  }

  if (typeof raw.schemaVersion === 'number') {
    StorageManager.setSchemaVersion(raw.schemaVersion);
  }
}
