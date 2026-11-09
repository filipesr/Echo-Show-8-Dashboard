import { CONDITION_LABELS, getCondition } from "@/lib/weather";

interface WeatherIconProps {
  code: number;
  isDay?: boolean;
  className?: string;
}

// Minimal line icons drawn on a 64x64 grid, using currentColor
const SUN_COLOR = "#fcd34d";

const CLOUD = "M18 44h28a9 9 0 0 0 0-18a13 13 0 0 0-25-2a10 10 0 0 0-3 20z";
// Same cloud moved up, leaving room for precipitation below it
const CLOUD_HIGH = "M18 38h28a9 9 0 0 0 0-18a13 13 0 0 0-25-2a10 10 0 0 0-3 20z";
// Smaller cloud in the lower right, in front of the sun/moon
const CLOUD_SMALL = "M26 52h22a8 8 0 0 0 0-16a11 11 0 0 0-21-2a8 8 0 0 0-1 18z";

function Sun({ cx = 32, cy = 32, r = 10 }) {
  // 8 rays evenly spaced around the circle
  const rays = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * Math.PI) / 4;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return (
      <line
        key={i}
        x1={cx + cos * (r + 5)}
        y1={cy + sin * (r + 5)}
        x2={cx + cos * (r + 10)}
        y2={cy + sin * (r + 10)}
      />
    );
  });

  return (
    <g stroke={SUN_COLOR}>
      <circle cx={cx} cy={cy} r={r} />
      {rays}
    </g>
  );
}

function Moon({ scale = 1, x = 0, y = 0 }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${scale})`}
      stroke={SUN_COLOR}
      d="M40 12a20 20 0 1 0 12 30a16 16 0 0 1-12-30z"
    />
  );
}

export default function WeatherIcon({
  code,
  isDay = true,
  className,
}: WeatherIconProps) {
  const condition = getCondition(code);
  const label = CONDITION_LABELS[condition];

  let content;
  switch (condition) {
    case "clear":
      content = isDay ? <Sun /> : <Moon />;
      break;
    case "partly-cloudy":
      content = (
        <>
          {isDay ? <Sun cx={24} cy={24} r={8} /> : <Moon scale={0.7} y={-2} />}
          {/* Filled with the background color to hide the sun behind it */}
          <path d={CLOUD_SMALL} fill="#0a0a0a" />
        </>
      );
      break;
    case "cloudy":
      content = <path d={CLOUD} />;
      break;
    case "fog":
      content = <path d="M14 24h36M18 32h32M14 40h36M20 48h24" />;
      break;
    case "drizzle":
      content = (
        <>
          <path d={CLOUD_HIGH} />
          <path d="M24 46l-1 3M33 46l-1 3M42 46l-1 3M28 54l-1 3M37 54l-1 3" />
        </>
      );
      break;
    case "rain":
      content = (
        <>
          <path d={CLOUD_HIGH} />
          <path d="M24 45l-3 9M33 45l-3 9M42 45l-3 9" />
        </>
      );
      break;
    case "snow":
      content = (
        <>
          <path d={CLOUD_HIGH} />
          <g fill="currentColor" stroke="none">
            <circle cx="24" cy="48" r="2" />
            <circle cx="40" cy="48" r="2" />
            <circle cx="32" cy="55" r="2" />
          </g>
        </>
      );
      break;
    case "thunderstorm":
      content = (
        <>
          <path d={CLOUD_HIGH} />
          <path d="M35 40l-7 10h8l-5 10" stroke={SUN_COLOR} />
        </>
      );
      break;
  }

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label={label}
      className={className}
    >
      <title>{label}</title>
      {content}
    </svg>
  );
}
