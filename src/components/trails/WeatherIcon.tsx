import {
  Sun,
  Cloud,
  CloudRain,
  Moon,
  CloudSnow,
  CloudFog,
  CloudMoon,
  CloudSun,
  CloudLightning,
} from "lucide-react";

interface WeatherIconProps {
  code: number;
  isNight: boolean;
}

export function WeatherIcon({ code, isNight }: WeatherIconProps) {
  // Tempestades
  if ([95, 96, 99].includes(code))
    return <CloudLightning className="w-16 h-16 text-yellow-500" />;

  // Neblina
  if ([45, 48].includes(code))
    return <CloudFog className="w-16 h-16 text-slate-400" />;

  // Chuvisco, chuva, chuva congelante e pancadas de chuva
  if (
    [
      51,
      53,
      55, // Chuvisco
      56,
      57, // Chuvisco congelante
      61,
      63,
      65, // Chuva
      66,
      67, // Chuva congelante
      80,
      81,
      82, // Pancadas de chuva
    ].includes(code)
  ) {
    return <CloudRain className="w-16 h-16 text-blue-500" />;
  }

  // Neve, grãos de neve e pancadas de neve
  if (
    [
      71,
      73,
      75, // Queda de neve
      77, // Grãos de neve
      85,
      86, // Pancadas de neve
    ].includes(code)
  ) {
    return <CloudSnow className="w-16 h-16 text-slate-300" />;
  }

  // Céu limpo / predominantemente limpo
  if ([0, 1].includes(code)) {
    return isNight ? (
      <Moon className="w-16 h-16 text-slate-300" />
    ) : (
      <Sun className="w-16 h-16 text-amber-500" />
    );
  }

  // Parcialmente nublado
  if (code === 2) {
    return isNight ? (
      <CloudMoon className="w-16 h-16 text-slate-400" />
    ) : (
      <CloudSun className="w-16 h-16 text-amber-500" />
    );
  }

  // Encoberto
  if (code === 3) {
    return <Cloud className="w-16 h-16 text-slate-500" />;
  }

  return <Cloud className="w-16 h-16 text-slate-500" />;
}
