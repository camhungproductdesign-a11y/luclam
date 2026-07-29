// ==========================================================================
// Client-side IndexedDB Media Store for Saigon Pocket Guide
// ==========================================================================

const DB_NAME = 'SaigonGuideDB';
const DB_VERSION = 1;
const STORE_NAME = 'media';

export interface UploadedMedia {
  id: string;
  name: string;
  type: string; // 'image/*' or 'video/*'
  size: number;
  blob: Blob;
  addedAt: number;
  serverUrl?: string;
}

export function fileToBase64(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

export async function uploadMediaToServer(file: File): Promise<{ url: string }> {
  const base64 = await fileToBase64(file);
  const response = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      file: base64,
      fileName: file.name,
      fileType: file.type
    })
  });
  if (!response.ok) {
    throw new Error('Failed to upload file to server');
  }
  return await response.json();
}

export function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = (event: any) => {
      resolve(event.target.result);
    };

    request.onerror = (event: any) => {
      console.error('IndexedDB opening error:', event);
      reject(event.target.error);
    };
  });
}

export async function saveMedia(file: File, serverUrl?: string): Promise<{ id: string; url: string; item: UploadedMedia }> {
  const db = await initDB();
  const id = `media-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const item: UploadedMedia = {
    id,
    name: file.name,
    type: file.type,
    size: file.size,
    addedAt: Date.now(),
    blob: file,
    serverUrl
  };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(item);

    request.onsuccess = () => {
      resolve({
        id,
        url: serverUrl || `indexeddb-media://${id}`,
        item
      });
    };

    request.onerror = (event: any) => {
      reject(event.target.error);
    };
  });
}

export async function getMedia(id: string): Promise<Blob | null> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = (event: any) => {
      const result = event.target.result;
      resolve(result ? result.blob : null);
    };

    request.onerror = (event: any) => {
      reject(event.target.error);
    };
  });
}

export async function deleteMedia(id: string): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = (event: any) => {
      reject(event.target.error);
    };
  });
}

export async function listMedia(): Promise<UploadedMedia[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = (event: any) => {
      const items = event.target.result || [];
      // Sort by newest first
      items.sort((a: UploadedMedia, b: UploadedMedia) => b.addedAt - a.addedAt);
      resolve(items);
    };

    request.onerror = (event: any) => {
      reject(event.target.error);
    };
  });
}
