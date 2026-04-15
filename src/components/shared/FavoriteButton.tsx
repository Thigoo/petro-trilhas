"use client";

import { useFavorites } from "@/src/lib/hooks/useFavorites";
import { Button } from "@/src/components/ui/button";
import { Star } from "lucide-react";

interface FavoriteButtonProps {
  trilhaId: string;
}

export default function FavoriteButton({ trilhaId }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();

  return (
    <Button
      size="lg"
      variant="outline"
      className="flex-1 text-md py-4"
      onClick={() => toggleFavorite(trilhaId)}
    >
      {isFavorite(trilhaId) ? (
        <>
          <Star className="mr-2 h-5 w-5 text-yellow-500 fill-current" />
          Remover dos Favoritos
        </>
      ) : (
        <>
          <Star className="mr-2 h-5 w-5" />
          Adicionar aos Favoritos
        </>
      )}
    </Button>
  );
}
