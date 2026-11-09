"use client";

import { CalendarClock, Clock3 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Agenda from "@/components/Agenda";
import Card from "@/components/Card";
import Clock from "@/components/Clock";
import DailyForecast from "@/components/DailyForecast";
import HourlyForecast from "@/components/HourlyForecast";
import Slideshow from "@/components/Slideshow";
import StatusBar from "@/components/StatusBar";
import WeatherCurrent from "@/components/WeatherCurrent";
import { useAgenda } from "@/hooks/useAgenda";
import { useClock } from "@/hooks/useClock";
import { useIdleTimer } from "@/hooks/useIdleTimer";
import { useWeather } from "@/hooks/useWeather";
import { formatDuration, getNextEvent } from "@/lib/agenda";
import { fromNow } from "@/lib/weather";

interface DashboardProps {
  photos: string[];
}

// Echo Show 8 screen resolution
const WIDTH = 1280;
const HEIGHT = 800;
const IDLE_TIMEOUT_MS = 5 * 60 * 1000;

// ISO 8601 week number: weeks start on Monday and week 1 is the one
// containing the year's first Thursday
function isoWeek(date: Date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7)); // Thursday of this week
  const yearStart = Date.UTC(d.getUTCFullYear(), 0, 1);
  return Math.ceil(((d.getTime() - yearStart) / 86400000 + 1) / 7);
}

export default function Dashboard({ photos }: DashboardProps) {
  const cachedWeather = useWeather();
  const agenda = useAgenda();
  const now = useClock("minute") ?? new Date();
  const { idle, goIdle } = useIdleTimer(IDLE_TIMEOUT_MS);
  const weather = cachedWeather && fromNow(cachedWeather, now);
  const next = agenda && getNextEvent(agenda.events, now);

  // The dashboard is laid out at a fixed 1280x800 and scaled to fit its
  // container, so it looks the same on the device and inside the web mockup
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setScale(Math.min(width / WIDTH, height / HEIGHT));
    });
    observer.observe(containerRef.current!);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex h-full w-full items-center justify-center overflow-hidden bg-[#080c14]"
    >
      <div
        className="relative flex shrink-0 flex-col overflow-hidden bg-gradient-to-br from-[#0c1322] via-[#090d16] to-[#06080e] text-slate-100"
        style={{ width: WIDTH, height: HEIGHT, transform: `scale(${scale})` }}
      >
        {/* Ambient glows */}
        <div className="pointer-events-none absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="pointer-events-none absolute right-10 -bottom-32 h-[420px] w-[420px] rounded-full bg-indigo-500/10 blur-3xl" />

        <StatusBar weatherUpdatedAt={cachedWeather?.updatedAt} onStartSlideshow={goIdle} />

        <main className="relative grid min-h-0 flex-1 grid-cols-2 gap-4 p-4">
          <div className="flex min-h-0 flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Card
                title="Horário local"
                icon={Clock3}
                aside={
                  <span className="tile rounded px-2 py-0.5 font-display text-xs text-slate-400">
                    SEM {isoWeek(now)}
                  </span>
                }
              >
                <Clock />
                {next && (
                  <p className="mt-auto flex items-center gap-1.5 truncate border-t border-white/5 pt-3 text-sm font-medium text-cyan-400">
                    <CalendarClock className="h-4 w-4 shrink-0" aria-hidden />
                    Em {formatDuration(next.minutes)} · {next.event.title}
                  </p>
                )}
              </Card>
              {weather && <WeatherCurrent weather={weather} />}
            </div>

            {weather ? (
              <>
                <HourlyForecast hourly={weather.hourly} />
                <DailyForecast daily={weather.daily} className="min-h-0 flex-1" />
              </>
            ) : (
              <p className="m-auto text-xl text-slate-500">Carregando clima…</p>
            )}
          </div>

          <Agenda agenda={agenda} now={now} className="min-h-0" />
        </main>

        {idle && <Slideshow photos={photos} />}
      </div>
    </div>
  );
}
