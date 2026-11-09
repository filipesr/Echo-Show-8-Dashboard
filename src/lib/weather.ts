import type { WeatherData } from "@/types/weather";

const API_URL = "https://api.open-meteo.com/v1/forecast";

export const LAT = process.env.NEXT_PUBLIC_LAT || "-25.41";
export const LON = process.env.NEXT_PUBLIC_LON || "-54.63";
export const CITY = process.env.NEXT_PUBLIC_CITY || "Hernandarias";

// Raw response shape (only the fields we request)
interface OpenMeteoResponse {
  current: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    weather_code: number;
    is_day: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
    weather_code: number[];
    is_day: number[];
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
  };
}

export async function fetchWeather(): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: LAT,
    longitude: LON,
    current:
      "temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,is_day",
    hourly: "temperature_2m,precipitation_probability,weather_code,is_day",
    daily:
      "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
    timezone: "auto", // times come back in the location's local time
    forecast_days: "7",
  });

  const res = await fetch(`${API_URL}?${params}`);
  if (!res.ok) throw new Error(`Open-Meteo error: ${res.status}`);
  const data: OpenMeteoResponse = await res.json();

  return {
    current: {
      temperature: data.current.temperature_2m,
      apparentTemperature: data.current.apparent_temperature,
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      weatherCode: data.current.weather_code,
      isDay: data.current.is_day === 1,
    },
    hourly: data.hourly.time.map((time, i) => ({
      time,
      temperature: data.hourly.temperature_2m[i],
      precipitationProbability: data.hourly.precipitation_probability[i] ?? 0,
      weatherCode: data.hourly.weather_code[i],
      isDay: data.hourly.is_day[i] === 1,
    })),
    daily: data.daily.time.map((date, i) => ({
      date,
      weatherCode: data.daily.weather_code[i],
      temperatureMax: data.daily.temperature_2m_max[i],
      temperatureMin: data.daily.temperature_2m_min[i],
      precipitationProbability: data.daily.precipitation_probability_max[i] ?? 0,
    })),
    updatedAt: Date.now(),
  };
}

// Formats a date as "YYYY-MM-DDTHH:MM" in the device's local time,
// matching the format of Open-Meteo times (assumes device and location
// share the same timezone, which is the case for a home dashboard)
export function toLocalISO(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
}

// Drops past hours and days, so hourly[0] is the current hour and daily[0]
// is today, even when showing a cached response from hours ago.
// Open-Meteo times are "YYYY-MM-DDTHH:00" strings, so comparing prefixes
// as text is enough.
export function fromNow(weather: WeatherData, now: Date): WeatherData {
  const nowISO = toLocalISO(now);
  return {
    ...weather,
    hourly: weather.hourly.filter((h) => h.time.slice(0, 13) >= nowISO.slice(0, 13)),
    daily: weather.daily.filter((d) => d.date >= nowISO.slice(0, 10)),
  };
}

// Groups the WMO weather codes used by Open-Meteo into the few
// visual conditions we have icons for.
// Reference: https://open-meteo.com/en/docs (section "WMO Weather interpretation codes")
//   0          clear sky
//   1, 2       mainly clear / partly cloudy
//   3          overcast
//   45, 48     fog
//   51-57      drizzle (incl. freezing)
//   61-67      rain (incl. freezing)
//   80-82      rain showers
//   71-77      snow
//   85, 86     snow showers
//   95-99      thunderstorm (with or without hail)
export type WeatherCondition =
  | "clear"
  | "partly-cloudy"
  | "cloudy"
  | "fog"
  | "drizzle"
  | "rain"
  | "snow"
  | "thunderstorm";

export function getCondition(code: number): WeatherCondition {
  if (code === 0) return "clear";
  if (code <= 2) return "partly-cloudy";
  if (code === 3) return "cloudy";
  if (code <= 48) return "fog";
  if (code <= 57) return "drizzle";
  if (code <= 67) return "rain";
  if (code <= 77) return "snow";
  if (code <= 82) return "rain";
  if (code <= 86) return "snow";
  return "thunderstorm";
}

// Portuguese labels, used as accessible text for the icons
export const CONDITION_LABELS: Record<WeatherCondition, string> = {
  clear: "Céu limpo",
  "partly-cloudy": "Parcialmente nublado",
  cloudy: "Nublado",
  fog: "Neblina",
  drizzle: "Garoa",
  rain: "Chuva",
  snow: "Neve",
  thunderstorm: "Tempestade",
};
