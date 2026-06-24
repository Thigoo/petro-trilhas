export function getPlaceholderAvatar(fullName: string) {
  const palavras = fullName.trim().split(/\s+/);
  const primeiraPalavra = palavras[0];

  if (!primeiraPalavra) return "";

  const primeiraLetra = primeiraPalavra[0].toUpperCase();
  if (palavras.length > 1) {
    const sobrenome = palavras[palavras.length - 1];
    return primeiraLetra + sobrenome[0].toUpperCase();
  }

  if (primeiraPalavra.length > 1) {
    return primeiraLetra + primeiraPalavra[1].toUpperCase();
  }

  return primeiraLetra;
}
