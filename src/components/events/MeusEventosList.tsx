"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin } from "lucide-react";
import { useMeusEventos } from "@/src/hooks/useEventos";

export function MeusEventosList() {
  const { data: eventos = [], isLoading } = useMeusEventos();

  if (isLoading) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Carregando seus eventos...
      </div>
    );
  }

  if (eventos.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <Calendar className="h-10 w-10 mx-auto mb-3 opacity-40" />
        <p className="mb-4">
          Você ainda não confirmou presença em nenhum evento.
        </p>
        <Link
          href="/eventos"
          className="text-emerald-600 font-medium hover:underline"
        >
          Ver eventos disponíveis
        </Link>
      </div>
    );
  }

  const agora = new Date();
  const proximos = eventos.filter((e) => new Date(e.data_hora) >= agora);
  const passados = eventos.filter((e) => new Date(e.data_hora) < agora);

  return (
    <div className="space-y-8">
      {proximos.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
            Próximos
          </h3>
          <div className="space-y-2">
            {proximos.map((evento) => (
              <MeuEventoItem key={evento.id} evento={evento} />
            ))}
          </div>
        </section>
      )}

      {passados.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
            Já participei
          </h3>
          <div className="space-y-2">
            {passados.map((evento) => (
              <MeuEventoItem key={evento.id} evento={evento} passado />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function MeuEventoItem({
  evento,
  passado = false,
}: {
  evento: ReturnType<typeof useMeusEventos>["data"] extends
    | (infer T)[]
    | undefined
    ? T
    : never;
  passado?: boolean;
}) {
  const dataFormatada = new Date(evento.data_hora).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Link
      href={`/eventos/${evento.id}`}
      className={`flex items-center gap-3 p-3 rounded-2xl border bg-white hover:shadow-sm transition-shadow ${
        passado ? "opacity-60" : ""
      }`}
    >
      <div className="relative h-12 w-12 shrink-0 rounded-xl overflow-hidden bg-slate-100">
        {evento.trilhas?.imagem_url && (
          <Image
            src={evento.trilhas.imagem_url}
            alt={evento.trilhas.nome}
            fill
            className="object-cover"
          />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-medium text-sm truncate">{evento.titulo}</p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {dataFormatada}
          </span>
          {evento.trilhas && (
            <span className="flex items-center gap-1 truncate">
              <MapPin className="h-3 w-3" />
              {evento.trilhas.nome}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
