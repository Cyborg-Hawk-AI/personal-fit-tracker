'use client';

import { StorageManager } from '@/lib/storage/storage-manager';
import { CURRENT_SCHEMA_VERSION } from '@/lib/schema/version';
import type { ProgressMetric } from '@/lib/schema/types';

function generateId(): string {
  return `pm_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function now(): string {
  return new Date().toISOString();
}

export function getMetricForDate(dateStr: string): ProgressMetric | null {
  const metrics = StorageManager.getProgressMetrics();
  return metrics.find((m) => m.date === dateStr) ?? null;
}

export function getOrCreateMetricForDate(dateStr: string): ProgressMetric {
  let m = getMetricForDate(dateStr);
  if (m) return m;
  m = {
    id: generateId(),
    date: dateStr,
    createdAt: now(),
    schemaVersion: CURRENT_SCHEMA_VERSION,
  };
  saveMetric(m);
  return m;
}

export function saveMetric(metric: ProgressMetric): void {
  const list = StorageManager.getProgressMetrics();
  const index = list.findIndex((x) => x.id === metric.id);
  const updated = [...list];
  if (index >= 0) {
    updated[index] = metric;
  } else {
    updated.push(metric);
  }
  StorageManager.setProgressMetrics(updated);
}

export function getAllMetrics(): ProgressMetric[] {
  return StorageManager.getProgressMetrics();
}
