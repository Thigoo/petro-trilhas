"use client";

import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import Link from "next/link";
import { Edit, Trash2, Calendar, MapPin } from "lucide-react";
import { deleteEvento } from "@/src/actions/admin/events";
import { useState } from "react";
import EventoDeleteModal from "./EventoDeleteModal";
import { toast } from "sonner";

interface Evento {
  id: string;
  titulo: string;
  descricao: string | null;
  organizador_nome: string;
  organizador_contato: string | null;
  data_hora: string;
  vagas_limite: number | null;
  status: "ativo" | "cancelado" | "concluido";
  criado_por: string;
  created_at: string;
  trilhas?: {
    nome: string;
    slug: string;
    imagem_url: string | null;
  };
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

  const handleDelete = async (id: string, titulo: string) => {
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
    <div className="rounded-xl border bg-white overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Evento</TableHead>
            <TableHead>Data e Hora</TableHead>
            <TableHead>Organizador</TableHead>
            <TableHead>Trilha</TableHead>
            <TableHead>Vagas</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {eventos.map((evento) => {
            const dataFormatada = new Date(evento.data_hora).toLocaleDateString(
              "pt-BR",
              {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              },
            );

            return (
              <TableRow key={evento.id}>
                <TableCell className="font-medium">{evento.titulo}</TableCell>

                <TableCell>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar size={16} className="text-slate-500" />
                    {dataFormatada}
                  </div>
                </TableCell>

                <TableCell>{evento.organizador_nome}</TableCell>

                <TableCell>
                  {evento.trilhas ? (
                    <div className="flex items-center gap-1.5 text-sm">
                      <MapPin size={16} className="text-slate-500" />
                      {evento.trilhas.nome}
                    </div>
                  ) : (
                    <span className="text-slate-400 text-sm">Evento Geral</span>
                  )}
                </TableCell>

                <TableCell>
                  {evento.vagas_limite ? (
                    <span>{evento.vagas_limite} vagas</span>
                  ) : (
                    <span className="text-emerald-600">Ilimitado</span>
                  )}
                </TableCell>

                <TableCell>
                  <Badge
                    variant={
                      evento.status === "ativo"
                        ? "default"
                        : evento.status === "cancelado"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {evento.status === "ativo"
                      ? "Ativo"
                      : evento.status === "cancelado"
                        ? "Cancelado"
                        : "Concluído"}
                  </Badge>
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon" asChild>
                      <Link href={`/eventos-admin/${evento.id}/edit`}>
                        <Edit size={16} />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => handleDelete(evento.id, evento.titulo)}
                    >
                      <Trash2 size={16} />
                    </Button>
                    <EventoDeleteModal
                      isOpen={deleteModalOpen}
                      onClose={() => setDeleteModalOpen(false)}
                      onConfirm={confirmDelete}
                      titulo={eventToDelete?.titulo || ""}
                    />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
