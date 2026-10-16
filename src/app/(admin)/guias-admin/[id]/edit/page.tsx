"use client";

import GuiaForm from "@/src/components/admin/guias/GuiaForm";
import { useGuiaMutations } from "@/src/hooks/useGuias";
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
  const { editarGuia, editando } = useGuiaMutations();

  const handleSubmit = async (formData: FormData) => {
    try {
      await editarGuia({ guiaId: id, formData });
      toast.success("Guia cadastrado com sucesso!");
      router.push("/guias-admin");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao cadastrar guia");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Editar Guia</h1>
        <p className="text-muted-foreground">Edite as informações do guia</p>
      </div>

      <GuiaForm mode="edit" onSubmit={handleSubmit} isPending={editando} />
    </div>
  );
}
