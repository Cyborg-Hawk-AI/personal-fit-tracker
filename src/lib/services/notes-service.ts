'use client';

import { StorageManager } from '@/lib/storage/storage-manager';
import { CURRENT_SCHEMA_VERSION } from '@/lib/schema/version';
import type { DailyNote } from '@/lib/schema/types';

function generateId(): string {
  return `dn_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function now(): string {
  return new Date().toISOString();
}

export function getNoteForDate(dateStr: string): DailyNote | null {
  const notes = StorageManager.getDailyNotes();
  return notes.find((n) => n.date === dateStr) ?? null;
}

export function getOrCreateNoteForDate(dateStr: string): DailyNote {
  let note = getNoteForDate(dateStr);
  if (note) return note;
  note = {
    id: generateId(),
    date: dateStr,
    content: '',
    createdAt: now(),
    updatedAt: now(),
    schemaVersion: CURRENT_SCHEMA_VERSION,
  };
  saveNote(note);
  return note;
}

export function saveNote(note: DailyNote): void {
  const notes = StorageManager.getDailyNotes();
  const index = notes.findIndex((n) => n.id === note.id);
  const updated = [...notes];
  if (index >= 0) {
    updated[index] = { ...note, updatedAt: now() };
  } else {
    updated.push({ ...note, updatedAt: now() });
  }
  StorageManager.setDailyNotes(updated);
}
