"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  CloudRain,
  Wind,
  Droplet,
  ThermometerSun,
  Sunrise,
  Sunset,
} from "lucide-react";
import { formatTime, getCondition, isNightTime } from "@/src/utils/weather";
import { WeatherIcon } from "./WeatherIcon";
import { WeatherData } from "@/src/types/weather";

interface TrailWeatherProps {
  latitude: number;
  longitude: number;
}

export default function TrailWeather({
  latitude,
  longitude,
}: TrailWeatherProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&hourly=temperature_2m,weather_code,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset&timezone=America/Sao_Paulo`;

        const res = await fetch(url, { next: { revalidate: 3600 } });
        const data = await res.json();
        console.log("dados climáticos", data);

        if (!data.current) throw new Error();

        const current = data.current;

        const forecast = data.daily.time
          .slice(0, 5)
          .map((date: string, i: number) => ({
            date,
            temperatureMax: Math.round(data.daily.temperature_2m_max[i]),
            temperatureMin: Math.round(data.daily.temperature_2m_min[i]),
            weatherCode: data.daily.weather_code[i],
            rainChance:
              Math.round(data.daily.precipitation_probability_max[i]) ?? 0,
          }));

        setWeather({
          temperature: Math.round(current.temperature_2m),
          maxTemperature: Math.round(data.daily.temperature_2m_max[0]),
          minTemperature: Math.round(data.daily.temperature_2m_min[0]),

          weatherCode: current.weather_code,

          humidity: Math.round(current.relative_humidity_2m),
          windSpeed: Math.round(current.wind_speed_10m),
          rainChance: Math.round(
            data.daily.precipitation_probability_max[0] ?? 0,
          ),

          sunrise: data.daily.sunrise[0],
          sunset: data.daily.sunset[0],

          forecast,

          lastUpdated: current.time,
        });
      } catch {
        setError("Não foi possível carregar o clima.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [latitude, longitude]);

  if (loading)
    return (
      <div className="text-center py-8 text-slate-500">Carregando clima...</div>
    );
  if (error)
    return <div className="text-red-500 text-center py-8">{error}</div>;
  if (!weather) return null;

  return (
    <Card className="overflow-hidden text-muted-foreground">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <ThermometerSun className="w-5 h-5 text-amber-500" />
          Condições Climáticas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Clima Atual */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50 rounded-2xl p-5 md:p-6 gap-4">
          <div className="flex items-center gap-5">
            <div className="text-6xl">
              <WeatherIcon
                code={weather.weatherCode}
                isNight={isNightTime(weather.sunrise, weather.sunset)}
                size="w-16 h-16"
              />
            </div>
            <div>
              <p className="text-5xl font-light leading-none">
                {weather.temperature}°C
              </p>
              <p className="mt-1">{getCondition(weather.weatherCode)}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <Droplet className="w-5 h-5 mx-auto mb-1" />
              <p className="font-medium">{weather.humidity}%</p>
              <p className="text-xs text-muted-foreground">Umidade</p>
            </div>

            <div className="text-center">
              <Wind className="w-5 h-5 mx-auto mb-1" />
              <p className="font-medium">{weather.windSpeed} km/h</p>
              <p className="text-xs text-muted-foreground">Vento</p>
            </div>

            <div className="text-center">
              <CloudRain className="w-5 h-5 mx-auto mb-1" />
              <p className="font-medium">{weather.rainChance}%</p>
              <p className="text-xs text-muted-foreground">Chuva</p>
            </div>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-center gap-3 text-sm text-muted-foreground w-full py-1 px-3">
          <span className="flex items-center gap-1">
            <Sunrise className="w-6 h-6 " />
            {formatTime(weather.sunrise)}
          </span>

          <span className="flex items-center gap-1">
            <Sunset className="w-6 h-6" />
            {formatTime(weather.sunset)}
          </span>
        </div>
        {/* Aviso Inteligente */}
        {/* <div
          className={`p-4 rounded-2xl text-sm flex items-start gap-3 border ${
            weather.rainChance >= 70
              ? "bg-red-50 border-red-200 text-red-800"
              : weather.rainChance >= 40
                ? "bg-yellow-50 border-yellow-200 text-yellow-800"
                : "bg-green-50 border-green-200 text-green-800"
          }`}
        >
          {weather.rainChance >= 70 ? (
            <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
          ) : weather.rainChance >= 40 ? (
            <CloudRain className="w-5 h-5 mt-0.5 shrink-0" />
          ) : (
            <Sun className="w-5 h-5 mt-0.5 shrink-0" />
          )}
          <span>
            {weather.rainChance >= 70
              ? `Alta chance de chuva. Pode adiar a trilha por segurança.`
              : weather.rainChance >= 50
                ? `Possibilidade de chuva.`
                : `Boas condições climáticas para fazer a trilha.`}
          </span>
        </div> */}
        {/* Forecast */}
        <div className="space-y-2">
          <h3 className="font-medium text-sm">
            Previsão para os próximos dias
          </h3>

          <div className="flex justify-between gap-1">
            {weather.forecast.map((day, index) => {
              const label =
                index === 0
                  ? "Hoje"
                  : new Date(day.date + "T00:00:00").toLocaleDateString(
                      "pt-BR",
                      {
                        weekday: "short",
                      },
                    );

              return (
                <div
                  key={day.date}
                  className={`flex flex-col items-center gap-2 rounded-xl w-full p-2 transition-colors border ${
                    index === 0
                      ? "bg-muted border-b-5 border-b-medium-green"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <span className="text-sm font-medium capitalize">
                    {label}
                  </span>

                  <WeatherIcon
                    code={day.weatherCode}
                    isNight={false}
                    size="w-7 h-7"
                  />

                  <div className="flex gap-1 text-sm">
                    <span className="font-medium">{day.temperatureMax}°</span>
                    <span className="text-muted-foreground">
                      {day.temperatureMin}°
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
