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
  ThermometerSun,
  Moon,
  CloudSnow,
  CloudFog,
  CloudMoon,
  CloudSun,
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
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&hourly=temperature_2m,weather_code,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=America/Sao_Paulo`;

        const res = await fetch(url, { next: { revalidate: 3600 } });
        const data = await res.json();

        if (!data.current) throw new Error();

        const current = data.current;

        setWeather({
          temperature: Math.round(current.temperature_2m),
          condition: getCondition(current.weather_code),
          icon: getWeatherIcon(current.weather_code),
          humidity: current.relative_humidity_2m,
          windSpeed: Math.round(current.wind_speed_10m),
          rainChance: data.daily.precipitation_probability_max[0] || 0,
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
    <Card className="overflow-hidden">
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
            <div className="text-6xl">{weather.icon}</div>
            <div>
              <p className="text-5xl font-light leading-none">
                {weather.temperature}°C
              </p>
              <p className="text-slate-600 mt-1">{weather.condition}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-sm text-slate-600">
            <div className="text-center">
              <Droplet className="w-5 h-5 mx-auto mb-1" />
              <p>{weather.humidity}%</p>
            </div>
            <div className="text-center">
              <Wind className="w-5 h-5 mx-auto mb-1" />
              <p>{weather.windSpeed} km/h</p>
            </div>
            <div className="text-center">
              <CloudRain className="w-5 h-5 mx-auto mb-1" />
              <p>{weather.rainChance}%</p>
            </div>
          </div>
        </div>

        {/* Aviso Inteligente */}
        <div
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
              ? `Alta chance de chuva forte. Recomendamos adiar a trilha por segurança.`
              : weather.rainChance >= 50
                ? `Possibilidade de chuva.`
                : `Boas condições climáticas para fazer a trilha.`}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

// Funções auxiliares
function getCondition(code: number): string {
  const hour = new Date().getHours();
  const isNight = hour < 6 || hour > 18;

  // Precipitação
  if ([51, 61, 80].includes(code)) return "Chuva leve";
  if ([53, 63, 81].includes(code)) return "Chuva moderada";
  if ([55, 65, 82].includes(code)) return "Chuva forte";

  if ([71, 73, 75].includes(code)) return "Neve";

  // Neblina
  if ([45, 48].includes(code)) return "Neblina";

  if (isNight) {
    if ([0, 1].includes(code)) return "Céu limpo";
    return "Nublado";
  } else {
    if ([0, 1].includes(code)) return "Ensolarado";
    if ([2, 3].includes(code)) return "Parcialmente nublado";
    return "Nublado";
  }
}

function getWeatherIcon(code: number) {
  const hour = new Date().getHours();
  const isNight = hour < 6 || hour > 18;

  // Chuva leve
  if ([51, 61, 80].includes(code))
    return <CloudRain className="w-16 h-16 text-blue-500" />;

  // Chuva moderada
  if ([53, 63, 81].includes(code))
    return <CloudRain className="w-16 h-16 text-blue-600" />;

  // Chuva forte
  if ([55, 65, 82].includes(code))
    return <CloudRain className="w-16 h-16 text-blue-700" />;

  // Neve
  if ([71, 73, 75].includes(code))
    return <CloudSnow className="w-16 h-16 text-slate-300" />;

  // Neblina
  if ([45, 48].includes(code))
    return <CloudFog className="w-16 h-16 text-slate-400" />;

  // Noite
  if (isNight) {
    if ([0, 1].includes(code))
      return <Moon className="w-16 h-16 text-slate-300" />;
    return <CloudMoon className="w-16 h-16 text-slate-400" />;
  }

  // Dia
  if ([0, 1].includes(code))
    return <Sun className="w-16 h-16 text-amber-500" />;
  if ([2, 3].includes(code))
    return <CloudSun className="w-16 h-16 text-amber-500" />;

  return <Cloud className="w-16 h-16 text-slate-500" />;
}
