import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudMoon,
  CloudRain,
  CloudSnow,
  CloudSun,
  Moon,
  Sun,
  type LucideIcon,
} from "lucide-react";
import {
  CONDITION_LABELS,
  getCondition,
  type WeatherCondition,
} from "@/lib/weather";

interface WeatherIconProps {
  code: number;
  isDay?: boolean;
  className?: string;
}

// Icon (day / night) and color for each condition:
// amber for sun/heat, cyan for precipitation, slate for clouds
const ICONS: Record<
  WeatherCondition,
  { day: LucideIcon; night: LucideIcon; color: string }
> = {
  clear: { day: Sun, night: Moon, color: "text-amber-400" },
  "partly-cloudy": { day: CloudSun, night: CloudMoon, color: "text-amber-300" },
  cloudy: { day: Cloud, night: Cloud, color: "text-slate-300" },
  fog: { day: CloudFog, night: CloudFog, color: "text-slate-400" },
  drizzle: { day: CloudDrizzle, night: CloudDrizzle, color: "text-cyan-400" },
  rain: { day: CloudRain, night: CloudRain, color: "text-cyan-400" },
  snow: { day: CloudSnow, night: CloudSnow, color: "text-sky-200" },
  thunderstorm: { day: CloudLightning, night: CloudLightning, color: "text-amber-400" },
};

export default function WeatherIcon({
  code,
  isDay = true,
  className = "",
}: WeatherIconProps) {
  const condition = getCondition(code);
  const { day, night, color } = ICONS[condition];
  const Icon = isDay ? day : night;

  return (
    <Icon
      role="img"
      aria-label={CONDITION_LABELS[condition]}
      className={`${color} ${className}`}
    />
  );
}
