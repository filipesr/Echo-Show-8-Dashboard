import WeatherIcon from "@/components/WeatherIcon";
import { CITY } from "@/lib/weather";
import type { CurrentWeather } from "@/types/weather";

interface WeatherCurrentProps {
  current: CurrentWeather;
}

export default function WeatherCurrent({ current }: WeatherCurrentProps) {
  return (
    <div className="flex flex-col items-end text-right">
      <div className="flex items-center gap-6">
        <WeatherIcon
          code={current.weatherCode}
          isDay={current.isDay}
          className="h-36 w-36"
        />
        <span className="text-[160px] font-light leading-none tabular-nums transition-all duration-700">
          {Math.round(current.temperature)}°
        </span>
      </div>
      <p className="mt-4 text-4xl text-neutral-300">{CITY}</p>
      <p className="mt-2 text-2xl text-neutral-400">
        Umidade {Math.round(current.humidity)}% · Sensação{" "}
        {Math.round(current.apparentTemperature)}°
      </p>
    </div>
  );
}
