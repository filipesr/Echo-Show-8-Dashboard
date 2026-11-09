"use client";

import { useEffect, useState } from "react";

// Fetches data on mount and every `intervalMs`, keeping the last successful
// response in localStorage, so the dashboard shows data immediately on
// reload and keeps working offline. Pass `enabled: false` to skip fetching.
export function useCachedData<T>(
  storageKey: string,
  fetcher: () => Promise<T>,
  intervalMs: number,
  enabled = true
): T | null {
  // Dashboard only renders on the client (see DeviceFrame), so reading
  // localStorage here is safe; the window check just guards the server
  const [data, setData] = useState<T | null>(() => {
    if (typeof window === "undefined") return null;
    const cached = localStorage.getItem(storageKey);
    return cached ? JSON.parse(cached) : null;
  });

  useEffect(() => {
    if (!enabled) return;

    async function update() {
      try {
        const fresh = await fetcher();
        setData(fresh);
        localStorage.setItem(storageKey, JSON.stringify(fresh));
      } catch (error) {
        // Keep showing the cached data; next interval will retry
        console.warn(`Update failed (${storageKey})`, error);
      }
    }

    update();
    const id = setInterval(update, intervalMs);
    return () => clearInterval(id);
  }, [storageKey, fetcher, intervalMs, enabled]);

  return data;
}
