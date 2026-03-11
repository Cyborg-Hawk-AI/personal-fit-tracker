'use client';

import { useState, useEffect, useCallback } from 'react';
import { format, addDays, subDays } from 'date-fns';
import {
  getOrCreateNutritionForDate,
  saveNutrition,
  toggleMeal,
  toggleSupplement,
} from '@/lib/services/nutrition-service';
import type { NutritionLog } from '@/lib/schema/types';

export default function NutritionPage() {
  const [selectedDate, setSelectedDate] = useState(() => format(new Date(), 'yyyy-MM-dd'));
  const [log, setLog] = useState<NutritionLog | null>(null);

  const load = useCallback(() => {
    setLog(getOrCreateNutritionForDate(selectedDate));
  }, [selectedDate]);

  useEffect(() => {
    load();
  }, [load]);

  const handlePrev = () => setSelectedDate((d) => format(subDays(new Date(d), 1), 'yyyy-MM-dd'));
  const handleNext = () => setSelectedDate((d) => format(addDays(new Date(d), 1), 'yyyy-MM-dd'));

  const onToggleMeal = (mealIndex: number) => {
    if (!log) return;
    const next = toggleMeal(log, mealIndex);
    saveNutrition(next);
    setLog(next);
  };

  const onToggleSupplement = (suppIndex: number) => {
    if (!log) return;
    const next = toggleSupplement(log, suppIndex);
    saveNutrition(next);
    setLog(next);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Nutrition</h1>
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
      </div>

      {log && (
        <div className="space-y-6">
          <div className="rounded-xl border border-surface-200/10 bg-surface-800 p-4">
            <h2 className="font-semibold text-white mb-3">Meals</h2>
            <div className="space-y-2">
              {log.meals.map((meal, i) => (
                <label
                  key={meal.name}
                  className="flex cursor-pointer items-center gap-3 rounded-lg bg-surface-900/50 px-3 py-2"
                >
                  <input
                    type="checkbox"
                    checked={meal.compliant}
                    onChange={() => onToggleMeal(i)}
                    className="h-4 w-4 rounded border-surface-200/20 text-accent focus:ring-accent"
                  />
                  <span className={meal.compliant ? 'text-white' : 'text-surface-400'}>
                    {meal.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-surface-200/10 bg-surface-800 p-4">
            <h2 className="font-semibold text-white mb-3">Supplements</h2>
            <div className="space-y-2">
              {log.supplements.map((supp, i) => (
                <label
                  key={supp.name}
                  className="flex cursor-pointer items-center gap-3 rounded-lg bg-surface-900/50 px-3 py-2"
                >
                  <input
                    type="checkbox"
                    checked={supp.taken}
                    onChange={() => onToggleSupplement(i)}
                    className="h-4 w-4 rounded border-surface-200/20 text-accent focus:ring-accent"
                  />
                  <span className={supp.taken ? 'text-white' : 'text-surface-400'}>
                    {supp.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-surface-200/10 bg-surface-800 p-4">
            <p className="text-sm text-surface-300">
              Day compliance:{' '}
              <span className={log.compliant ? 'text-accent font-medium' : 'text-surface-400'}>
                {log.compliant ? 'Yes' : 'No'}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
