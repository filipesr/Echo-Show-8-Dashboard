import { LinearGradient } from "expo-linear-gradient";
import { Image as ImageIcon, RefreshCw } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useClock } from "@/hooks/useClock";
import type { City } from "@/lib/settings";
import { colors, fonts } from "@/lib/theme";

interface TopBarProps {
  cities: City[]; // main city first, then the extra ones
  selected: number; // index of the city whose weather is shown
  onSelectCity: (index: number) => void;
  weatherUpdatedAt?: number;
  onStartSlideshow: () => void;
}

// Weather refreshes every 15 min; past this it is considered out of date
const STALE_MS = 30 * 60 * 1000;

const timeFormat = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" });

export default function TopBar({
  cities,
  selected,
  onSelectCity,
  weatherUpdatedAt,
  onStartSlideshow,
}: TopBarProps) {
  const now = useClock("minute");
  const stale = !weatherUpdatedAt || now.getTime() - weatherUpdatedAt > STALE_MS;
  const statusColor = stale ? colors.amberSoft : colors.cyanSoft;

  return (
    <View style={styles.bar}>
      <View style={styles.cities}>
        {cities.map((city, i) => {
          const active = i === selected;
          return (
            <Pressable
              key={`${city.lat},${city.lon}`}
              onPress={() => onSelectCity(i)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              style={[styles.pill, active && styles.pillActive]}
            >
              {active && <View style={styles.dot} />}
              <Text style={[styles.city, active && styles.cityActive]}>{city.name}</Text>
            </Pressable>
          );
        })}
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
  cities: { flexDirection: "row", alignItems: "center", gap: 6 },
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
  pillActive: { backgroundColor: colors.cyanBg, borderColor: colors.cyanBorder },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.cyan },
  city: { color: colors.textMuted, fontFamily: fonts.bodyMedium, fontSize: 12 },
  cityActive: { color: colors.text, fontFamily: fonts.bodySemiBold },
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
