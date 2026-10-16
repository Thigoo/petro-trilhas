"use client";

import GuiaForm from "@/src/components/admin/guias/GuiaForm";
import { Button } from "@/src/components/ui/button";
import { useGuia, useGuiaMutations } from "@/src/hooks/useGuias";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use } from "react";
import { toast } from "sonner";

export default function GuiasEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: guia, error, isLoading } = useGuia(id);
  const { editarGuia, editando } = useGuiaMutations();

  const handleUpdate = async (formData: FormData) => {
    try {
      await editarGuia({ guiaId: id, formData });
      toast.success("Guia cadastrado com sucesso!");
      router.push("/guias-admin");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao cadastrar guia");
    }
  };

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

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground mb-4">
          Não foi possível carregar as informções do guia.
        </p>
        <Button variant="outline" asChild>
          <Link href="/guias-admin">Voltar</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Editar Guia</h1>
        <p className="text-muted-foreground">Edite as informações do guia</p>
      </div>

      <GuiaForm
        mode="edit"
        onSubmit={handleUpdate}
        initialData={guia}
        isPending={editando}
      />
    </div>
  );
}
