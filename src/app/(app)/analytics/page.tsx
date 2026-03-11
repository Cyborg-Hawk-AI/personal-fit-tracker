'use client';

import { useState, useEffect, useMemo } from 'react';
import { format, subMonths } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { StorageManager } from '@/lib/storage/storage-manager';
import { getAllWorkoutDays } from '@/lib/services/workout-service';
import { getOrCreateMetricForDate, saveMetric, getAllMetrics } from '@/lib/services/metrics-service';
import type { WorkoutDay } from '@/lib/schema/types';

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState(() => getAllMetrics());
  const [workoutDays, setWorkoutDays] = useState<WorkoutDay[]>([]);
  const [bodyweightDate, setBodyweightDate] = useState(() => format(new Date(), 'yyyy-MM-dd'));
  const [bodyweightValue, setBodyweightValue] = useState<string>('');
  const [selectedExercise, setSelectedExercise] = useState<string>('');

  useEffect(() => {
    setMetrics(getAllMetrics());
    setWorkoutDays(getAllWorkoutDays());
  }, []);

  const bodyweightData = useMemo(() => {
    const withWeight = metrics
      .filter((m) => m.bodyweightKg != null)
      .map((m) => ({ date: m.date, weight: m.bodyweightKg!, displayDate: format(new Date(m.date), 'MMM d') }))
      .sort((a, b) => a.date.localeCompare(b.date));
    return withWeight;
  }, [metrics]);

  const exerciseHistory = useMemo(() => {
    if (!selectedExercise) return [];
    const out: { date: string; displayDate: string; bestWeight?: number; totalVolume?: number }[] = [];
    const byDate = new Map<string, { bestWeight?: number; volume: number }>();
    for (const w of workoutDays) {
      for (const ex of w.exerciseLogs) {
        if (ex.exerciseName !== selectedExercise) continue;
        let best = byDate.get(w.date);
        if (!best) {
          best = { volume: 0 };
          byDate.set(w.date, best);
        }
        let volume = 0;
        let maxWeight = 0;
        for (const set of ex.sets) {
          if (set.completed && set.weight != null && set.reps != null) {
            volume += set.weight * set.reps;
            if (set.weight > maxWeight) maxWeight = set.weight;
          }
        }
        best.volume += volume;
        if (maxWeight > 0) best.bestWeight = Math.max(best.bestWeight ?? 0, maxWeight);
      }
    }
    return Array.from(byDate.entries())
      .map(([date, v]) => ({
        date,
        displayDate: format(new Date(date), 'MMM d'),
        bestWeight: v.bestWeight,
        totalVolume: v.volume || undefined,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [workoutDays, selectedExercise]);

  const exerciseNames = useMemo(() => {
    const set = new Set<string>();
    workoutDays.forEach((w) => w.exerciseLogs.forEach((e) => set.add(e.exerciseName)));
    return Array.from(set).sort();
  }, [workoutDays]);

  const handleSaveBodyweight = () => {
    const v = parseFloat(bodyweightValue);
    if (Number.isNaN(v) || v <= 0) return;
    const m = getOrCreateMetricForDate(bodyweightDate);
    saveMetric({ ...m, bodyweightKg: v });
    setMetrics(getAllMetrics());
    setBodyweightValue('');
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-white">Progress analytics</h1>

      <section className="rounded-xl border border-surface-200/10 bg-surface-800 p-4">
        <h2 className="font-semibold text-white mb-3">Bodyweight</h2>
        <div className="flex flex-wrap gap-3 items-end mb-4">
          <div>
            <label className="block text-sm text-surface-400 mb-1">Date</label>
            <input
              type="date"
              value={bodyweightDate}
              onChange={(e) => setBodyweightDate(e.target.value)}
              className="rounded border border-surface-200/20 bg-surface-900 px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-surface-400 mb-1">kg</label>
            <input
              type="number"
              step="0.1"
              value={bodyweightValue}
              onChange={(e) => setBodyweightValue(e.target.value)}
              placeholder="e.g. 82.5"
              className="rounded border border-surface-200/20 bg-surface-900 px-3 py-2 text-white w-24"
            />
          </div>
          <button
            type="button"
            onClick={handleSaveBodyweight}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-surface-900 hover:bg-accent-dark"
          >
            Save
          </button>
        </div>
        {bodyweightData.length > 0 && (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={bodyweightData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#33403c" />
                <XAxis dataKey="displayDate" stroke="#94a3a0" fontSize={12} />
                <YAxis stroke="#94a3a0" fontSize={12} domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a2320', border: '1px solid #33403c' }}
                  labelStyle={{ color: '#eef2f1' }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="weight"
                  name="Bodyweight (kg)"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ fill: '#22c55e' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      <section className="rounded-xl border border-surface-200/10 bg-surface-800 p-4">
        <h2 className="font-semibold text-white mb-3">Exercise progression</h2>
        <div className="mb-4">
          <select
            value={selectedExercise}
            onChange={(e) => setSelectedExercise(e.target.value)}
            className="rounded border border-surface-200/20 bg-surface-900 px-3 py-2 text-white"
          >
            <option value="">Select exercise</option>
            {exerciseNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
        {selectedExercise && exerciseHistory.length > 0 && (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={exerciseHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#33403c" />
                <XAxis dataKey="displayDate" stroke="#94a3a0" fontSize={12} />
                <YAxis stroke="#94a3a0" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a2320', border: '1px solid #33403c' }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="bestWeight"
                  name="Best set weight (kg)"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>
    </div>
  );
}
