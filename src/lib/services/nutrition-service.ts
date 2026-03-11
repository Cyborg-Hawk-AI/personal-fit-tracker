'use client';

import { StorageManager } from '@/lib/storage/storage-manager';
import { CURRENT_SCHEMA_VERSION } from '@/lib/schema/version';
import type { NutritionLog } from '@/lib/schema/types';

function generateId(): string {
  return `nl_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function now(): string {
  return new Date().toISOString();
}

const DEFAULT_MEALS = [
  { name: 'Breakfast', compliant: false },
  { name: 'Lunch', compliant: false },
  { name: 'Dinner', compliant: false },
  { name: 'Snacks', compliant: false },
];

const DEFAULT_SUPPLEMENTS = [
  { name: 'Vitamin D', taken: false },
  { name: 'Omega-3', taken: false },
  { name: 'Creatine', taken: false },
  { name: 'Protein', taken: false },
];

export function getNutritionForDate(dateStr: string): NutritionLog | null {
  const logs = StorageManager.getNutritionLogs();
  return logs.find((l) => l.date === dateStr) ?? null;
}

export function getOrCreateNutritionForDate(dateStr: string): NutritionLog {
  let log = getNutritionForDate(dateStr);
  if (log) return log;
  log = {
    id: generateId(),
    date: dateStr,
    meals: [...DEFAULT_MEALS],
    supplements: [...DEFAULT_SUPPLEMENTS],
    createdAt: now(),
    updatedAt: now(),
    schemaVersion: CURRENT_SCHEMA_VERSION,
  };
  saveNutrition(log);
  return log;
}

export function saveNutrition(log: NutritionLog): void {
  const logs = StorageManager.getNutritionLogs();
  const index = logs.findIndex((l) => l.id === log.id);
  const updated = [...logs];
  if (index >= 0) {
    updated[index] = { ...log, updatedAt: now() };
  } else {
    updated.push({ ...log, updatedAt: now() });
  }
  const allCompliant =
    log.meals.every((m) => m.compliant) && log.supplements.every((s) => s.taken);
  const idx = index >= 0 ? index : updated.length - 1;
  updated[idx] = { ...updated[idx], compliant: allCompliant };
  StorageManager.setNutritionLogs(updated);
}

export function toggleMeal(log: NutritionLog, mealIndex: number): NutritionLog {
  const next = {
    ...log,
    meals: log.meals.map((m, i) =>
      i === mealIndex ? { ...m, compliant: !m.compliant } : m
    ),
  };
  next.compliant =
    next.meals.every((m) => m.compliant) && next.supplements.every((s) => s.taken);
  return next;
}

export function toggleSupplement(log: NutritionLog, suppIndex: number): NutritionLog {
  const next = {
    ...log,
    supplements: log.supplements.map((s, i) =>
      i === suppIndex ? { ...s, taken: !s.taken } : s
    ),
  };
  next.compliant =
    next.meals.every((m) => m.compliant) && next.supplements.every((s) => s.taken);
  return next;
}

export function getAllNutritionLogs(): NutritionLog[] {
  return StorageManager.getNutritionLogs();
}
