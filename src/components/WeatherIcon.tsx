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
} from "lucide-react-native";
import { CONDITION_LABELS, getCondition, type WeatherCondition } from "@/lib/weather";
import { colors } from "@/lib/theme";

interface WeatherIconProps {
  code: number;
  isDay?: boolean;
  size: number;
}

// Icon (day / night) and color for each condition:
// amber for sun/heat, cyan for precipitation, slate for clouds
const ICONS: Record<WeatherCondition, { day: LucideIcon; night: LucideIcon; color: string }> = {
  clear: { day: Sun, night: Moon, color: colors.amber },
  "partly-cloudy": { day: CloudSun, night: CloudMoon, color: colors.amberSoft },
  cloudy: { day: Cloud, night: Cloud, color: colors.textSecondary },
  fog: { day: CloudFog, night: CloudFog, color: colors.textMuted },
  drizzle: { day: CloudDrizzle, night: CloudDrizzle, color: colors.cyan },
  rain: { day: CloudRain, night: CloudRain, color: colors.cyan },
  snow: { day: CloudSnow, night: CloudSnow, color: colors.sky },
  thunderstorm: { day: CloudLightning, night: CloudLightning, color: colors.amber },
};

export default function WeatherIcon({ code, isDay = true, size }: WeatherIconProps) {
  const condition = getCondition(code);
  const { day, night, color } = ICONS[condition];
  const Icon = isDay ? day : night;

  return (
    <Icon
      size={size}
      color={color}
      accessible
      accessibilityRole="image"
      accessibilityLabel={CONDITION_LABELS[condition]}
    />
  );
}
