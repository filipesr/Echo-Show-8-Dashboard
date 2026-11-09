export type EventColor = "cyan" | "amber" | "emerald" | "indigo";

export interface AgendaEvent {
  date: string; // local ISO date, e.g. "2026-11-09"
  time: string; // 24h, e.g. "10:00"
  title: string;
  subtitle?: string; // e.g. "Trabalho • Google Meet"
  tag?: string; // badge on the right, e.g. "Pendente"
  color?: EventColor; // defaults to cyan
}

export interface Reminder {
  text: string;
  done?: boolean;
}

export interface AgendaData {
  events: AgendaEvent[];
  reminders: Reminder[];
  updatedAt: number; // epoch ms of the last successful fetch
}
