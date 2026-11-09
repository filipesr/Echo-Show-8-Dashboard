import { ArrowDown, ArrowUp, Thermometer } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import Card from "@/components/Card";
import WeatherIcon from "@/components/WeatherIcon";
import { colors, fonts } from "@/lib/theme";
import { CONDITION_LABELS, getCondition } from "@/lib/weather";
import type { WeatherData } from "@/types/weather";

interface WeatherCurrentProps {
  weather: WeatherData; // already trimmed with fromNow()
}

export default function WeatherCurrent({ weather }: WeatherCurrentProps) {
  const { current } = weather;
  // First items are the current hour and today (see fromNow)
  const today = weather.daily[0];
  const rainChance = weather.hourly[0]?.precipitationProbability ?? 0;

  const metrics = [
    { label: "Vento", value: `${Math.round(current.windSpeed)} km/h`, color: colors.textSecondary },
    { label: "Chuva", value: `${rainChance}%`, color: colors.cyanSoft },
    { label: "Umidade", value: `${Math.round(current.humidity)}%`, color: colors.amberSoft },
  ];

  return (
    <Card
      title="Clima"
      icon={Thermometer}
      style={styles.card}
      aside={
        <Text style={styles.badge} numberOfLines={1}>
          {CONDITION_LABELS[getCondition(current.weatherCode)]}
        </Text>
      }
    >
      <View style={styles.main}>
        <View style={styles.row}>
          <WeatherIcon code={current.weatherCode} isDay={current.isDay} size={42} />
          <View>
            <Text style={styles.temp}>
              {Math.round(current.temperature)}
              <Text style={styles.unit}>°C</Text>
            </Text>
            <Text style={styles.feels}>
              Sensação{" "}
              <Text style={styles.feelsValue}>{Math.round(current.apparentTemperature)}°</Text>
            </Text>
          </View>
        </View>
        {today && (
          <View style={styles.minMax}>
            <View style={styles.row}>
              <ArrowUp size={11} color={colors.rose} />
              <Text style={[styles.minMaxText, { color: colors.rose }]}>
                {Math.round(today.temperatureMax)}°
              </Text>
            </View>
            <View style={styles.row}>
              <ArrowDown size={11} color={colors.cyan} />
              <Text style={[styles.minMaxText, { color: colors.cyan }]}>
                {Math.round(today.temperatureMin)}°
              </Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.metrics}>
        {metrics.map((metric) => (
          <View key={metric.label} style={styles.metric}>
            <Text style={styles.metricLabel}>{metric.label}</Text>
            <Text style={[styles.metricValue, { color: metric.color }]}>{metric.value}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1 },
  badge: {
    flexShrink: 1,
    color: colors.cyanSoft,
    fontFamily: fonts.bodySemiBold,
    fontSize: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    overflow: "hidden",
    backgroundColor: "rgba(8, 51, 68, 0.6)",
    borderWidth: 1,
    borderColor: "rgba(21, 94, 117, 0.4)",
  },
  main: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  temp: {
    color: colors.text,
    fontFamily: fonts.displayBold,
    fontSize: 46,
    lineHeight: 50,
    fontVariant: ["tabular-nums"],
  },
  unit: { color: colors.textMuted, fontFamily: fonts.body, fontSize: 18 },
  feels: { color: colors.textMuted, fontFamily: fonts.body, fontSize: 11 },
  feelsValue: { color: colors.textSecondary, fontFamily: fonts.bodySemiBold },
  minMax: { gap: 4, alignItems: "flex-end" },
  minMaxText: { fontFamily: fonts.displayBold, fontSize: 12 },
  metrics: {
    flexDirection: "row",
    gap: 6,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  metric: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: colors.tile,
    borderWidth: 1,
    borderColor: colors.tileBorder,
  },
  metricLabel: { color: colors.textMuted, fontFamily: fonts.body, fontSize: 8, textTransform: "uppercase" },
  metricValue: { fontFamily: fonts.displayBold, fontSize: 11 },
});
