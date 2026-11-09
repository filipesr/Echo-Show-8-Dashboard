import { LinearGradient } from "expo-linear-gradient";
import { CalendarDays } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import Card from "@/components/Card";
import WeatherIcon from "@/components/WeatherIcon";
import { colors, fonts } from "@/lib/theme";
import { CONDITION_LABELS, getCondition } from "@/lib/weather";
import type { DailyForecastItem } from "@/types/weather";

interface DailyForecastProps {
  daily: DailyForecastItem[]; // starting today
}

const weekdayFormat = new Intl.DateTimeFormat("pt-BR", { weekday: "long" });
const shortWeekdayFormat = new Intl.DateTimeFormat("pt-BR", { weekday: "short" });

// "2026-11-10" -> "Terça-feira" (or "Ter" when short)
function formatWeekday(date: string, short = false) {
  // Noon avoids the date shifting a day due to timezone parsing
  const format = short ? shortWeekdayFormat : weekdayFormat;
  const text = format.format(new Date(`${date}T12:00`)).replace(".", "");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export default function DailyForecast({ daily }: DailyForecastProps) {
  const days = daily.slice(0, 5); // today + next 4 days

  // Bars share one scale, from the lowest min to the highest max of the
  // period, so each bar's position and width show how the days compare
  const low = Math.min(...days.map((d) => d.temperatureMin));
  const high = Math.max(...days.map((d) => d.temperatureMax));
  const range = high - low || 1;

  return (
    <Card
      title="Próximos dias"
      icon={CalendarDays}
      style={styles.card}
      aside={<Text style={styles.aside}>Mín / Máx</Text>}
    >
      <View style={styles.list}>
        {days.map((item, i) => (
          <View key={item.date} style={styles.row}>
            <View style={styles.day}>
              {i === 0 ? (
                <Text style={styles.today}>
                  Hoje <Text style={styles.todayShort}>{formatWeekday(item.date, true)}</Text>
                </Text>
              ) : (
                <Text style={styles.dayText}>{formatWeekday(item.date)}</Text>
              )}
            </View>
            <View style={styles.condition}>
              <WeatherIcon code={item.weatherCode} size={15} />
              <Text style={styles.conditionText}>{CONDITION_LABELS[getCondition(item.weatherCode)]}</Text>
            </View>
            <Text style={styles.min}>{Math.round(item.temperatureMin)}°</Text>
            <View style={styles.track}>
              <LinearGradient
                colors={[colors.cyan, colors.amber]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[
                  styles.bar,
                  {
                    left: `${((item.temperatureMin - low) / range) * 100}%`,
                    width: `${((item.temperatureMax - item.temperatureMin) / range) * 100}%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.max}>{Math.round(item.temperatureMax)}°</Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1 },
  aside: { color: colors.textMuted, fontFamily: fonts.body, fontSize: 9 },
  list: { flex: 1, gap: 5 },
  row: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: colors.tile,
    borderWidth: 1,
    borderColor: colors.tileBorder,
  },
  day: { width: 84 },
  dayText: { color: colors.textSecondary, fontFamily: fonts.bodyMedium, fontSize: 11 },
  today: { color: colors.cyan, fontFamily: fonts.bodyBold, fontSize: 11 },
  todayShort: { color: colors.textFaint, fontFamily: fonts.body, fontSize: 9 },
  condition: { flex: 1, flexDirection: "row", alignItems: "center", gap: 6 },
  conditionText: { color: colors.textMuted, fontFamily: fonts.body, fontSize: 10 },
  min: { width: 24, textAlign: "right", color: colors.textMuted, fontFamily: fonts.display, fontSize: 11 },
  max: { width: 24, color: colors.text, fontFamily: fonts.displayBold, fontSize: 11 },
  track: { width: 84, height: 5, borderRadius: 3, backgroundColor: "#1e293b" },
  bar: { position: "absolute", top: 0, bottom: 0, borderRadius: 3 },
});
