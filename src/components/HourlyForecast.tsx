import WeatherIcon from "@/components/WeatherIcon";
import { toLocalISO } from "@/lib/weather";
import type { HourlyForecastItem } from "@/types/weather";

interface HourlyForecastProps {
  hourly: HourlyForecastItem[];
}

export default function HourlyForecast({ hourly }: HourlyForecastProps) {
  // Hourly times are "YYYY-MM-DDTHH:00" strings, so comparing the
  // "YYYY-MM-DDTHH" prefix as text finds the current hour onwards
  const currentHour = toLocalISO(new Date()).slice(0, 13);
  const next = hourly
    .filter((item) => item.time.slice(0, 13) >= currentHour)
    .slice(0, 8);

  return (
    <div className="flex overflow-x-auto rounded-3xl bg-white/5">
      {next.map((item) => (
        <div
          key={item.time}
          className="flex min-w-24 flex-1 flex-col items-center gap-1 py-4"
        >
          <span className="text-xl text-neutral-400">
            {Number(item.time.slice(11, 13))}h
          </span>
          <WeatherIcon
            code={item.weatherCode}
            isDay={item.isDay}
            className="h-12 w-12"
          />
          <span className="text-2xl tabular-nums">
            {Math.round(item.temperature)}°
          </span>
        </div>
      ))}
    </div>
  );
}
