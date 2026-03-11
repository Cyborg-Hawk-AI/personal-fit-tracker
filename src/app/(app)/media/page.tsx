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
    const map: Record<string, string> = {};
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
    return () => {
      cancelled = true;
      Object.values(map).forEach(URL.revokeObjectURL);
    };
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
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Progress media</h1>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-surface-300">
          <input
            type="checkbox"
            checked={compareMode}
            onChange={(e) => setCompareMode(e.target.checked)}
            className="rounded border-surface-200/20 text-accent"
          />
          Compare two dates
        </label>
      </div>

      {compareMode ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-surface-400 mb-1">Date A</label>
              <select
                value={compareDateA ?? ''}
                onChange={(e) => setCompareDateA(e.target.value || null)}
                className="w-full rounded border border-surface-200/20 bg-surface-800 px-3 py-2 text-white"
              >
                <option value="">Select</option>
                {dateOptions.map((d) => (
                  <option key={d} value={d}>
                    {format(new Date(d), 'MMM d, yyyy')}
                  </option>
                ))}
              </select>
              <div className="mt-2 flex flex-wrap gap-2">
                {entriesA
                  .filter((e) => e.mediaType === 'photo')
                  .map((e) => (
                    <div key={e.id} className="relative">
                      {urls[e.id] ? (
                        <img
                          src={urls[e.id]}
                          alt=""
                          className="h-40 w-auto rounded object-cover"
                        />
                      ) : (
                        <div className="h-40 w-24 rounded bg-surface-700 animate-pulse" />
                      )}
                    </div>
                  ))}
              </div>
            </div>
            <div>
              <label className="block text-sm text-surface-400 mb-1">Date B</label>
              <select
                value={compareDateB ?? ''}
                onChange={(e) => setCompareDateB(e.target.value || null)}
                className="w-full rounded border border-surface-200/20 bg-surface-800 px-3 py-2 text-white"
              >
                <option value="">Select</option>
                {dateOptions.map((d) => (
                  <option key={d} value={d}>
                    {format(new Date(d), 'MMM d, yyyy')}
                  </option>
                ))}
              </select>
              <div className="mt-2 flex flex-wrap gap-2">
                {entriesB
                  .filter((e) => e.mediaType === 'photo')
                  .map((e) => (
                    <div key={e.id}>
                      {urls[e.id] ? (
                        <img
                          src={urls[e.id]}
                          alt=""
                          className="h-40 w-auto rounded object-cover"
                        />
                      ) : (
                        <div className="h-40 w-24 rounded bg-surface-700 animate-pulse" />
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
              <button
                type="button"
                onClick={handlePrev}
                className="rounded-lg border border-surface-200/20 px-4 py-2 text-sm font-medium text-white hover:bg-surface-800"
              >
                ← Prev
              </button>
              <span className="min-w-[140px] text-center font-medium text-white">
                {format(new Date(selectedDate), 'EEE, MMM d')}
              </span>
              <button
                type="button"
                onClick={handleNext}
                className="rounded-lg border border-surface-200/20 px-4 py-2 text-sm font-medium text-white hover:bg-surface-800"
              >
                Next →
              </button>
            </div>
            <label className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-surface-900 cursor-pointer hover:bg-accent-dark">
              {uploading ? 'Uploading…' : 'Add photo/video'}
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFile}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="flex flex-wrap gap-4">
            {displayEntries.map((entry) => (
              <div
                key={entry.id}
                className="rounded-xl border border-surface-200/10 bg-surface-800 overflow-hidden"
              >
                {entry.mediaType === 'photo' ? (
                  urls[entry.id] ? (
                    <img
                      src={urls[entry.id]}
                      alt=""
                      className="h-48 w-auto object-cover"
                    />
                  ) : (
                    <div className="h-48 w-32 bg-surface-700 animate-pulse" />
                  )
                ) : urls[entry.id] ? (
                  <video
                    src={urls[entry.id]}
                    controls
                    className="h-48 max-w-xs object-contain"
                  />
                ) : (
                  <div className="h-48 w-32 bg-surface-700 animate-pulse" />
                )}
                <div className="p-2 flex justify-between items-center">
                  <span className="text-xs text-surface-400">{entry.date}</span>
                  <button
                    type="button"
                    onClick={() => handleDelete(entry)}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
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
