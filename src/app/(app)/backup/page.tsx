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
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-2xl font-bold tracking-tight text-white">Backup & restore</h1>

      <section className="card p-6">
        <h2 className="font-semibold text-white mb-2">Export data</h2>
        <p className="text-sm text-surface-400 mb-4">
          Download a JSON file with all workouts, nutrition, notes, metrics, and media. Store it
          somewhere safe; if localStorage or IndexedDB is cleared, you can restore from this file.
        </p>
        <button
          type="button"
          onClick={handleExport}
          disabled={exporting}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {exporting ? 'Preparing…' : 'Export backup'}
        </button>
        {exportStatus && <p className="mt-3 text-sm text-surface-400">{exportStatus}</p>}
      </section>

      <section className="card p-6">
        <h2 className="font-semibold text-white mb-2">Restore from backup</h2>
        <p className="text-sm text-surface-400 mb-4">
          Choose a previously exported JSON file. This will replace all current local data.
        </p>
        <label className="btn-ghost cursor-pointer inline-block">
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
          <p className={`mt-3 text-sm ${importStatus.ok ? 'text-accent font-medium' : 'text-red-400/90'}`}>
            {importStatus.message}
          </p>
        )}
      </section>
    </div>
  );
}
