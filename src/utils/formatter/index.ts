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
