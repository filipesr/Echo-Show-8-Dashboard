import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

// Fetches data on mount and every `intervalMs`, keeping the last successful
// response in AsyncStorage, so the dashboard shows data immediately after a
// restart and keeps working offline. A null `storageKey` disables it.
// The key should identify the request (e.g. include the coordinates), so
// changing it drops the old data and fetches again.
export function useCachedData<T>(
  storageKey: string | null,
  fetcher: () => Promise<T>,
  intervalMs: number
): T | null {
  // Data is stored with the key it belongs to, so after a key change the
  // old value is ignored until the new one arrives
  const [entry, setEntry] = useState<{ key: string; value: T } | null>(null);

  useEffect(() => {
    if (!storageKey) return;

    let active = true;

    async function update() {
      try {
        const fresh = await fetcher();
        if (!active) return;
        setEntry({ key: storageKey!, value: fresh });
        await AsyncStorage.setItem(storageKey!, JSON.stringify(fresh));
      } catch (error) {
        // Keep showing the cached data; next interval will retry
        console.warn(`Update failed (${storageKey})`, error);
      }
    }

    AsyncStorage.getItem(storageKey).then((cached) => {
      if (!active || !cached) return;
      // Only if the fetch hasn't already delivered fresher data
      setEntry((current) =>
        current?.key === storageKey ? current : { key: storageKey, value: JSON.parse(cached) }
      );
    });
    update();
    const id = setInterval(update, intervalMs);

    return () => {
      active = false;
      clearInterval(id);
    };
    // The fetcher is recreated on every render; the key already identifies it
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey, intervalMs]);

  return entry && entry.key === storageKey ? entry.value : null;
}
