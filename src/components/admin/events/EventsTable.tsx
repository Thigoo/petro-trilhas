"use client";

import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import Link from "next/link";
import { Edit, Trash2, Calendar, MapPin, User, Users } from "lucide-react";
import { deleteEvento } from "@/src/actions/admin/events";
import { useState } from "react";
import EventoDeleteModal from "./EventoDeleteModal";
import { toast } from "sonner";
import { Evento } from "@/src/hooks/useEventos";

// interface Evento {
//   id: string;
//   titulo: string;
//   descricao: string | null;
//   organizador_nome: string;
//   organizador_contato: string | null;
//   data_hora: string;
//   vagas_limite: number | null;
//   status: "ativo" | "cancelado" | "concluido";
//   criado_por: string;
//   created_at: string;
//   trilhas?: {
//     nome: string;
//     slug: string;
//     imagem_url: string | null;
//   };
// }

const statusConfig = {
  ativo: { label: "Ativo", variant: "default" as const },
  cancelado: { label: "Cancelado", variant: "destructive" as const },
  concluido: { label: "Concluído", variant: "secondary" as const },
};

function formatarDataHora(dataHora: string) {
  return new Date(dataHora).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function EventosTable({ eventos }: { eventos: Evento[] }) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<{
    id: string;
    titulo: string;
  } | null>(null);

  if (eventos.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
        Nenhum evento cadastrado ainda.
      </div>
    );
  }

  const handleDelete = (id: string, titulo: string) => {
    setEventToDelete({ id, titulo });
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!eventToDelete) return;

    try {
      await deleteEvento(eventToDelete.id);
      toast.success("Evento deletado com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao deletar evento");
    } finally {
      setDeleteModalOpen(false);
      setEventToDelete(null);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {eventos.map((evento) => {
          const status = statusConfig[evento.status];

          return (
            <div
              key={evento.id}
              className="bg-white rounded-2xl border p-4 space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold leading-snug">{evento.titulo}</h3>
                <Badge variant={status.variant} className="shrink-0">
                  {status.label}
                </Badge>
              </div>

              <div className="space-y-1.5 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Calendar size={15} className="text-slate-400 shrink-0" />
                  {formatarDataHora(evento.data_hora)}
                </div>

                <div className="flex items-center gap-2">
                  <User size={15} className="text-slate-400 shrink-0" />
                  {evento.organizador_nome}
                </div>

                <div className="flex items-center gap-2">
                  <MapPin size={15} className="text-slate-400 shrink-0" />
                  {evento.trilhas ? (
                    evento.trilhas.nome
                  ) : (
                    <span className="text-slate-400">Evento Geral</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Users size={15} className="text-slate-400 shrink-0" />
                  {evento.vagas_limite ? (
                    `${evento.vagas_limite} vagas`
                  ) : (
                    <span className="text-emerald-600">Vagas ilimitadas</span>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <Link href={`/eventos-admin/${evento.id}/edit`}>
                    <Edit size={15} className="mr-1.5" />
                    Editar
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-red-600 hover:bg-red-50 hover:text-red-600"
                  onClick={() => handleDelete(evento.id, evento.titulo)}
                >
                  <Trash2 size={15} className="mr-1.5" />
                  Excluir
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <EventoDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        titulo={eventToDelete?.titulo || ""}
      />
    </>
  );
}
