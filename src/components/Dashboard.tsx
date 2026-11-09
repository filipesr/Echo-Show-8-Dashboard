import { LinearGradient } from "expo-linear-gradient";
import { CalendarClock, Clock3 } from "lucide-react-native";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Agenda from "@/components/Agenda";
import Card from "@/components/Card";
import Clock from "@/components/Clock";
import DailyForecast from "@/components/DailyForecast";
import HourlyForecast from "@/components/HourlyForecast";
import TopBar from "@/components/TopBar";
import WeatherCurrent from "@/components/WeatherCurrent";
import { useAgenda } from "@/hooks/useAgenda";
import { useClock } from "@/hooks/useClock";
import { useSettings } from "@/hooks/useSettings";
import { useWeather } from "@/hooks/useWeather";
import { formatDuration, getNextEvent } from "@/lib/agenda";
import { colors, fonts } from "@/lib/theme";
import { fromNow } from "@/lib/weather";

interface DashboardProps {
  onStartSlideshow: () => void;
}

// Logical size (dp) of the Echo Show 8 screen: 1280x800 px at density 1.33
const WIDTH = 960;
const HEIGHT = 600;

// ISO 8601 week number: weeks start on Monday and week 1 is the one
// containing the year's first Thursday
function isoWeek(date: Date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7)); // Thursday of this week
  const yearStart = Date.UTC(d.getUTCFullYear(), 0, 1);
  return Math.ceil(((d.getTime() - yearStart) / 86400000 + 1) / 7);
}

export default function Dashboard({ onStartSlideshow }: DashboardProps) {
  const { settings } = useSettings();

  // Main city first, then the extra ones (badges in the top bar). The selected
  // one is shown; it goes back to the main city whenever the dashboard loses
  // focus (slideshow, settings), so the wall display defaults to it.
  const cities = [{ name: settings.city, lat: settings.lat, lon: settings.lon }, ...settings.extraCities];
  const [selected, setSelected] = useState(0);
  const city = cities[selected] ?? cities[0]; // the selected city may have been removed
  useFocusEffect(useCallback(() => () => setSelected(0), []));

  const cachedWeather = useWeather(city.lat, city.lon);
  const agenda = useAgenda(settings.agendaUrl);
  const now = useClock("minute");
  const weather = cachedWeather && fromNow(cachedWeather, now);
  const next = agenda && getNextEvent(agenda.events, now);

  // The dashboard is laid out at a fixed 960x600 and scaled to fit its
  // container, so it looks the same on the device and inside the web mockup
  const [scale, setScale] = useState(0);

  return (
    <View
      style={styles.container}
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout;
        setScale(Math.min(width / WIDTH, height / HEIGHT));
      }}
    >
      <LinearGradient
        colors={["#0c1322", "#090d16", "#06080e"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.canvas, { transform: [{ scale }] }]}
      >
        <TopBar
          cities={cities}
          selected={cities.indexOf(city)}
          onSelectCity={setSelected}
          weatherUpdatedAt={cachedWeather?.updatedAt}
          onStartSlideshow={onStartSlideshow}
        />

        <View style={styles.main}>
          <View style={styles.column}>
            <View style={styles.topRow}>
              <Card
                title="Horário local"
                icon={Clock3}
                style={styles.clockCard}
                aside={<Text style={styles.week}>SEM {isoWeek(now)}</Text>}
              >
                <Clock />
                {next && (
                  <View style={styles.nextEvent}>
                    <CalendarClock size={13} color={colors.cyan} />
                    <Text style={styles.nextEventText} numberOfLines={1}>
                      Em {formatDuration(next.minutes)} · {next.event.title}
                    </Text>
                  </View>
                )}
              </Card>
              {weather && <WeatherCurrent weather={weather} />}
            </View>

            {weather ? (
              <>
                <HourlyForecast hourly={weather.hourly} />
                <DailyForecast daily={weather.daily} />
              </>
            ) : (
              <Text style={styles.loading}>Carregando clima…</Text>
            )}
          </View>

          <View style={styles.column}>
            <Agenda agenda={agenda} configured={Boolean(settings.agendaUrl)} now={now} />
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: colors.canvas,
  },
  canvas: { width: WIDTH, height: HEIGHT, flexShrink: 0 },
  main: { flex: 1, flexDirection: "row", gap: 12, padding: 12 },
  column: { flex: 1, gap: 12 },
  topRow: { flexDirection: "row", gap: 12, height: 172 },
  clockCard: { flex: 1 },
  week: {
    color: colors.textMuted,
    fontFamily: fonts.display,
    fontSize: 9,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: "hidden",
    backgroundColor: colors.tile,
    borderWidth: 1,
    borderColor: colors.tileBorder,
  },
  nextEvent: {
    marginTop: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  nextEventText: { flex: 1, color: colors.cyan, fontFamily: fonts.bodyMedium, fontSize: 11 },
  loading: { margin: "auto", color: colors.textFaint, fontFamily: fonts.body, fontSize: 14 },
});
