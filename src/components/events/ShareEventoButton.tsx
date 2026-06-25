"use client";

import { Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/src/components/ui/button";
import { Evento } from "@/src/hooks/useEventos";

interface ShareEventoButtonProps {
  evento: Evento;
}

export function ShareEventoButton({ evento }: ShareEventoButtonProps) {
  const dataFormatada = new Date(evento.data_hora).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });

  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/eventos/${evento.id}`
      : "";

  const mensagem = `🌲 Bora junto?\n\n${evento.titulo}${
    evento.trilhas ? ` na trilha ${evento.trilhas.nome}` : ""
  }, ${dataFormatada}.\n\nConfirma sua presença e vem com a gente:\n${url}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: evento.titulo,
          text: mensagem,
          url,
        });
      } catch {
        // usuário cancelou — sem erro a tratar
      }
    } else {
      await navigator.clipboard.writeText(mensagem);
      toast.success("Mensagem de convite copiada!");
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
      <Share2 className="h-4 w-4" />
      Convidar alguém
    </Button>
  );
}
