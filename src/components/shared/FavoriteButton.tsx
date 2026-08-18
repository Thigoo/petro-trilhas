"use client";

import { useFavorites } from "@/src/hooks/useFavorites";
import { Button } from "@/src/components/ui/button";
import { Heart } from "lucide-react";
import { LoginPromptDialog } from "./LoginDialog";
import { cn } from "@/src/lib/utils";

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
        onClick={() => toggleFavorite(trilhaId)}
        aria-label={
          isFavorite(trilhaId)
            ? "Remover dos favoritos"
            : "Adicionar aos favoritos"
        }
        className={cn(
          "h-14 w-14 rounded-2xl border-2 shrink-0 transition-all",
          isFavorite(trilhaId)
            ? "bg-red-50 border-red-200 hover:bg-red-100"
            : "hover:bg-muted",
        )}
      >
        <Heart
          className={cn(
            "h-5 w-5 transition-colors",
            isFavorite(trilhaId)
              ? "text-red-500 fill-current"
              : "text-muted-foreground",
          )}
        />
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
