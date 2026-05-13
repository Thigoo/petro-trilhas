"use client";

import { useState, useEffect } from "react";

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const loadFavorites = () => {
      const saved = localStorage.getItem("petrotrilhas_favorites");
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    };

    loadFavorites();
  }, []);

  const toggleFavorite = (trilhaId: string) => {
    let newFavorites = [...favorites];

    if (newFavorites.includes(trilhaId)) {
      newFavorites = newFavorites.filter((id) => id !== trilhaId);
    } else {
      newFavorites.push(trilhaId);
    }

    setFavorites(newFavorites);
    // TODO: salvar no banco, favoritos devem ser vinculados ao usuário não ao navegador
    localStorage.setItem(
      "petrotrilhas_favorites",
      JSON.stringify(newFavorites),
    );
  };

  const isFavorite = (trilhaId: string) => favorites.includes(trilhaId);

  return { favorites, toggleFavorite, isFavorite };
}
