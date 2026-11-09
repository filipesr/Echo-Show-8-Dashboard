import { Bell, Calendar, CheckCircle2, Circle, ListChecks } from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { formatDuration, getNextEvent } from "@/lib/agenda";
import { colors, fonts } from "@/lib/theme";
import { toLocalISO } from "@/lib/weather";
import type { AgendaData, AgendaEvent, EventColor } from "@/types/agenda";

interface AgendaProps {
  agenda: AgendaData | null;
  configured: boolean; // an agenda URL is set
  now: Date;
}

const EVENT_COLORS: Record<EventColor, string> = {
  cyan: colors.cyan,
  amber: colors.amber,
  emerald: colors.emerald,
  indigo: colors.indigo,
};

const colorOf = (event: AgendaEvent) => EVENT_COLORS[event.color ?? "cyan"] ?? colors.cyan;

const monthFormat = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" });
const weekdayFormat = new Intl.DateTimeFormat("pt-BR", { weekday: "short" });

// "novembro de 2026" -> "Novembro 2026"
function formatMonth(date: Date) {
  const text = monthFormat.format(date).replace(" de ", " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Monday to Sunday of the week containing `date`
function weekDays(date: Date) {
  const monday = new Date(date);
  monday.setDate(date.getDate() - ((date.getDay() + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    return day;
  });
}

export default function Agenda({ agenda, configured, now }: AgendaProps) {
  // Null means "today", so the selection follows the date across midnight
  const [selected, setSelected] = useState<string | null>(null);

  const today = toLocalISO(now).slice(0, 10);
  const day = selected ?? today;

  const events = agenda?.events ?? [];
  const reminders = agenda?.reminders ?? [];
  const dayEvents = events.filter((e) => e.date === day).sort((a, b) => a.time.localeCompare(b.time));
  const todayCount = events.filter((e) => e.date === today).length;
  const next = getNextEvent(events, now);
  const doneCount = reminders.filter((r) => r.done).length;

  return (
    <View style={styles.panel}>
      <View style={styles.header}>
        <View style={styles.title}>
          <View style={styles.dot} />
          <Text style={styles.titleText}>AGENDA DA SEMANA</Text>
        </View>
        <View style={styles.month}>
          <Calendar size={11} color={colors.cyanSoft} />
          <Text style={styles.monthText}>{formatMonth(now)}</Text>
        </View>
      </View>

      <View style={styles.week}>
        {weekDays(now).map((date) => {
          const iso = toLocalISO(date).slice(0, 10);
          const active = iso === day;
          const first = events.find((e) => e.date === iso);
          return (
            <Pressable
              key={iso}
              onPress={() => setSelected(iso === today ? null : iso)}
              style={[styles.weekDay, active && styles.weekDayActive]}
            >
              <Text style={[styles.weekDayName, active && styles.weekDayNameActive]}>
                {weekdayFormat.format(date).replace(".", "").toUpperCase()}
              </Text>
              <Text style={styles.weekDayNumber}>{date.getDate()}</Text>
              <View style={[styles.eventDot, first && { backgroundColor: colorOf(first) }]} />
            </Pressable>
          );
        })}
      </View>

      <ScrollView style={styles.events} contentContainerStyle={styles.eventsContent}>
        {!configured && (
          <Text style={styles.empty}>Configure a URL da agenda nas configurações.</Text>
        )}
        {configured && dayEvents.length === 0 && <Text style={styles.empty}>Nenhum compromisso.</Text>}
        {dayEvents.map((event) => {
          const color = colorOf(event);
          const tag = event === next?.event ? `Em ${formatDuration(next.minutes)}` : event.tag;
          return (
            <View key={`${event.date}-${event.time}-${event.title}`} style={[styles.event, { borderLeftColor: color }]}>
              <Text style={[styles.eventTime, { color }]}>{event.time}</Text>
              <View style={styles.eventBody}>
                <Text style={styles.eventTitle} numberOfLines={1}>{event.title}</Text>
                {event.subtitle && <Text style={styles.eventSubtitle} numberOfLines={1}>{event.subtitle}</Text>}
              </View>
              {tag && <Text style={[styles.tag, { color, borderColor: color }]}>{tag}</Text>}
            </View>
          );
        })}
      </ScrollView>

      {reminders.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.title}>
              <ListChecks size={11} color={colors.cyan} />
              <Text style={styles.sectionTitle}>LEMBRETES</Text>
            </View>
            <Text style={styles.sectionAside}>
              {doneCount} de {reminders.length} concluídos
            </Text>
          </View>
          <View style={styles.reminders}>
            {reminders.slice(0, 4).map((reminder) => (
              <View key={reminder.text} style={styles.reminder}>
                {reminder.done ? (
                  <CheckCircle2 size={13} color={colors.emerald} accessibilityLabel="Concluído" />
                ) : (
                  <Circle size={13} color={colors.amber} accessibilityLabel="Pendente" />
                )}
                <Text style={[styles.reminderText, reminder.done && styles.reminderDone]} numberOfLines={1}>
                  {reminder.text}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {configured && (
        <View style={[styles.section, styles.footer]}>
          <View style={styles.title}>
            <CheckCircle2 size={13} color={colors.cyan} />
            <Text style={styles.footerText}>
              {todayCount} compromisso{todayCount === 1 ? "" : "s"} hoje
            </Text>
          </View>
          {next && (
            <View style={styles.next}>
              <Bell size={11} color={colors.cyan} />
              <Text style={styles.nextText}>Próximo em {formatDuration(next.minutes)}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    backgroundColor: colors.panel,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  title: { flexDirection: "row", alignItems: "center", gap: 6 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.cyan },
  titleText: { color: colors.text, fontFamily: fonts.bodyBold, fontSize: 11, letterSpacing: 1 },
  month: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: "rgba(8, 51, 68, 0.6)",
    borderWidth: 1,
    borderColor: "rgba(21, 94, 117, 0.4)",
  },
  monthText: { color: colors.cyanSoft, fontFamily: fonts.display, fontSize: 10 },
  week: { flexDirection: "row", gap: 5, paddingVertical: 8 },
  weekDay: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: colors.tile,
    borderWidth: 1,
    borderColor: colors.tileBorder,
  },
  weekDayActive: { backgroundColor: "rgba(6, 182, 212, 0.2)", borderColor: colors.cyan },
  weekDayName: { color: colors.textMuted, fontFamily: fonts.body, fontSize: 8 },
  weekDayNameActive: { color: colors.cyanSoft, fontFamily: fonts.bodyBold },
  weekDayNumber: { color: colors.text, fontFamily: fonts.displayBold, fontSize: 12 },
  eventDot: { width: 4, height: 4, borderRadius: 2, marginTop: 3 },
  events: { flex: 1 },
  eventsContent: { gap: 6 },
  empty: { color: colors.textFaint, fontFamily: fonts.body, fontSize: 11, textAlign: "center", paddingTop: 24 },
  event: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderLeftWidth: 3,
    borderColor: colors.tileBorder,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
  },
  eventTime: {
    fontFamily: fonts.displayBold,
    fontSize: 11,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: "hidden",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  eventBody: { flex: 1 },
  eventTitle: { color: colors.text, fontFamily: fonts.bodySemiBold, fontSize: 12 },
  eventSubtitle: { color: colors.textMuted, fontFamily: fonts.body, fontSize: 9 },
  tag: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 9,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
    overflow: "hidden",
  },
  section: { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: colors.divider },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  sectionTitle: { color: colors.textMuted, fontFamily: fonts.bodyBold, fontSize: 9 },
  sectionAside: { color: colors.textFaint, fontFamily: fonts.display, fontSize: 9 },
  reminders: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  reminder: {
    width: "48.5%",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: 5,
    borderRadius: 8,
    backgroundColor: colors.tile,
    borderWidth: 1,
    borderColor: colors.tileBorder,
  },
  reminderText: { flex: 1, color: colors.textSecondary, fontFamily: fonts.bodyMedium, fontSize: 10 },
  reminderDone: { color: colors.textMuted, textDecorationLine: "line-through" },
  footer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  footerText: { color: colors.textSecondary, fontFamily: fonts.body, fontSize: 10 },
  next: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: "rgba(8, 51, 68, 0.4)",
  },
  nextText: { color: colors.cyan, fontFamily: fonts.display, fontSize: 9 },
});
