import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin } from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import { Evento } from "@/src/hooks/useEventos";
import { ConfirmadosAvatarStack } from "./ConfirmadosAvatarStack";
import { ConfirmarPresencaButton } from "./ConfirmarPresencaButton";
import { useConfirmacoes } from "@/src/hooks/useConfirmacoes";
import { ShareEventoButton } from "./ShareEventoButton";

export function EventoCard({ evento }: { evento: Evento }) {
  const { confirmados, totalConfirmados } = useConfirmacoes(evento.id);

  const dataFormatada = new Date(evento.data_hora).toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  const vagasEsgotadas =
    evento.vagas_limite != null && totalConfirmados >= evento.vagas_limite;

  return (
    <div className="rounded-2xl border bg-white overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex gap-4 p-4">
        {evento.trilhas?.imagem_url && (
          <Link href={`/trilhas/${evento.trilhas.slug}`} className="shrink-0">
            <div className="relative h-20 w-20 rounded-xl overflow-hidden bg-slate-100">
              <Image
                src={evento.trilhas.imagem_url}
                alt={evento.trilhas.nome}
                fill
                className="object-cover"
              />
            </div>
          </Link>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-base leading-tight">
              {evento.titulo}
            </h3>
            {vagasEsgotadas && (
              <Badge
                variant="secondary"
                className="bg-amber-100 text-amber-700 shrink-0"
              >
                Esgotado
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
            <Calendar className="h-3.5 w-3.5" />
            <span className="capitalize">{dataFormatada}</span>
          </div>

          {evento.trilhas && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
              <MapPin className="h-3.5 w-3.5" />
              <span>{evento.trilhas.nome}</span>
            </div>
          )}

          <p className="text-sm text-muted-foreground mt-1">
            Organizado por {evento.organizador_nome}
          </p>
        </div>
      </div>

      <div className="px-4 pb-4 flex items-center justify-between gap-3 flex-wrap">
        <ConfirmadosAvatarStack
          confirmados={confirmados}
          total={totalConfirmados}
        />
      </div>
      <div className="px-4 pb-4 flex items-center justify-between gap-3">
        <ConfirmarPresencaButton eventoId={evento.id} />
        <ShareEventoButton evento={evento} />
      </div>
    </div>
  );
}
