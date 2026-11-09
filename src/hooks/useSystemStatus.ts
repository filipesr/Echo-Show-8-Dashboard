import { useNetInfo } from "@react-native-community/netinfo";
import * as Brightness from "expo-brightness";
import { useCallback, useEffect, useState } from "react";
import { Platform } from "react-native";
import { VolumeManager } from "react-native-volume-manager";

export interface SystemStatus {
  brightness: number | "auto" | null; // 0..1 system brightness, or automatic mode
  volume: number | null; // 0..1, media volume
  wifi: { connected: boolean; strength: number | null }; // strength 0..100
  setBrightness: (value: number) => Promise<void>;
  setVolume: (value: number) => Promise<void>;
}

const clamp = (value: number) => Math.min(1, Math.max(0, value));

// Device brightness, media volume and Wi-Fi state (Android only;
// on web the values stay null and the setters do nothing).
export function useSystemStatus(): SystemStatus {
  const [brightness, setBrightnessState] = useState<number | "auto" | null>(null);
  const [volume, setVolumeState] = useState<number | null>(null);
  const netInfo = useNetInfo();

  useEffect(() => {
    if (Platform.OS !== "android") return;

    // In automatic mode expo-brightness reads "screen_auto_brightness_adj",
    // which LineageOS doesn't have, so the read fails: show "auto" instead
    Brightness.getSystemBrightnessAsync()
      .then(setBrightnessState)
      .catch(() => setBrightnessState("auto"));
    VolumeManager.getVolume().then((result) => setVolumeState(result.volume));

    // Hardware buttons or other apps can change the volume too
    const subscription = VolumeManager.addVolumeListener((result) =>
      setVolumeState(result.volume)
    );
    return () => subscription.remove();
  }, []);

  const setBrightness = useCallback(async (value: number) => {
    if (Platform.OS !== "android") return;
    // Changing the system brightness needs WRITE_SETTINGS, a special
    // permission granted once on an Android settings screen
    const { granted } = await Brightness.requestPermissionsAsync();
    if (!granted) return;
    await Brightness.setSystemBrightnessAsync(clamp(value));
    setBrightnessState(clamp(value));
  }, []);

  const setVolume = useCallback(async (value: number) => {
    if (Platform.OS !== "android") return;
    await VolumeManager.setVolume(clamp(value), { showUI: false });
    setVolumeState(clamp(value));
  }, []);

  const details = netInfo.type === "wifi" ? netInfo.details : null;

  return {
    brightness,
    volume,
    wifi: {
      connected: netInfo.type === "wifi" && netInfo.isConnected === true,
      strength: details?.strength ?? null,
    },
    setBrightness,
    setVolume,
  };
}
