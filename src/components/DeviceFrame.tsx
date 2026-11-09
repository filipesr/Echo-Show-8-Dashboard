import { LinearGradient } from "expo-linear-gradient";
import { Download } from "lucide-react-native";
import type { ReactNode } from "react";
import { Linking, Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { colors, fonts } from "@/lib/theme";

interface DeviceFrameProps {
  children: ReactNode;
}

const MAX_WIDTH = 1150;

const REPO_URL = "https://github.com/filipesr/Echo-Show-8-Dashboard";
// Always the latest release: the APK asset keeps the same name in every release
const APK_URL = `${REPO_URL}/releases/latest/download/echo-dashboard.apk`;

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
      <Pressable onPress={() => Linking.openURL(APK_URL)} accessibilityRole="link">
        <LinearGradient
          colors={["#06b6d4", "#2563eb"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.download}
        >
          <Download size={18} color="#fff" />
          <Text style={styles.downloadText}>Baixar APK para Android</Text>
        </LinearGradient>
      </Pressable>
      <Text style={styles.hint}>
        Prévia web. No Echo Show (LineageOS), instale o APK com{" "}
        <Text style={styles.code}>adb install</Text> e escolha-o como app de início.{" "}
        <Text style={styles.link} onPress={() => Linking.openURL(REPO_URL)}>
          Instruções no GitHub
        </Text>
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
  download: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 28,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 12,
  },
  downloadText: { color: "#fff", fontFamily: fonts.bodySemiBold, fontSize: 15 },
  hint: {
    marginTop: 14,
    paddingHorizontal: 16,
    textAlign: "center",
    color: colors.textFaint,
    fontFamily: fonts.body,
    fontSize: 12,
  },
  code: { fontFamily: fonts.display, color: colors.textMuted },
  link: { color: colors.cyan, textDecorationLine: "underline" },
});
