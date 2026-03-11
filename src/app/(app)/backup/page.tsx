'use client';

import { useState } from 'react';
import { exportBackup, importBackup } from '@/lib/services/backup-service';

export default function BackupPage() {
  const [exportStatus, setExportStatus] = useState<string | null>(null);
  const [importStatus, setImportStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);

  const handleExport = async () => {
    setExportStatus(null);
    setExporting(true);
    try {
      const json = await exportBackup();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fit-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setExportStatus('Download started.');
    } catch (e) {
      setExportStatus('Export failed: ' + (e instanceof Error ? e.message : String(e)));
    } finally {
      setExporting(false);
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportStatus(null);
    setImporting(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const text = reader.result as string;
        await importBackup(text);
        setImportStatus({ ok: true, message: 'Restore complete. Refresh the app to see data.' });
      } catch (err) {
        setImportStatus({
          ok: false,
          message: err instanceof Error ? err.message : 'Restore failed.',
        });
      } finally {
        setImporting(false);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-white">Backup & restore</h1>

      <section className="rounded-xl border border-surface-200/10 bg-surface-800 p-6">
        <h2 className="font-semibold text-white mb-2">Export data</h2>
        <p className="text-sm text-surface-400 mb-4">
          Download a JSON file with all workouts, nutrition, notes, metrics, and media. Store it
          somewhere safe; if localStorage or IndexedDB is cleared, you can restore from this file.
        </p>
        <button
          type="button"
          onClick={handleExport}
          disabled={exporting}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-surface-900 hover:bg-accent-dark disabled:opacity-50"
        >
          {exporting ? 'Preparing…' : 'Export backup'}
        </button>
        {exportStatus && (
          <p className="mt-2 text-sm text-surface-300">{exportStatus}</p>
        )}
      </section>

      <section className="rounded-xl border border-surface-200/10 bg-surface-800 p-6">
        <h2 className="font-semibold text-white mb-2">Restore from backup</h2>
        <p className="text-sm text-surface-400 mb-4">
          Choose a previously exported JSON file. This will replace all current local data.
        </p>
        <label className="inline-block rounded-lg border border-surface-200/20 px-4 py-2 text-sm font-medium text-white hover:bg-surface-700 cursor-pointer">
          {importing ? 'Restoring…' : 'Choose file'}
          <input
            type="file"
            accept=".json,application/json"
            onChange={handleImport}
            className="hidden"
            disabled={importing}
          />
        </label>
        {importStatus && (
          <p
            className={`mt-2 text-sm ${importStatus.ok ? 'text-accent' : 'text-red-400'}`}
          >
            {importStatus.message}
          </p>
        )}
      </section>
    </div>
  );
}
