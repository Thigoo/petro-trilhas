"use client";

import { useEventos, Evento } from "@/src/hooks/useEventos";
import { EventoCard } from "@/src/components/events/EventoCard";
import { Calendar } from "lucide-react";

function isNaSemana(dataISO: string) {
  const data = new Date(dataISO);
  const hoje = new Date();
  const fimDaSemana = new Date(hoje);
  fimDaSemana.setDate(hoje.getDate() + (7 - hoje.getDay()));
  return data <= fimDaSemana;
}

function isNoMes(dataISO: string) {
  const data = new Date(dataISO);
  const hoje = new Date();
  return (
    data.getMonth() === hoje.getMonth() &&
    data.getFullYear() === hoje.getFullYear()
  );
}

function agruparPorPeriodo(eventos: Evento[]) {
  const grupos: { titulo: string; eventos: Evento[] }[] = [
    { titulo: "Esta semana", eventos: [] },
    { titulo: "Este mês", eventos: [] },
    { titulo: "Em breve", eventos: [] },
  ];

  for (const evento of eventos) {
    if (isNaSemana(evento.data_hora)) {
      grupos[0].eventos.push(evento);
    } else if (isNoMes(evento.data_hora)) {
      grupos[1].eventos.push(evento);
    } else {
      grupos[2].eventos.push(evento);
    }
  }

  return grupos.filter((g) => g.eventos.length > 0);
}

export default function EventosPage() {
  const { data: eventos = [], isLoading } = useEventos();
  const grupos = agruparPorPeriodo(eventos);

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-dark-green">
          Eventos
        </h1>
        <p className="text-muted-foreground mt-1 text-lg">
          Encontros e mutirões nas trilhas de Petrópolis
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-16 text-muted-foreground">
          Carregando eventos...
        </div>
      ) : eventos.length === 0 ? (
        <div className="text-center py-20">
          <Calendar className="h-10 w-10 mx-auto mb-3 text-slate-300" />
          <p className="text-muted-foreground">
            Nenhum evento agendado por agora. Volte em breve!
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {grupos.map((grupo) => (
            <section key={grupo.titulo}>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                {grupo.titulo}
              </h2>
              <div className="space-y-3">
                {grupo.eventos.map((evento) => (
                  <EventoCard key={evento.id} evento={evento} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
