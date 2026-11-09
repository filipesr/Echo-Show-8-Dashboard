import { useSyncExternalStore } from "react";
import { Platform } from "react-native";

// Display mode doesn't change while the page is open, so nothing to subscribe to
const subscribe = () => () => {};

function getSnapshot() {
  if (Platform.OS !== "web") return true;
  return (
    window.matchMedia("(display-mode: fullscreen)").matches ||
    window.matchMedia("(display-mode: standalone)").matches ||
    new URLSearchParams(window.location.search).has("kiosk")
  );
}

// Null while pre-rendering the static web export: the page renders nothing
// on the server, which also avoids hydration mismatches in clock/weather
const getServerSnapshot = () => null;

// True when the dashboard should fill the whole screen without the Echo Show
// mockup: always on native; on web when installed as a PWA or opened with
// ?kiosk (e.g. Fully Kiosk Browser pointing at the Vercel URL).
export function useKioskMode(): boolean | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
