"use client";

import { useEffect, useRef, useState } from "react";
import Clock from "@/components/Clock";
import DailyForecast from "@/components/DailyForecast";
import HourlyForecast from "@/components/HourlyForecast";
import Slideshow from "@/components/Slideshow";
import WeatherCurrent from "@/components/WeatherCurrent";
import { useIdleTimer } from "@/hooks/useIdleTimer";
import { useWeather } from "@/hooks/useWeather";

interface DashboardProps {
  photos: string[];
}

// Echo Show 8 screen resolution
const WIDTH = 1280;
const HEIGHT = 800;
const IDLE_TIMEOUT_MS = 5 * 60 * 1000;

export default function Dashboard({ photos }: DashboardProps) {
  const weather = useWeather();
  const idle = useIdleTimer(IDLE_TIMEOUT_MS);

  // The dashboard is laid out at a fixed 1280x800 and scaled to fit its
  // container, so it looks the same on the device and inside the web mockup
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setScale(Math.min(width / WIDTH, height / HEIGHT));
    });
    observer.observe(containerRef.current!);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex h-full w-full items-center justify-center overflow-hidden bg-[#0a0a0a]"
    >
      <div
        className="relative flex shrink-0 flex-col gap-6 p-12 text-neutral-100"
        style={{ width: WIDTH, height: HEIGHT, transform: `scale(${scale})` }}
      >
        <div className="flex h-[360px] items-center justify-between">
          <Clock />
          {weather && <WeatherCurrent current={weather.current} />}
        </div>

        {weather ? (
          <div className="flex flex-1 flex-col gap-4">
            <HourlyForecast hourly={weather.hourly} />
            <DailyForecast daily={weather.daily} />
          </div>
        ) : (
          <p className="m-auto text-2xl text-neutral-500">Carregando clima…</p>
        )}

        {idle && <Slideshow photos={photos} />}
      </div>
    </div>
  );
}
