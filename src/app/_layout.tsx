import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from "@expo-google-fonts/plus-jakarta-sans";
import { SpaceGrotesk_500Medium, SpaceGrotesk_700Bold } from "@expo-google-fonts/space-grotesk";
import { useFonts } from "expo-font";
import { useKeepAwake } from "expo-keep-awake";
import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform } from "react-native";
import { SettingsProvider, useSettings } from "@/hooks/useSettings";
import { colors, fonts } from "@/lib/theme";

export default function RootLayout() {
  // A wall display: never turn the screen off
  useKeepAwake();

  const [fontsLoaded] = useFonts({
    [fonts.display]: SpaceGrotesk_500Medium,
    [fonts.displayBold]: SpaceGrotesk_700Bold,
    [fonts.body]: PlusJakartaSans_400Regular,
    [fonts.bodyMedium]: PlusJakartaSans_500Medium,
    [fonts.bodySemiBold]: PlusJakartaSans_600SemiBold,
    [fonts.bodyBold]: PlusJakartaSans_700Bold,
  });

  // Immersive fullscreen: hide the Android navigation bar
  // (a swipe from the edge shows it temporarily)
  useEffect(() => {
    if (Platform.OS === "android") NavigationBar.setVisibilityAsync("hidden");
  }, []);

  return (
    <SettingsProvider>
      <StatusBar hidden style="light" />
      {fontsLoaded && <Screens />}
    </SettingsProvider>
  );
}

// Waits for the stored settings, so the dashboard doesn't fetch the
// default city's weather before switching to the configured one
function Screens() {
  const { loaded } = useSettings();
  if (!loaded) return null;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade",
        contentStyle: { backgroundColor: colors.canvas },
      }}
    />
  );
}
