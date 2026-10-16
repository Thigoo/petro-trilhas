import Link from "next/link";
import { Plus } from "lucide-react";
import { getAllGuiasAdmin } from "@/src/api/guias";
import { Button } from "@/src/components/ui/button";
import AdminGuiaCard from "@/src/components/admin/guias/AdminGuiaCard";

export default async function GuiasAdminPage() {
  const guias = await getAllGuiasAdmin();
  console.log("Guias:", guias);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Guias</h1>
          <p className="text-muted-foreground">
            Gerencie os guias de ecoturismo credenciados
          </p>
        </div>

        <Button asChild>
          <Link href="/guias-admin/new">
            <Plus className="mr-2 h-4 w-4" />
            Novo Guia
          </Link>
        </Button>
      </div>
      <AdminGuiaCard guias={guias} />
    </div>
  );
}
