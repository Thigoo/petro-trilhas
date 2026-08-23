"use client";

import EventoForm from "@/src/components/admin/events/EventoForm";
import { Button } from "@/src/components/ui/button";
import { useEvento, useEventoMutations } from "@/src/hooks/useEventos";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { use } from "react";
import { toast } from "sonner";

export default function EditEventoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { editarEvento, editando } = useEventoMutations();
  const { data: evento, isLoading, error } = useEvento(id);

  const handleUpdate = async (formData: FormData) => {
    try {
      const dadosAtualizados = {
        titulo: formData.get("titulo") as string,
        descricao: (formData.get("descricao") as string) || null,
        organizador_nome: formData.get("organizador_nome") as string,
        organizador_contato:
          (formData.get("organizador_contato") as string) || null,
        data_hora: formData.get("data_hora") as string,
        vagas_limite: formData.get("vagas_limite")
          ? Number(formData.get("vagas_limite"))
          : null,
        trilha_id:
          formData.get("trilha_id") === "none"
            ? null
            : (formData.get("trilha_id") as string) || null,
      };

      await editarEvento({ eventoId: id, data: dadosAtualizados });

      toast.success("Evento atualizado com sucesso!");
      router.push("/eventos-admin");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar evento.");
    }
  };

  // 1. Loading — só aqui, antes de qualquer decisão sobre os dados
  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-9 w-9 rounded-md bg-muted animate-pulse" />
          <div className="space-y-2">
            <div className="h-7 w-40 bg-muted rounded animate-pulse" />
            <div className="h-4 w-56 bg-muted rounded animate-pulse" />
          </div>
        </div>
        <div className="h-96 bg-muted rounded-2xl animate-pulse" />
      </div>
    );
  }

  // 2. Erro real (RLS, rede etc) — trata separado de "não existe"
  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground mb-4">
          Não foi possível carregar este evento.
        </p>
        <Button variant="outline" asChild>
          <Link href="/eventos-admin">Voltar</Link>
        </Button>
      </div>
    );
  }

  // 3. Só agora, com loading resolvido e sem erro, faz sentido dizer "não existe"
  if (!evento) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 md:py-8">
      <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
        <Button variant="ghost" size="icon" asChild className="shrink-0">
          <Link href="/eventos-admin">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold truncate">
            Editar Evento
          </h1>
          <p className="text-sm md:text-base text-muted-foreground truncate">
            {evento.titulo}
          </p>
        </div>
      </div>

      <EventoForm
        onSubmit={handleUpdate}
        mode="edit"
        initialData={evento}
        isPending={editando}
      />
    </div>
  );
}
