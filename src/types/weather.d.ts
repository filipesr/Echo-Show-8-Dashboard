export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  weatherCode: number;
  isDay: boolean;
}

export interface HourlyForecastItem {
  time: string; // local ISO time, e.g. "2026-11-09T14:00"
  temperature: number;
  weatherCode: number;
  isDay: boolean;
}

export interface DailyForecastItem {
  date: string; // local ISO date, e.g. "2026-11-09"
  weatherCode: number;
  temperatureMax: number;
  temperatureMin: number;
}

export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  updatedAt: number; // epoch ms of the last successful fetch
}
