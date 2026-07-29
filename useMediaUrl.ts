import { useState, useEffect } from 'react';
import { getMedia } from '../indexedDBStore';

/**
 * Resolves standard web URLs, presets, or local indexeddb-media:// URLs
 * into a directly-renderable src URL (with Blob object URLs for IndexedDB content).
 */
export function useMediaUrl(url: string | undefined): string {
  const [resolvedUrl, setResolvedUrl] = useState<string>('');

  useEffect(() => {
    if (!url) {
      setResolvedUrl('');
      return;
    }

    // Handle local IndexedDB media protocol
    if (url.startsWith('indexeddb-media://')) {
      const id = url.replace('indexeddb-media://', '');
      let isCurrent = true;
      let objectUrl = '';

      getMedia(id)
        .then((blob) => {
          if (!isCurrent) return;
          if (blob) {
            objectUrl = URL.createObjectURL(blob);
            setResolvedUrl(objectUrl);
          } else {
            setResolvedUrl('');
          }
        })
        .catch((err) => {
          console.error('Error resolving IndexedDB media:', err);
          if (isCurrent) setResolvedUrl('');
        });

      return () => {
        isCurrent = false;
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
        }
      };
    } else {
      // Standard HTTP/HTTPS or data URL
      setResolvedUrl(url);
    }
  }, [url]);

  return resolvedUrl;
}
