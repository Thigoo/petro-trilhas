"use client";

import { Share2 } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";

export function ShareButton({ title, url }: { title: string; url: string }) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (err) {
        console.error("Erro ao compartilhar", err);
      }
    } else {
      // Fallback para quando o navegador não suporta a Share API (Desktop)
      navigator.clipboard.writeText(url);
      toast.success("Link copiado para a área de transferência!");
    }
  };

  return (
    <Button
      size="lg"
      variant="outline"
      onClick={handleShare}
      aria-label="Compartilhar trilha"
      className="h-14 w-14 rounded-2xl border-2 shrink-0 hover:bg-muted transition-all"
    >
      <Share2 className="h-5 w-5 text-muted-foreground" />
    </Button>
  );
}
