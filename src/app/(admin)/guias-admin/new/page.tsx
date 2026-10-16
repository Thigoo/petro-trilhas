"use client";

import GuiaForm from "@/src/components/admin/guias/GuiaForm";
import { useGuiaMutations } from "@/src/hooks/useGuias";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function GuiasNewPage() {
  const router = useRouter();
  const { criarGuia, criando } = useGuiaMutations();

  const handleSubmit = async (formData: FormData) => {
    try {
      await criarGuia(formData);
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
        <h1 className="text-3xl font-bold">Novo Guia</h1>
        <p className="text-muted-foreground">
          Cadastre um novo guia de ecoturismo credenciado
        </p>
      </div>

      <GuiaForm mode="create" onSubmit={handleSubmit} isPending={criando} />
    </div>
  );
}
