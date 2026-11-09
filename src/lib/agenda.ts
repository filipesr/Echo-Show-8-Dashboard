import { toLocalISO } from "@/lib/weather";
import type { AgendaData, AgendaEvent } from "@/types/agenda";

// Expects { events: AgendaEvent[], reminders: Reminder[] } (see docs/agenda.example.json).
// Missing lists are treated as empty so a partial file still renders.
export async function fetchAgenda(url: string): Promise<AgendaData> {
  // no-store: the file is edited by hand and should show up on the next poll
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Agenda error: ${res.status}`);
  const data = await res.json();

  return {
    events: Array.isArray(data.events) ? data.events : [],
    reminders: Array.isArray(data.reminders) ? data.reminders : [],
    updatedAt: Date.now(),
  };
}

// Next event today: the first one whose "HH:MM" is still ahead of now.
// Returns how many minutes are left until it starts.
export function getNextEvent(
  events: AgendaEvent[],
  now: Date
): { event: AgendaEvent; minutes: number } | null {
  const today = toLocalISO(now).slice(0, 10);
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const toMinutes = (time: string) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5));

  const event = events
    .filter((e) => e.date === today && toMinutes(e.time) > currentMinutes)
    .sort((a, b) => a.time.localeCompare(b.time))[0];

  return event ? { event, minutes: toMinutes(event.time) - currentMinutes } : null;
}

// 54 -> "54 min", 80 -> "1h 20min"
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const rest = minutes % 60;
  return `${Math.floor(minutes / 60)}h${rest ? ` ${rest}min` : ""}`;
}
