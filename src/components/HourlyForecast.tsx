import { Clock4 } from "lucide-react";
import Card from "@/components/Card";
import WeatherIcon from "@/components/WeatherIcon";
import type { HourlyForecastItem } from "@/types/weather";

interface HourlyForecastProps {
  hourly: HourlyForecastItem[]; // starting at the current hour
}

export default function HourlyForecast({ hourly }: HourlyForecastProps) {
  return (
    <Card title="Próximas horas" icon={Clock4}>
      <div className="flex gap-2 overflow-x-auto">
        {hourly.slice(0, 8).map((item, i) => {
          const now = i === 0;
          return (
            <div
              key={item.time}
              className={`flex min-w-16 flex-1 flex-col items-center gap-1 rounded-xl py-2 ${
                now ? "glow-cyan border border-cyan-400/40 bg-cyan-500/15" : "tile"
              }`}
            >
              <span
                className={`text-xs ${now ? "font-bold text-cyan-300 uppercase" : "text-slate-400"}`}
              >
                {now ? "Agora" : `${Number(item.time.slice(11, 13))}h`}
              </span>
              <WeatherIcon code={item.weatherCode} isDay={item.isDay} className="h-6 w-6" />
              <span className="font-display text-base font-semibold tabular-nums">
                {Math.round(item.temperature)}°
              </span>
              <span
                className={`font-display text-[11px] tabular-nums ${
                  item.precipitationProbability >= 30 ? "text-cyan-400" : "text-slate-500"
                }`}
              >
                {item.precipitationProbability}%
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
