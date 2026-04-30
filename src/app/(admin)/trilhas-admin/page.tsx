import { Button } from "@/src/components/ui/button";
import { getTrails } from "@/src/lib/trails";
import { Plus } from "lucide-react";
import Link from "next/link";
// import { DataTable } from "@/src/components/admin/DataTable";
// import { columns } from "@/src/components/admin/trilhas/columns";

export default async function AdminTrilhasPage() {
  const trilhas = await getTrails();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trilhas</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie todas as trilhas cadastradas
          </p>
        </div>

        <Button asChild>
          <Link href="/admin/trilhas/new">
            <Plus className="mr-2 h-4 w-4" />
            Nova Trilha
          </Link>
        </Button>
      </div>

      <h1>
        AQUI VEM A TABELA com as trilhas {trilhas.map((trilha) => trilha.nome)}
      </h1>
    </div>
  );
}
