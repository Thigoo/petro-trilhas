import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Plus } from "lucide-react";
import Link from "next/link";
import { getTrails } from "@/src/lib/trails";
import TrailsTable from "@/src/components/admin/TrailsTable";

export default async function AdminTrilhasPage() {
  const trails = await getTrails();
  const published = trails.filter((t) => t.publicada === true);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trilhas</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie todas as trilhas cadastradas no sistema
          </p>
        </div>

        <Button asChild className="shrink-0">
          <Link href="/admin/trilhas/new">
            <Plus className="mr-2 h-4 w-4" />
            Nova Trilha
          </Link>
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Badge variant="secondary" className="px-4 py-2 text-sm">
          Total: <span className="font-semibold ml-1">{trails.length}</span>
        </Badge>

        <Badge variant="default" className="px-4 py-2 text-sm bg-green-600">
          Publicadas:{" "}
          <span className="font-semibold ml-1">{published.length}</span>
        </Badge>

        <Badge variant="outline" className="px-4 py-2 text-sm">
          Rascunhos:{" "}
          <span className="font-semibold ml-1">
            {trails.length - published.length}
          </span>
        </Badge>
      </div>
      {/* Listagem de trilhas */}
      <div>
        <TrailsTable trails={trails} />
      </div>
    </div>
  );
}
