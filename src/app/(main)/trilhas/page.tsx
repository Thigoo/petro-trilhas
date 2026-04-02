import { TrailsClientWrapper } from "@/src/components/trails/TrailsClientWrapper";
import { getTrails } from "@/src/lib/trails";

export default async function TrailsPage() {
  const allTrails = await getTrails();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto p-4 md:p-6">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-green-900">
            Explorar Trilhas
          </h1>
          <p className="text-muted-foreground mt-1 text-lg">
            {allTrails.length} trilhas disponíveis em Petrópolis
          </p>
        </div>

        {/* Conteúdo principal */}
        <TrailsClientWrapper trails={allTrails} />
      </div>
    </div>
  );
}
