export function getPlaceholderAvatar(fullName: string) {
  const words = fullName.trim().split(/\s+/);
  const firstWord = words[0];

  if (!firstWord) return "";

  const fistLetter = firstWord[0].toUpperCase();
  if (words.length > 1) {
    const lastName = words[words.length - 1];
    return fistLetter + lastName[0].toUpperCase();
  }

  if (firstWord.length > 1) {
    return fistLetter + firstWord[1].toUpperCase();
  }

  return fistLetter;
}

export function formatarTempoEstimado(minutos: number): string {
  const horas = Math.floor(minutos / 60);
  const min = minutos % 60;

  if (horas === 0) return `${min} min`;
  if (min === 0) return `${horas} h`;
  return `${horas} h ${min} min`;
}
