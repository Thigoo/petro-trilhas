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
  const { data: evento, isLoading } = useEvento(id);

  if (!evento) notFound();

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

      await editarEvento({
        eventoId: id,
        data: dadosAtualizados,
      });

      toast.success("Evento atualizado com sucesso!");
      router.push("/eventos-admin");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar evento.");
    }
  };

  if (editando || isLoading) return <div>Carregando...</div>;

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/eventos-admin">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Editar Evento</h1>
          <p className="text-muted-foreground">{evento.titulo}</p>
        </div>
      </div>

      <EventoForm onSubmit={handleUpdate} mode="edit" initialData={evento} />
    </div>
  );
}
