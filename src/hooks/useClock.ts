"use client";

import { useSyncExternalStore } from "react";

function subscribe(onTick: () => void) {
  const id = setInterval(onTick, 1000);
  return () => clearInterval(id);
}

// Snapshot is the current second as a number, so it stays stable
// between ticks (a new Date object every call would loop forever)
const getSnapshot = () => Math.floor(Date.now() / 1000);
const getServerSnapshot = () => null;

// Returns the current date, updated every second.
// Null on the server so server and client render the same markup.
export function useClock(): Date | null {
  const seconds = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return seconds === null ? null : new Date(seconds * 1000);
}
