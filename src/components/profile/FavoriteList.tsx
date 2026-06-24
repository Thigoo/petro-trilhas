"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { useFavorites } from "@/src/hooks/useFavorites";
import { FavoriteTrailItem } from "./FavoriteTrailItem";

export function FavoritesList() {
  const { favoriteTrails, loading, toggleFavorite } = useFavorites();

  if (loading) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Carregando favoritos...
      </div>
    );
  }

  if (favoriteTrails.length === 0) {
    return (
      <div className="text-center py-16">
        <Heart className="h-10 w-10 mx-auto mb-3 text-slate-300" />
        <p className="text-muted-foreground mb-4">
          Você ainda não favoritou nenhuma trilha.
        </p>
        <Link
          href="/trilhas"
          className="text-emerald-600 font-medium hover:underline"
        >
          Explorar trilhas
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {favoriteTrails.map((trail) => (
        <FavoriteTrailItem
          key={trail.id}
          trail={trail}
          onRemove={toggleFavorite}
        />
      ))}
    </div>
  );
}
