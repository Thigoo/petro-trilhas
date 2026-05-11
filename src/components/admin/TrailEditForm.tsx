"use client";

import { useRouter } from "next/navigation";
import { updateTrail } from "../../actions/admin/trails";
import { TrailForm } from "./TrailForm";

// TODO: tipar initialData
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function TrailEditForm({ initialData }: { initialData: any }) {
  const router = useRouter();

  const handleUpdate = async (data: FormData) => {
    const response = await updateTrail(initialData.id, data);

    if (response.success) {
      alert("✅ Trilha atualizada com sucesso!");
      router.push("/trilhas-admin");
      router.refresh();
    } else {
      console.error("❌ Erro:", response.message);
      alert(response.message || "Erro ao atualizar trilha");
    }
  };

  return <TrailForm initialData={initialData} onSubmit={handleUpdate} />;
}
