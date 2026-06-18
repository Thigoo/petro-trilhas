export interface WeatherData {
  temperature: number;
  maxTemperature: number;
  minTemperature: number;

  weatherCode: number;

  humidity: number;
  windSpeed: number;
  rainChance: number;

  sunrise: string;
  sunset: string;

  forecast: DailyForecast[];

  lastUpdated: string;
}

export interface DailyForecast {
  date: string;
  temperatureMax: number;
  temperatureMin: number;
  weatherCode: number;
  rainChance: number;
}
