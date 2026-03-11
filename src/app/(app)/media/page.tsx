'use client';

import { useState, useEffect, useMemo } from 'react';
import { format, addDays, subDays } from 'date-fns';
import {
  getMediaEntriesSortedByDate,
  getMediaEntriesByDate,
  getMediaBlobUrl,
  addMedia,
  deleteMedia,
} from '@/lib/services/media-service';
import type { MediaEntry } from '@/lib/schema/types';

export default function MediaPage() {
  const [selectedDate, setSelectedDate] = useState(() => format(new Date(), 'yyyy-MM-dd'));
  const [entries, setEntries] = useState<MediaEntry[]>([]);
  const [compareMode, setCompareMode] = useState(false);
  const [compareDateA, setCompareDateA] = useState<string | null>(null);
  const [compareDateB, setCompareDateB] = useState<string | null>(null);
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allEntries = useMemo(() => getMediaEntriesSortedByDate(), [entries]);
  const dateOptions = useMemo(() => {
    const set = new Set(entries.map((e) => e.date));
    return Array.from(set).sort((a, b) => b.localeCompare(a));
  }, [entries]);

  useEffect(() => {
    setEntries(getMediaEntriesSortedByDate());
  }, []);

  const displayEntries = useMemo(
    () => (compareMode ? [] : entries.filter((e) => e.date === selectedDate)),
    [compareMode, selectedDate, entries]
  );

  useEffect(() => {
    const toLoad = compareMode
      ? [
          ...getMediaEntriesByDate(compareDateA || ''),
          ...getMediaEntriesByDate(compareDateB || ''),
        ]
      : displayEntries;
    let cancelled = false;
    toLoad.forEach((entry) => {
      getMediaBlobUrl(entry).then((url) => {
        if (!cancelled && url) setUrls((prev) => ({ ...prev, [entry.id]: url }));
      });
    });
    return () => { cancelled = true; };
  }, [compareMode, compareDateA, compareDateB, displayEntries]);

  const handlePrev = () => setSelectedDate((d) => format(subDays(new Date(d), 1), 'yyyy-MM-dd'));
  const handleNext = () => setSelectedDate((d) => format(addDays(new Date(d), 1), 'yyyy-MM-dd'));

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const type = file.type.startsWith('image/') ? 'photo' : 'video';
      await addMedia(selectedDate, file, type);
      setEntries(getMediaEntriesSortedByDate());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (entry: MediaEntry) => {
    if (!confirm('Delete this media?')) return;
    await deleteMedia(entry);
    setEntries(getMediaEntriesSortedByDate());
    setUrls((prev) => {
      const next = { ...prev };
      if (prev[entry.id]) URL.revokeObjectURL(prev[entry.id]);
      delete next[entry.id];
      return next;
    });
  };

  const entriesA = compareDateA ? getMediaEntriesByDate(compareDateA) : [];
  const entriesB = compareDateB ? getMediaEntriesByDate(compareDateB) : [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-white">Progress media</h1>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-surface-400 hover:text-white transition-colors">
          <input
            type="checkbox"
            checked={compareMode}
            onChange={(e) => setCompareMode(e.target.checked)}
            className="rounded border-white/20 text-accent focus:ring-accent/40"
          />
          Compare two dates
        </label>
      </div>

      {compareMode ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-5">
            <div className="card p-4">
              <label className="block text-sm text-surface-400 mb-2">Date A</label>
              <select
                value={compareDateA ?? ''}
                onChange={(e) => setCompareDateA(e.target.value || null)}
                className="w-full rounded-xl border border-white/10 bg-surface-900/80 px-3 py-2 text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
              >
                <option value="">Select</option>
                {dateOptions.map((d) => (
                  <option key={d} value={d}>{format(new Date(d), 'MMM d, yyyy')}</option>
                ))}
              </select>
              <div className="mt-3 flex flex-wrap gap-2">
                {entriesA.filter((e) => e.mediaType === 'photo').map((e) => (
                  <div key={e.id} className="relative">
                    {urls[e.id] ? (
                      <img src={urls[e.id]} alt="" className="h-40 w-auto rounded-xl object-cover border border-white/[0.06]" />
                    ) : (
                      <div className="h-40 w-24 rounded-xl bg-surface-700/80 animate-pulse" />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="card p-4">
              <label className="block text-sm text-surface-400 mb-2">Date B</label>
              <select
                value={compareDateB ?? ''}
                onChange={(e) => setCompareDateB(e.target.value || null)}
                className="w-full rounded-xl border border-white/10 bg-surface-900/80 px-3 py-2 text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
              >
                <option value="">Select</option>
                {dateOptions.map((d) => (
                  <option key={d} value={d}>{format(new Date(d), 'MMM d, yyyy')}</option>
                ))}
              </select>
              <div className="mt-3 flex flex-wrap gap-2">
                {entriesB.filter((e) => e.mediaType === 'photo').map((e) => (
                  <div key={e.id}>
                    {urls[e.id] ? (
                      <img src={urls[e.id]} alt="" className="h-40 w-auto rounded-xl object-cover border border-white/[0.06]" />
                    ) : (
                      <div className="h-40 w-24 rounded-xl bg-surface-700/80 animate-pulse" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <button type="button" onClick={handlePrev} className="btn-ghost py-2">← Prev</button>
              <span className="min-w-[140px] text-center font-medium text-white text-sm">
                {format(new Date(selectedDate), 'EEE, MMM d')}
              </span>
              <button type="button" onClick={handleNext} className="btn-ghost py-2">Next →</button>
            </div>
            <label className="btn-primary cursor-pointer inline-block py-2">
              {uploading ? 'Uploading…' : 'Add photo/video'}
              <input type="file" accept="image/*,video/*" onChange={handleFile} className="hidden" disabled={uploading} />
            </label>
          </div>
          {error && <p className="text-sm text-red-400/90 rounded-lg bg-red-500/10 px-3 py-2">{error}</p>}
          <div className="flex flex-wrap gap-4">
            {displayEntries.map((entry) => (
              <div key={entry.id} className="card overflow-hidden group">
                {entry.mediaType === 'photo' ? (
                  urls[entry.id] ? (
                    <img src={urls[entry.id]} alt="" className="h-48 w-auto object-cover transition-transform group-hover:scale-[1.02]" />
                  ) : (
                    <div className="h-48 w-32 bg-surface-700/80 animate-pulse" />
                  )
                ) : urls[entry.id] ? (
                  <video src={urls[entry.id]} controls className="h-48 max-w-xs object-contain" />
                ) : (
                  <div className="h-48 w-32 bg-surface-700/80 animate-pulse" />
                )}
                <div className="p-3 flex justify-between items-center border-t border-white/[0.06]">
                  <span className="text-xs text-surface-500">{entry.date}</span>
                  <button type="button" onClick={() => handleDelete(entry)} className="text-xs text-red-400/90 hover:text-red-300 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
