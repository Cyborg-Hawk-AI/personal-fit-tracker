'use client';

import { INDEXED_DB_NAME, INDEXED_DB_STORE, INDEXED_DB_VERSION } from './constants';
import type { MediaBlobRecord } from '@/lib/schema/types';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(INDEXED_DB_NAME, INDEXED_DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(INDEXED_DB_STORE)) {
        db.createObjectStore(INDEXED_DB_STORE, { keyPath: 'id' });
      }
    };
  });
}

export async function saveMediaBlob(id: string, blob: Blob, mimeType: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(INDEXED_DB_STORE, 'readwrite');
    const store = tx.objectStore(INDEXED_DB_STORE);
    const record: Omit<MediaBlobRecord, 'blob'> & { blob: Blob } = {
      id,
      blob,
      mimeType,
      createdAt: new Date().toISOString(),
    };
    const req = store.put(record);
    req.onsuccess = () => { db.close(); resolve(); };
    req.onerror = () => { db.close(); reject(req.error); };
  });
}

export async function getMediaBlob(id: string): Promise<MediaBlobRecord | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(INDEXED_DB_STORE, 'readonly');
    const store = tx.objectStore(INDEXED_DB_STORE);
    const req = store.get(id);
    req.onsuccess = () => { db.close(); resolve(req.result ?? null); };
    req.onerror = () => { db.close(); reject(req.error); };
  });
}

export async function deleteMediaBlob(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(INDEXED_DB_STORE, 'readwrite');
    const store = tx.objectStore(INDEXED_DB_STORE);
    const req = store.delete(id);
    req.onsuccess = () => { db.close(); resolve(); };
    req.onerror = () => { db.close(); reject(req.error); };
  });
}

export async function getAllMediaBlobIds(): Promise<string[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(INDEXED_DB_STORE, 'readonly');
    const store = tx.objectStore(INDEXED_DB_STORE);
    const req = store.getAllKeys();
    req.onsuccess = () => { db.close(); resolve(req.result as string[]); };
    req.onerror = () => { db.close(); reject(req.error); };
  });
}
