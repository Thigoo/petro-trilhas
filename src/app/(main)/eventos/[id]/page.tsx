"use client";

import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Phone, Users, ArrowLeft } from "lucide-react";
import { useEvento } from "@/src/hooks/useEventos";
import { useConfirmacoes } from "@/src/hooks/useConfirmacoes";
import { ConfirmarPresencaButton } from "@/src/components/events/ConfirmarPresencaButton";
import { ShareEventoButton } from "@/src/components/events/ShareEventoButton";
import LoadingScreen from "@/src/components/shared/LoadingScreen";

export default function EventoDetalhePage() {
  const params = useParams();
  const eventoId = params.id as string;

  const { data: evento, isLoading, error } = useEvento(eventoId);
  const { confirmados, totalConfirmados } = useConfirmacoes(eventoId);

  if (isLoading) return <LoadingScreen />;
  if (error || !evento) notFound();

  const dataFormatada = new Date(evento.data_hora).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });

  const vagasRestantes =
    evento.vagas_limite != null ? evento.vagas_limite - totalConfirmados : null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Link
        href="/eventos"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para eventos
      </Link>

      {evento.trilhas?.imagem_url && (
        <div className="relative h-56 w-full rounded-2xl overflow-hidden mb-6">
          <Image
            src={evento.trilhas.imagem_url}
            alt={evento.trilhas.nome}
            fill
            className="object-cover"
          />
        </div>
      )}

      <h1 className="text-2xl font-bold tracking-tight mb-2">
        {evento.titulo}
      </h1>

      <div className="space-y-2 mb-6">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span className="capitalize">{dataFormatada}</span>
        </div>

        {evento.trilhas && (
          <Link
            href={`/trilhas/${evento.trilhas.slug}`}
            className="flex items-center gap-2 text-muted-foreground hover:text-emerald-600 transition-colors"
          >
            <MapPin className="h-4 w-4" />
            <span>{evento.trilhas.nome}</span>
          </Link>
        )}

        {evento.vagas_limite != null && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>
              {vagasRestantes! > 0
                ? `${vagasRestantes} de ${evento.vagas_limite} vagas disponíveis`
                : "Vagas esgotadas"}
            </span>
          </div>
        )}
      </div>

      {evento.descricao && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-2">
            Sobre o evento
          </h2>
          <p className="text-foreground/90 whitespace-pre-line">
            {evento.descricao}
          </p>
        </div>
      )}

      <div className="rounded-2xl border bg-muted/30 p-4 mb-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-2">
          Organização
        </h2>
        <p className="font-medium">{evento.organizador_nome}</p>
        {evento.organizador_contato && (
          <a
            href={`https://wa.me/${evento.organizador_contato.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-emerald-600 hover:underline mt-1"
          >
            <Phone className="h-3.5 w-3.5" />
            {evento.organizador_contato}
          </a>
        )}
      </div>

      <div className="mb-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
          {totalConfirmados === 0
            ? "Ninguém confirmou ainda"
            : `${totalConfirmados} ${totalConfirmados === 1 ? "confirmado" : "confirmados"}`}
        </h2>

        {confirmados.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {confirmados.map((c) => (
              <div
                key={c.userId}
                className="flex items-center gap-2 rounded-xl border bg-white px-3 py-2"
              >
                <div className="relative h-8 w-8 rounded-full overflow-hidden bg-emerald-100 shrink-0 flex items-center justify-center text-xs font-semibold text-emerald-700">
                  {c.avatarUrl ? (
                    <Image
                      src={c.avatarUrl}
                      alt={c.nome ?? ""}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    (c.nome ?? "?")[0]?.toUpperCase()
                  )}
                </div>
                <span className="text-sm truncate">
                  {c.nome ?? "Participante"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 sticky bottom-4">
        <ConfirmarPresencaButton eventoId={evento.id} />
        <ShareEventoButton evento={evento} />
      </div>
    </div>
  );
}
