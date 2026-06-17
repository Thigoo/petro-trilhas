export function getCondition(code: number): string {
  // Céu
  if (code === 0) return "Céu limpo";
  if (code === 1) return "Predominantemente limpo";
  if (code === 2) return "Parcialmente nublado";
  if (code === 3) return "Encoberto";

  // Neblina
  if (code === 45) return "Neblina";
  if (code === 48) return "Neblina com geada";

  // Chuvisco
  if (code === 51) return "Chuvisco leve";
  if (code === 53) return "Chuvisco moderado";
  if (code === 55) return "Chuvisco intenso";

  // Chuvisco congelante
  if (code === 56) return "Chuvisco congelante leve";
  if (code === 57) return "Chuvisco congelante intenso";

  // Chuva
  if (code === 61) return "Chuva leve";
  if (code === 63) return "Chuva moderada";
  if (code === 65) return "Chuva forte";

  // Chuva congelante
  if (code === 66) return "Chuva congelante leve";
  if (code === 67) return "Chuva congelante forte";

  // Neve
  if (code === 71) return "Neve leve";
  if (code === 73) return "Neve moderada";
  if (code === 75) return "Neve forte";

  // Grãos de neve
  if (code === 77) return "Grãos de neve";

  // Pancadas de chuva
  if (code === 80) return "Pancadas de chuva leves";
  if (code === 81) return "Pancadas de chuva moderadas";
  if (code === 82) return "Pancadas de chuva fortes";

  // Pancadas de neve
  if (code === 85) return "Pancadas de neve leves";
  if (code === 86) return "Pancadas de neve fortes";

  // Tempestades (caso adicione no futuro)
  if (code === 95) return "Tempestade";
  if (code === 96) return "Tempestade com granizo";
  if (code === 99) return "Tempestade severa com granizo";

  return "---";
}

export function isNightTime(sunrise: string, sunset: string): boolean {
  const now = new Date();

  const sunriseTime = new Date(sunrise);
  const sunsetTime = new Date(sunset);

  return now < sunriseTime || now > sunsetTime;
}
