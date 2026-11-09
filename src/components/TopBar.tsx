import { LinearGradient } from "expo-linear-gradient";
import { Image as ImageIcon, RefreshCw } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useClock } from "@/hooks/useClock";
import { colors, fonts } from "@/lib/theme";

interface TopBarProps {
  city: string;
  weatherUpdatedAt?: number;
  onStartSlideshow: () => void;
}

// Weather refreshes every 15 min; past this it is considered out of date
const STALE_MS = 30 * 60 * 1000;

const timeFormat = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" });

export default function TopBar({ city, weatherUpdatedAt, onStartSlideshow }: TopBarProps) {
  const now = useClock("minute");
  const stale = !weatherUpdatedAt || now.getTime() - weatherUpdatedAt > STALE_MS;
  const statusColor = stale ? colors.amberSoft : colors.cyanSoft;

  return (
    <View style={styles.bar}>
      <View style={styles.pill}>
        <View style={styles.dot} />
        <Text style={styles.city}>{city}</Text>
      </View>

      <View style={styles.right}>
        <View style={styles.status}>
          <RefreshCw size={12} color={statusColor} />
          <Text style={[styles.statusText, { color: statusColor }]}>
            {weatherUpdatedAt
              ? `${stale ? "Desatualizado" : "Atualizado"} ${timeFormat.format(weatherUpdatedAt)}`
              : "Sincronizando…"}
          </Text>
        </View>
        <Pressable onPress={onStartSlideshow}>
          <LinearGradient
            colors={["#06b6d4", "#2563eb"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            <ImageIcon size={14} color="#fff" />
            <Text style={styles.buttonText}>Iniciar Photo-Slide</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: colors.tile,
    borderWidth: 1,
    borderColor: colors.tileBorder,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.cyan },
  city: { color: colors.text, fontFamily: fonts.bodySemiBold, fontSize: 12 },
  right: { flexDirection: "row", alignItems: "center", gap: 8 },
  status: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: colors.tile,
    borderWidth: 1,
    borderColor: colors.tileBorder,
  },
  statusText: { fontFamily: fonts.body, fontSize: 11 },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  buttonText: { color: "#fff", fontFamily: fonts.bodySemiBold, fontSize: 12 },
});
