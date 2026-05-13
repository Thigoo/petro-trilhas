"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Sun,
  Cloud,
  CloudRain,
  Wind,
  Droplet,
  AlertTriangle,
} from "lucide-react";

interface WeatherData {
  temperature: number;
  condition: string;
  icon: React.ReactNode;
  humidity: number;
  windSpeed: number;
  rainChance: number;
}

interface TrailWeatherProps {
  latitude: number;
  longitude: number;
  trailName: string;
}

export default function TrailWeather({
  latitude,
  longitude,
  trailName,
}: TrailWeatherProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=America/Sao_Paulo`;

        const res = await fetch(url);
        const data = await res.json();

        if (!data.current) throw new Error("Não foi possível obter os dados");

        const current = data.current;

        setWeather({
          temperature: Math.round(current.temperature_2m),
          condition: getCondition(current.weather_code),
          icon: getWeatherIcon(current.weather_code),
          humidity: current.relative_humidity_2m,
          windSpeed: Math.round(current.wind_speed_10m),
          rainChance: data.daily.precipitation_probability_max[0] || 0,
        });
      } catch (err) {
        setError("Não foi possível carregar o clima no momento.");
        console.error(err);
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sun className="w-5 h-5 text-amber-500" />
          Condições Climáticas
          <span className="text-sm font-normal text-slate-500">
            - {trailName}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Clima Atual */}
        <div className="flex items-center justify-between bg-slate-50 rounded-2xl p-6">
          <div className="flex items-center gap-6">
            <div className="text-6xl">{weather.icon}</div>
            <div>
              <p className="text-5xl font-light">{weather.temperature}°C</p>
              <p className="text-slate-600">{weather.condition}</p>
            </div>
          </div>

          <div className="text-right space-y-1 text-sm text-slate-600">
            <p className="flex items-center justify-end gap-1">
              <Droplet className="w-4 h-4" /> {weather.humidity}% umidade
            </p>
            <p className="flex items-center justify-end gap-1">
              <Wind className="w-4 h-4" /> {weather.windSpeed} km/h
            </p>
            <p className="flex items-center justify-end gap-1">
              <CloudRain className="w-4 h-4" /> {weather.rainChance}% chuva
            </p>
          </div>
        </div>

        {/* Aviso Inteligente */}
        <div
          className={`p-4 rounded-2xl text-sm font-medium flex items-start gap-3 ${
            weather.rainChance > 60
              ? "bg-red-50 text-red-700 border border-red-100"
              : weather.rainChance > 30
                ? "bg-yellow-50 text-yellow-700 border border-yellow-100"
                : "bg-green-50 text-green-700 border border-green-100"
          }`}
        >
          {weather.rainChance > 60 ? (
            <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
          ) : weather.rainChance > 30 ? (
            <CloudRain className="w-5 h-5 mt-0.5 shrink-0" />
          ) : (
            <Sun className="w-5 h-5 mt-0.5 shrink-0" />
          )}
          <span>
            {weather.rainChance > 60
              ? "Alta chance de chuva forte. Recomendamos adiar a trilha."
              : weather.rainChance > 30
                ? "Possibilidade de chuva à tarde. Leve capa de chuva."
                : "Boas condições para fazer a trilha hoje."}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

// Funções auxiliares
function getCondition(code: number): string {
  if ([0, 1].includes(code)) return "Ensolarado";
  if ([2, 3].includes(code)) return "Parcialmente nublado";
  if ([45, 48].includes(code)) return "Neblina";
  if ([51, 53, 55, 61, 63, 65].includes(code)) return "Chuva";
  if ([71, 73, 75].includes(code)) return "Neve";
  return "Nublado";
}

function getWeatherIcon(code: number) {
  if ([0, 1].includes(code))
    return <Sun className="w-16 h-16 text-amber-500" />;
  if ([2, 3].includes(code))
    return <Cloud className="w-16 h-16 text-slate-500" />;
  if ([45, 48].includes(code))
    return <Cloud className="w-16 h-16 text-slate-400" />;
  if ([51, 53, 55, 61, 63, 65].includes(code))
    return <CloudRain className="w-16 h-16 text-blue-600" />;
  return <Cloud className="w-16 h-16 text-slate-500" />;
}
