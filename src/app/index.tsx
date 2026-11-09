import { router, useFocusEffect } from "expo-router";
import { useCallback, useRef } from "react";
import { StyleSheet, View } from "react-native";
import Dashboard from "@/components/Dashboard";
import DeviceFrame from "@/components/DeviceFrame";
import SecretCorner from "@/components/SecretCorner";
import { useKioskMode } from "@/hooks/useKioskMode";

const IDLE_TIMEOUT_MS = 5 * 60 * 1000;

// Home screen (the launcher on Android). Starts the photo slideshow after
// 5 minutes without interaction; 5 taps on the top-left corner open settings.
export default function Home() {
  const kiosk = useKioskMode();
  const idleTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const startSlideshow = useCallback(() => router.push("/slideshow"), []);

  // Every interaction clears the pending timer and starts a new one, so the
  // timeout only fires after a full uninterrupted period of inactivity
  const resetIdleTimer = useCallback(() => {
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(startSlideshow, IDLE_TIMEOUT_MS);
  }, [startSlideshow]);

  // Only count down while this screen is visible (not over the
  // slideshow or settings); restarts when coming back
  useFocusEffect(
    useCallback(() => {
      resetIdleTimer();
      return () => clearTimeout(idleTimer.current);
    }, [resetIdleTimer])
  );

  if (kiosk === null) return null; // pre-rendering the static web export

  const dashboard = (
    <View style={styles.screen} onTouchStart={resetIdleTimer} onPointerDown={resetIdleTimer}>
      <Dashboard onStartSlideshow={startSlideshow} />
      <SecretCorner onUnlock={() => router.push("/settings")} />
    </View>
  );

  return kiosk ? dashboard : <DeviceFrame>{dashboard}</DeviceFrame>;
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
});
