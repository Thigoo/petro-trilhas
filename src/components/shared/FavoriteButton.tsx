"use client";

import { useFavorites } from "@/src/hooks/useFavorites";
import { Button } from "@/src/components/ui/button";
import { Star } from "lucide-react";
import { LoginPromptDialog } from "./LoginDialog";

interface FavoriteButtonProps {
  trilhaId: string;
}

export default function FavoriteButton({ trilhaId }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite, showLoginPrompt, setShowLoginPrompt } =
    useFavorites();

  return (
    <>
      <Button
        size="lg"
        variant="outline"
        className="flex-1 text-md py-5"
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
      <LoginPromptDialog
        open={showLoginPrompt}
        onOpenChange={setShowLoginPrompt}
        title="Entre para favoritar trilhas"
        description="Você precisa estar logado para salvar trilhas favoritas e acessá-las
            depois."
        confirmText="Fazer login"
        cancelText="Continuar navegando"
      />
    </>
  );
}
