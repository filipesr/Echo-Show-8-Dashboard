import { LinearGradient } from "expo-linear-gradient";
import type { ReactNode } from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { colors, fonts } from "@/lib/theme";

interface DeviceFrameProps {
  children: ReactNode;
}

const MAX_WIDTH = 1150;

// Web preview: draws an Echo Show 8 (chassis, camera, speaker base)
// with the live dashboard inside its 16:10 screen
export default function DeviceFrame({ children }: DeviceFrameProps) {
  const { width: windowWidth } = useWindowDimensions();
  const width = Math.min(windowWidth - 32, MAX_WIDTH);
  const bezel = width * 0.018;

  return (
    <View style={styles.page}>
      <View style={[styles.chassis, { width, padding: bezel, borderRadius: width * 0.03 }]}>
        <View style={[styles.camera, { top: bezel * 0.3 }]}>
          <View style={styles.mic} />
          <View style={styles.lens} />
          <View style={styles.mic} />
        </View>
        <View style={[styles.screen, { borderRadius: width * 0.015 }]}>{children}</View>
      </View>
      <LinearGradient
        colors={["#1e293b", "#0f172a", "#020617"]}
        style={[styles.stand, { width: width * 0.6 }]}
      />
      <Text style={styles.hint}>
        Prévia web. No Echo Show, instale o APK como launcher — veja o README.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
    backgroundColor: colors.canvas,
  },
  chassis: {
    backgroundColor: "#11141c",
    borderWidth: 4,
    borderColor: "#242b3d",
    boxShadow: "0 25px 65px -12px rgba(0, 0, 0, 0.95)",
  },
  camera: {
    position: "absolute",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  mic: { width: 4, height: 4, borderRadius: 2, backgroundColor: "#334155" },
  lens: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "#475569",
  },
  screen: { aspectRatio: 16 / 10, overflow: "hidden", borderWidth: 1, borderColor: "rgba(0,0,0,0.6)" },
  stand: { height: 32, marginTop: -2, borderBottomLeftRadius: 16, borderBottomRightRadius: 16, opacity: 0.9 },
  hint: { marginTop: 24, color: colors.textFaint, fontFamily: fonts.body, fontSize: 12 },
});
