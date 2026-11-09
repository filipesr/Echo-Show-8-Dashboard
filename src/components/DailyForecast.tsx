import { CalendarDays } from "lucide-react";
import Card from "@/components/Card";
import WeatherIcon from "@/components/WeatherIcon";
import { CONDITION_LABELS, getCondition } from "@/lib/weather";
import type { DailyForecastItem } from "@/types/weather";

interface DailyForecastProps {
  daily: DailyForecastItem[]; // starting today
  className?: string;
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

export default function DailyForecast({ daily, className }: DailyForecastProps) {
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
      className={className}
      aside={<span className="text-xs text-slate-400">Mín / Máx</span>}
    >
      <div className="flex flex-1 flex-col justify-between gap-1.5">
        {days.map((item, i) => (
          <div
            key={item.date}
            className="tile flex flex-1 items-center gap-3 rounded-xl px-3 text-[15px]"
          >
            <span className="w-28 font-medium text-slate-200">
              {i === 0 ? (
                <>
                  <span className="font-bold text-cyan-400">Hoje</span>{" "}
                  <span className="text-xs text-slate-500">{formatWeekday(item.date, true)}</span>
                </>
              ) : (
                formatWeekday(item.date)
              )}
            </span>
            <span className="flex flex-1 items-center gap-2 text-sm text-slate-400">
              <WeatherIcon code={item.weatherCode} className="h-5 w-5" />
              {CONDITION_LABELS[getCondition(item.weatherCode)]}
            </span>
            <span className="w-8 text-right font-display text-sm text-slate-400 tabular-nums">
              {Math.round(item.temperatureMin)}°
            </span>
            <div className="relative h-1.5 w-28 rounded-full bg-slate-800">
              <div
                className="absolute h-full rounded-full bg-gradient-to-r from-cyan-400 to-amber-400"
                style={{
                  left: `${((item.temperatureMin - low) / range) * 100}%`,
                  width: `${((item.temperatureMax - item.temperatureMin) / range) * 100}%`,
                }}
              />
            </div>
            <span className="w-8 font-display text-sm font-semibold text-white tabular-nums">
              {Math.round(item.temperatureMax)}°
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
