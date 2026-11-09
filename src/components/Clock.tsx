import { StyleSheet, Text, View } from "react-native";
import { useClock } from "@/hooks/useClock";
import { colors, fonts } from "@/lib/theme";

interface ClockProps {
  size?: "large" | "small";
}

const pad = (n: number) => String(n).padStart(2, "0");

const dateFormat = new Intl.DateTimeFormat("pt-BR", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

// "segunda-feira, 9 de novembro" -> "Segunda-feira, 9 de novembro"
function formatDate(date: Date) {
  const text = dateFormat.format(date);
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export default function Clock({ size = "large" }: ClockProps) {
  const now = useClock();
  const large = size === "large";

  return (
    <View style={!large && styles.alignRight}>
      <View style={styles.row}>
        <Text style={large ? styles.timeLarge : styles.timeSmall}>
          {pad(now.getHours())}:{pad(now.getMinutes())}
        </Text>
        {large && <Text style={styles.seconds}>:{pad(now.getSeconds())}</Text>}
      </View>
      <Text style={large ? styles.dateLarge : styles.dateSmall}>{formatDate(now)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  alignRight: { alignItems: "flex-end" },
  row: { flexDirection: "row", alignItems: "baseline" },
  timeLarge: {
    color: colors.text,
    fontFamily: fonts.displayBold,
    fontSize: 58,
    lineHeight: 62,
    letterSpacing: -1.5,
    fontVariant: ["tabular-nums"],
  },
  seconds: {
    color: colors.cyan,
    fontFamily: fonts.displayBold,
    fontSize: 22,
    marginLeft: 4,
    fontVariant: ["tabular-nums"],
  },
  timeSmall: {
    color: "rgba(255, 255, 255, 0.7)",
    fontFamily: fonts.displayBold,
    fontSize: 36,
    fontVariant: ["tabular-nums"],
  },
  dateLarge: { color: colors.textSecondary, fontFamily: fonts.bodyMedium, fontSize: 12, marginTop: 4 },
  dateSmall: { color: "rgba(255, 255, 255, 0.7)", fontFamily: fonts.body, fontSize: 13 },
});
