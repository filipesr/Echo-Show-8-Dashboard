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
    <div>
      <div className="flex items-baseline font-light leading-none tracking-tight tabular-nums">
        <span className={large ? "text-[176px]" : "text-6xl"}>
          {now ? `${pad(now.getHours())}:${pad(now.getMinutes())}` : "--:--"}
        </span>
        {large && (
          <span className="ml-4 text-6xl text-neutral-500">
            {now ? pad(now.getSeconds()) : "--"}
          </span>
        )}
      </div>
      <p
        className={
          large ? "mt-6 text-4xl text-neutral-300" : "mt-2 text-xl"
        }
      >
        {now ? formatDate(now) : " "}
      </p>
    </div>
  );
}
