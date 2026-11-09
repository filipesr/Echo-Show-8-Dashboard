"use client";

import { useSyncExternalStore } from "react";

// Display mode doesn't change while the page is open, so nothing to subscribe to
const subscribe = () => () => {};

// Checks, in order:
//   - display-mode fullscreen/standalone: installed PWA (Android/desktop)
//   - navigator.standalone: installed PWA on iOS
//   - ?kiosk query param: for kiosk browsers (e.g. Fully Kiosk) opening the plain URL
function getSnapshot() {
  return (
    window.matchMedia("(display-mode: fullscreen)").matches ||
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true ||
    new URLSearchParams(window.location.search).has("kiosk")
  );
}

const getServerSnapshot = () => null;

// Detects if the app is running as an installed PWA (or on the device).
// Returns null on the server, to avoid rendering the wrong mode before hydration.
export function useStandalone(): boolean | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
