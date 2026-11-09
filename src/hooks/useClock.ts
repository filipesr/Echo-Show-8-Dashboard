"use client";

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
const getServerSnapshot = () => null;

// Returns the current date, updated every second (or every minute, for
// components that don't show seconds and shouldn't re-render as often).
// Null on the server so server and client render the same markup.
export function useClock(resolution: "second" | "minute" = "second"): Date | null {
  const tick = useSyncExternalStore(subscribe, SNAPSHOTS[resolution], getServerSnapshot);
  return tick === null ? null : new Date(tick * RESOLUTION_MS[resolution]);
}
