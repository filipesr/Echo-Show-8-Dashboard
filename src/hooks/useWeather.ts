import { useCachedData } from "@/hooks/useCachedData";
import { fetchWeather } from "@/lib/weather";
import type { WeatherData } from "@/types/weather";

const REFRESH_MS = 15 * 60 * 1000;

export function useWeather(lat: number, lon: number): WeatherData | null {
  return useCachedData(`echo-dashboard:weather:v2:${lat},${lon}`, () => fetchWeather(lat, lon), REFRESH_MS);
}
