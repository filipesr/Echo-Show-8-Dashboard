"use client";

import { Image as ImageIcon, RefreshCw } from "lucide-react";
import { useClock } from "@/hooks/useClock";
import { CITY } from "@/lib/weather";

interface StatusBarProps {
  weatherUpdatedAt?: number;
  onStartSlideshow: () => void;
}

// Weather refreshes every 15 min; past this it is considered out of date
const STALE_MS = 30 * 60 * 1000;

const timeFormat = new Intl.DateTimeFormat("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
});

export default function StatusBar({
  weatherUpdatedAt,
  onStartSlideshow,
}: StatusBarProps) {
  const now = useClock();
  const stale =
    !weatherUpdatedAt || !now || now.getTime() - weatherUpdatedAt > STALE_MS;

  return (
    <header className="flex items-center justify-between border-b border-white/5 px-5 py-3">
      <div className="tile flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm">
        <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
        <span className="font-semibold text-white">{CITY}</span>
      </div>

      <div className="flex items-center gap-3 text-sm">
        <span
          className={`tile flex items-center gap-1.5 rounded-lg px-3 py-1.5 ${
            stale ? "text-amber-300" : "text-cyan-300"
          }`}
        >
          <RefreshCw className="h-3.5 w-3.5" aria-hidden />
          {weatherUpdatedAt
            ? `${stale ? "Desatualizado" : "Atualizado"} ${timeFormat.format(weatherUpdatedAt)}`
            : "Sincronizando…"}
        </span>
        <button
          type="button"
          onClick={onStartSlideshow}
          className="glow-cyan flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 font-semibold text-white"
        >
          <ImageIcon className="h-4 w-4" aria-hidden />
          Iniciar Photo-Slide
        </button>
      </div>
    </header>
  );
}
