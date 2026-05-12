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
      variant="ghost"
      size="icon"
      onClick={handleShare}
      className=" bg-white/90 backdrop-blur-sm hover:bg-white text-green-900 rounded-full shadow-sm w-10 h-10 cursor-pointer"
    >
      <Share2 className="h-5 w-5" />
    </Button>
  );
}
