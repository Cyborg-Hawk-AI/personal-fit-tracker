'use client';

import { useState, useEffect, useCallback } from 'react';
import { format, addDays, subDays } from 'date-fns';
import { getOrCreateNoteForDate, saveNote } from '@/lib/services/notes-service';
import type { DailyNote } from '@/lib/schema/types';

export default function NotesPage() {
  const [selectedDate, setSelectedDate] = useState(() => format(new Date(), 'yyyy-MM-dd'));
  const [note, setNote] = useState<DailyNote | null>(null);

  const load = useCallback(() => {
    setNote(getOrCreateNoteForDate(selectedDate));
  }, [selectedDate]);

  useEffect(() => {
    load();
  }, [load]);

  const handlePrev = () => setSelectedDate((d) => format(subDays(new Date(d), 1), 'yyyy-MM-dd'));
  const handleNext = () => setSelectedDate((d) => format(addDays(new Date(d), 1), 'yyyy-MM-dd'));

  const handleSave = () => {
    if (note) saveNote({ ...note, content: note.content });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-white">Daily notes</h1>
        <div className="flex items-center gap-2">
          <button type="button" onClick={handlePrev} className="btn-ghost py-2">← Prev</button>
          <span className="min-w-[140px] text-center font-medium text-white text-sm">
            {format(new Date(selectedDate), 'EEE, MMM d')}
          </span>
          <button type="button" onClick={handleNext} className="btn-ghost py-2">Next →</button>
        </div>
      </div>

      {note && (
        <div className="card p-5">
          <textarea
            value={note.content}
            onChange={(e) => setNote({ ...note, content: e.target.value })}
            onBlur={handleSave}
            placeholder="Today's notes…"
            rows={12}
            className="w-full rounded-xl border border-white/10 bg-surface-900/80 px-4 py-3 text-white placeholder-surface-500 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-colors"
          />
          <p className="mt-2 text-sm text-surface-500">Saved automatically on blur.</p>
        </div>
      )}
    </div>
  );
}
