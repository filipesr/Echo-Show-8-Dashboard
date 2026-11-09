"use client";

import { Bell, Calendar, CheckCircle2, Circle, ListChecks } from "lucide-react";
import { useState } from "react";
import { formatDuration, getNextEvent } from "@/lib/agenda";
import { toLocalISO } from "@/lib/weather";
import type { AgendaData, AgendaEvent, EventColor } from "@/types/agenda";

interface AgendaProps {
  agenda: AgendaData | null;
  now: Date;
  className?: string;
}

// Full class names (not built dynamically) so Tailwind can find them
const COLORS: Record<EventColor, { border: string; text: string; badge: string; dot: string }> = {
  cyan: {
    border: "border-l-cyan-400",
    text: "text-cyan-300",
    badge: "bg-cyan-500/15 border-cyan-400/30",
    dot: "bg-cyan-400",
  },
  amber: {
    border: "border-l-amber-400",
    text: "text-amber-300",
    badge: "bg-amber-500/15 border-amber-400/30",
    dot: "bg-amber-400",
  },
  emerald: {
    border: "border-l-emerald-400",
    text: "text-emerald-300",
    badge: "bg-emerald-500/15 border-emerald-400/30",
    dot: "bg-emerald-400",
  },
  indigo: {
    border: "border-l-indigo-400",
    text: "text-indigo-300",
    badge: "bg-indigo-500/15 border-indigo-400/30",
    dot: "bg-indigo-400",
  },
};

const colorOf = (event: AgendaEvent) => COLORS[event.color ?? "cyan"] ?? COLORS.cyan;

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

export default function Agenda({ agenda, now, className = "" }: AgendaProps) {
  // Null means "today", so the selection follows the date across midnight
  const [selected, setSelected] = useState<string | null>(null);

  const today = toLocalISO(now).slice(0, 10);
  const day = selected ?? today;

  const events = agenda?.events ?? [];
  const reminders = agenda?.reminders ?? [];
  const byTime = (a: AgendaEvent, b: AgendaEvent) => a.time.localeCompare(b.time);
  const dayEvents = events.filter((e) => e.date === day).sort(byTime);
  const todayCount = events.filter((e) => e.date === today).length;
  const next = getNextEvent(events, now);

  const doneCount = reminders.filter((r) => r.done).length;

  return (
    <section className={`panel flex flex-col rounded-2xl p-4 ${className}`}>
      <header className="flex items-center justify-between border-b border-white/5 pb-3">
        <h2 className="flex items-center gap-2 text-sm font-bold tracking-wider text-slate-100 uppercase">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-cyan-400" />
          Agenda da semana
        </h2>
        <span className="flex items-center gap-1.5 rounded-md border border-cyan-800/40 bg-cyan-950/60 px-2.5 py-0.5 font-display text-xs text-cyan-300">
          <Calendar className="h-3.5 w-3.5" aria-hidden />
          {formatMonth(now)}
        </span>
      </header>

      <div className="grid grid-cols-7 gap-1.5 py-3">
        {weekDays(now).map((date) => {
          const iso = toLocalISO(date).slice(0, 10);
          const active = iso === day;
          const first = events.find((e) => e.date === iso);
          return (
            <button
              key={iso}
              type="button"
              onClick={() => setSelected(iso === today ? null : iso)}
              className={`flex flex-col items-center rounded-xl py-2 ${
                active ? "glow-cyan border border-cyan-400 bg-cyan-500/20" : "tile"
              }`}
            >
              <span
                className={`text-[11px] uppercase ${active ? "font-bold text-cyan-300" : "text-slate-400"}`}
              >
                {weekdayFormat.format(date).replace(".", "")}
              </span>
              <span className="font-display text-base font-bold">{date.getDate()}</span>
              <span className={`mt-1 h-1.5 w-1.5 rounded-full ${first ? colorOf(first).dot : ""}`} />
            </button>
          );
        })}
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto">
        {!agenda && (
          <p className="pt-8 text-center text-sm text-slate-500">
            Configure NEXT_PUBLIC_AGENDA_URL para ver sua agenda.
          </p>
        )}
        {agenda && dayEvents.length === 0 && (
          <p className="pt-8 text-center text-sm text-slate-500">Nenhum compromisso.</p>
        )}
        {dayEvents.map((event) => {
          const color = colorOf(event);
          const tag = event === next?.event ? `Em ${formatDuration(next.minutes)}` : event.tag;
          return (
            <div
              key={`${event.date}-${event.time}-${event.title}`}
              className={`flex items-center justify-between gap-3 rounded-xl border border-l-4 border-white/5 bg-white/[0.04] px-3 py-2.5 ${color.border}`}
            >
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className={`rounded bg-black/30 px-2 py-0.5 font-display text-sm font-bold tabular-nums ${color.text}`}
                >
                  {event.time}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-semibold text-white">{event.title}</p>
                  {event.subtitle && (
                    <p className="truncate text-xs text-slate-400">{event.subtitle}</p>
                  )}
                </div>
              </div>
              {tag && (
                <span
                  className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${color.text} ${color.badge}`}
                >
                  {tag}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {reminders.length > 0 && (
        <div className="mt-3 border-t border-white/5 pt-3">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-bold text-slate-400 uppercase">
              <ListChecks className="h-3.5 w-3.5 text-cyan-400" aria-hidden />
              Lembretes
            </span>
            <span className="font-display text-slate-500">
              {doneCount} de {reminders.length} concluídos
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[13px]">
            {reminders.slice(0, 4).map((reminder) => (
              <div key={reminder.text} className="tile flex items-center gap-2 rounded-lg p-1.5">
                {reminder.done ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" aria-label="Concluído" />
                ) : (
                  <Circle className="h-4 w-4 shrink-0 text-amber-400" aria-label="Pendente" />
                )}
                <span
                  className={`truncate ${reminder.done ? "text-slate-400 line-through" : "font-medium text-slate-200"}`}
                >
                  {reminder.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {agenda && (
        <footer className="mt-3 flex items-center justify-between border-t border-white/5 pt-3 text-[13px] text-slate-300">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-cyan-400" aria-hidden />
            {todayCount} compromisso{todayCount === 1 ? "" : "s"} hoje
          </span>
          {next && (
            <span className="flex items-center gap-1 rounded bg-cyan-950/40 px-2 py-0.5 font-display text-xs text-cyan-400">
              <Bell className="h-3.5 w-3.5" aria-hidden />
              Próximo em {formatDuration(next.minutes)}
            </span>
          )}
        </footer>
      )}
    </section>
  );
}
