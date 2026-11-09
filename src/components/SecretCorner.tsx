import { useRef } from "react";
import { Pressable, StyleSheet } from "react-native";

interface SecretCornerProps {
  onUnlock: () => void;
}

const TAPS = 5;
const WINDOW_MS = 3000;

// Invisible touch area in the top-left corner. Tapping it 5 times within
// 3 seconds calls onUnlock: the "emergency exit" to reach the settings,
// since the Echo Show has no navigation buttons and this app is the launcher.
export default function SecretCorner({ onUnlock }: SecretCornerProps) {
  const taps = useRef<number[]>([]);

  function handlePress() {
    const now = Date.now();
    taps.current = [...taps.current.filter((t) => now - t < WINDOW_MS), now];
    if (taps.current.length >= TAPS) {
      taps.current = [];
      onUnlock();
    }
  }

  // collapsable={false} keeps this empty view as a real native view
  return <Pressable onPress={handlePress} style={styles.corner} collapsable={false} />;
}

const styles = StyleSheet.create({
  corner: { position: "absolute", top: 0, left: 0, width: 80, height: 80, zIndex: 10 },
});
