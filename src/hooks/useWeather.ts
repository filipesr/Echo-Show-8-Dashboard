"use client";

import { useCachedData } from "@/hooks/useCachedData";
import { fetchWeather } from "@/lib/weather";
import type { WeatherData } from "@/types/weather";

// Bump the version when WeatherData changes shape, to ignore old caches
const STORAGE_KEY = "echo-dashboard:weather:v2";
const REFRESH_MS = 15 * 60 * 1000;

export function useWeather(): WeatherData | null {
  return useCachedData(STORAGE_KEY, fetchWeather, REFRESH_MS);
}
