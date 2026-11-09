import { ArrowDown, ArrowUp, Thermometer } from "lucide-react";
import Card from "@/components/Card";
import WeatherIcon from "@/components/WeatherIcon";
import { CONDITION_LABELS, getCondition } from "@/lib/weather";
import type { WeatherData } from "@/types/weather";

interface WeatherCurrentProps {
  weather: WeatherData;
  className?: string;
}

export default function WeatherCurrent({ weather, className }: WeatherCurrentProps) {
  const { current } = weather;
  // First items are the current hour/today (see HourlyForecast/DailyForecast)
  const today = weather.daily[0];
  const rainChance = weather.hourly[0]?.precipitationProbability ?? 0;

  const metrics = [
    { label: "Vento", value: `${Math.round(current.windSpeed)} km/h`, color: "text-slate-200" },
    { label: "Chuva", value: `${rainChance}%`, color: "text-cyan-300" },
    { label: "Umidade", value: `${Math.round(current.humidity)}%`, color: "text-amber-300" },
  ];

  return (
    <Card
      title="Clima"
      icon={Thermometer}
      className={className}
      aside={
        <span className="truncate rounded-full border border-cyan-800/40 bg-cyan-950/60 px-2.5 py-0.5 text-xs font-semibold text-cyan-300">
          {CONDITION_LABELS[getCondition(current.weatherCode)]}
        </span>
      }
    >
      <div className="flex flex-1 items-center justify-between">
        <div className="flex items-center gap-3">
          <WeatherIcon
            code={current.weatherCode}
            isDay={current.isDay}
            className="h-14 w-14"
          />
          <div>
            <p className="font-display text-6xl leading-none font-bold tabular-nums transition-all duration-700">
              {Math.round(current.temperature)}
              <span className="ml-0.5 text-2xl font-normal text-slate-400">°C</span>
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Sensação{" "}
              <span className="font-semibold text-slate-200">
                {Math.round(current.apparentTemperature)}°
              </span>
            </p>
          </div>
        </div>
        {today && (
          <div className="space-y-1 text-right font-display text-sm font-semibold tabular-nums">
            <p className="flex items-center justify-end gap-1 text-rose-400">
              <ArrowUp className="h-3.5 w-3.5" aria-hidden /> {Math.round(today.temperatureMax)}°
            </p>
            <p className="flex items-center justify-end gap-1 text-cyan-400">
              <ArrowDown className="h-3.5 w-3.5" aria-hidden /> {Math.round(today.temperatureMin)}°
            </p>
          </div>
        )}
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 border-t border-white/5 pt-3 text-center">
        {metrics.map((metric) => (
          <div key={metric.label} className="tile rounded-lg py-1">
            <span className="block text-[11px] text-slate-400 uppercase">{metric.label}</span>
            <span className={`font-display text-sm font-semibold tabular-nums ${metric.color}`}>
              {metric.value}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
