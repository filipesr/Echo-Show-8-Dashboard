export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number; // km/h
  weatherCode: number;
  isDay: boolean;
}

export interface HourlyForecastItem {
  time: string; // local ISO time, e.g. "2026-11-09T14:00"
  temperature: number;
  precipitationProbability: number; // %
  weatherCode: number;
  isDay: boolean;
}

export interface DailyForecastItem {
  date: string; // local ISO date, e.g. "2026-11-09"
  weatherCode: number;
  temperatureMax: number;
  temperatureMin: number;
  precipitationProbability: number; // max % of the day
}

export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  updatedAt: number; // epoch ms of the last successful fetch
}
