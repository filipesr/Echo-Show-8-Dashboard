import WeatherIcon from "@/components/WeatherIcon";
import { toLocalISO } from "@/lib/weather";
import type { DailyForecastItem } from "@/types/weather";

interface DailyForecastProps {
  daily: DailyForecastItem[];
}

const weekdayFormat = new Intl.DateTimeFormat("pt-BR", { weekday: "short" });

// "seg." -> "Seg"
function formatWeekday(date: string) {
  // Noon avoids the date shifting a day due to timezone parsing
  const text = weekdayFormat.format(new Date(`${date}T12:00`)).replace(".", "");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export default function DailyForecast({ daily }: DailyForecastProps) {
  // Next 4 days, starting tomorrow
  const today = toLocalISO(new Date()).slice(0, 10);
  const next = daily.filter((item) => item.date > today).slice(0, 4);

  return (
    <div className="grid flex-1 grid-cols-4 gap-4">
      {next.map((item) => (
        <div
          key={item.date}
          className="flex items-center justify-center gap-5 rounded-3xl bg-white/5"
        >
          <WeatherIcon code={item.weatherCode} className="h-20 w-20" />
          <div>
            <p className="text-3xl text-neutral-300">
              {formatWeekday(item.date)}
            </p>
            <p className="text-3xl tabular-nums">
              {Math.round(item.temperatureMax)}°
              <span className="text-neutral-500">
                {" "}
                / {Math.round(item.temperatureMin)}°
              </span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
