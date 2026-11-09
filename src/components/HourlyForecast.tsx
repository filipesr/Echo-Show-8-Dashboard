import { Clock4 } from "lucide-react-native";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Card from "@/components/Card";
import WeatherIcon from "@/components/WeatherIcon";
import { colors, fonts } from "@/lib/theme";
import type { HourlyForecastItem } from "@/types/weather";

interface HourlyForecastProps {
  hourly: HourlyForecastItem[]; // starting at the current hour
}

export default function HourlyForecast({ hourly }: HourlyForecastProps) {
  return (
    <Card title="Próximas horas" icon={Clock4}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {hourly.slice(0, 8).map((item, i) => {
          const now = i === 0;
          const rainy = item.precipitationProbability >= 30;
          return (
            <View key={item.time} style={[styles.item, now && styles.itemNow]}>
              <Text style={now ? styles.labelNow : styles.label}>
                {now ? "AGORA" : `${Number(item.time.slice(11, 13))}h`}
              </Text>
              <WeatherIcon code={item.weatherCode} isDay={item.isDay} size={18} />
              <Text style={styles.temp}>{Math.round(item.temperature)}°</Text>
              <Text style={[styles.rain, rainy && { color: colors.cyan }]}>
                {item.precipitationProbability}%
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexGrow: 1, gap: 6 },
  item: {
    flex: 1,
    minWidth: 48,
    alignItems: "center",
    gap: 3,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: colors.tile,
    borderWidth: 1,
    borderColor: colors.tileBorder,
  },
  itemNow: { backgroundColor: colors.cyanBg, borderColor: colors.cyanBorder },
  label: { color: colors.textMuted, fontFamily: fonts.body, fontSize: 9 },
  labelNow: { color: colors.cyanSoft, fontFamily: fonts.bodyBold, fontSize: 9 },
  temp: { color: colors.text, fontFamily: fonts.displayBold, fontSize: 12 },
  rain: { color: colors.textFaint, fontFamily: fonts.display, fontSize: 8 },
});
