"use client";

import { useClock } from "@/hooks/useClock";

interface ClockProps {
  size?: "large" | "small";
}

const pad = (n: number) => String(n).padStart(2, "0");

const dateFormat = new Intl.DateTimeFormat("pt-BR", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

// "segunda-feira, 9 de novembro" -> "Segunda-feira, 9 de novembro"
function formatDate(date: Date) {
  const text = dateFormat.format(date);
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export default function Clock({ size = "large" }: ClockProps) {
  const now = useClock();
  const large = size === "large";

  return (
    <div className={large ? "" : "text-right"}>
      <div
        className={`flex items-baseline font-display font-bold tracking-tight tabular-nums ${
          large ? "" : "justify-end"
        }`}
      >
        <span className={large ? "text-[76px] leading-none" : "text-5xl"}>
          {now ? `${pad(now.getHours())}:${pad(now.getMinutes())}` : "--:--"}
        </span>
        {large && (
          <span className="ml-1.5 text-3xl text-cyan-400">
            :{now ? pad(now.getSeconds()) : "--"}
          </span>
        )}
      </div>
      <p className={large ? "mt-3 text-[15px] font-medium text-slate-300" : "mt-1 text-lg"}>
        {now ? formatDate(now) : " "}
      </p>
    </div>
  );
}
