"use client";

import { useEffect, useState } from "react";
import { fetchWeather } from "@/lib/weather";
import type { WeatherData } from "@/types/weather";

const STORAGE_KEY = "echo-dashboard:weather";
const REFRESH_MS = 15 * 60 * 1000;

// Fetches weather on mount and every 15 minutes.
// The last successful response is kept in localStorage, so the dashboard
// shows data immediately on reload and keeps working offline.
export function useWeather(): WeatherData | null {
  // Dashboard only renders on the client (see DeviceFrame), so reading
  // localStorage here is safe; the window check just guards the server
  const [weather, setWeather] = useState<WeatherData | null>(() => {
    if (typeof window === "undefined") return null;
    const cached = localStorage.getItem(STORAGE_KEY);
    return cached ? JSON.parse(cached) : null;
  });

  useEffect(() => {
    async function update() {
      try {
        const data = await fetchWeather();
        setWeather(data);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (error) {
        // Keep showing the cached data; next interval will retry
        console.warn("Weather update failed", error);
      }
    }

    update();
    const id = setInterval(update, REFRESH_MS);
    return () => clearInterval(id);
  }, []);

  return weather;
}
