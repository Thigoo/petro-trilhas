"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useEventoMutations } from "@/src/hooks/useEventos";
import EventoForm from "@/src/components/admin/events/EventoForm";

export interface NovoEvento {
  titulo: string;
  descricao?: string | null;
  organizador_nome: string;
  organizador_contato?: string | null;
  data_hora: string;
  vagas_limite?: number | null;
  trilha_id?: string | null;
  status?: "ativo" | "cancelado" | "concluido";
}

export default function NewEventoPage() {
  const router = useRouter();
  const { criarEvento, criando } = useEventoMutations();

  const handleSubmit = async (formData: FormData) => {
    try {
      const novoEvento: NovoEvento = {
        titulo: formData.get("titulo") as string,
        descricao: (formData.get("descricao") as string) || null,
        organizador_nome: formData.get("organizador_nome") as string,
        organizador_contato:
          (formData.get("organizador_contato") as string) || null,
        data_hora: formData.get("data_hora") as string,
        vagas_limite: formData.get("vagas_limite")
          ? parseInt(formData.get("vagas_limite") as string)
          : null,
        trilha_id:
          formData.get("trilha_id") === "none"
            ? null
            : (formData.get("trilha_id") as string) || null,
        status: "ativo",
      };

      await criarEvento(novoEvento);

      alert("Evento criado com sucesso!");
      router.push("/eventos-admin");
    } catch (error) {
      console.error(error);
      alert("Erro ao criar o evento. Tente novamente.");
    }
  };

  if (criando) return <div>Carregando...</div>;

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/eventos-admin">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Novo Evento</h1>
          <p className="text-muted-foreground">
            Crie um evento para uma trilha ou geral
          </p>
        </div>
      </div>

      <EventoForm mode="create" onSubmit={handleSubmit} />
    </div>
  );
}
