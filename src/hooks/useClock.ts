import { useSyncExternalStore } from "react";

function subscribe(onTick: () => void) {
  const id = setInterval(onTick, 1000);
  return () => clearInterval(id);
}

// Snapshots are plain numbers (current second or minute), so they stay
// stable between ticks: React only re-renders when the number changes.
// (A new Date object on every call would re-render forever.)
const RESOLUTION_MS = { second: 1000, minute: 60 * 1000 };
const SNAPSHOTS = {
  second: () => Math.floor(Date.now() / RESOLUTION_MS.second),
  minute: () => Math.floor(Date.now() / RESOLUTION_MS.minute),
};

// Returns the current date, updated every second (or every minute, for
// components that don't show seconds and shouldn't re-render as often)
export function useClock(resolution: "second" | "minute" = "second"): Date {
  const snapshot = SNAPSHOTS[resolution];
  const tick = useSyncExternalStore(subscribe, snapshot, snapshot);
  return new Date(tick * RESOLUTION_MS[resolution]);
}
