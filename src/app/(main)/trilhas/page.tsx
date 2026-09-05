import { TrailsClientWrapper } from "@/src/components/trails/TrailsClientWrapper";
import { getPublishedTrails } from "@/src/api/trails";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trilhas em Petrópolis",
  description:
    "Encontre trilhas em Petrópolis para diferentes níveis de experiência. Explore percursos, descubra novos lugares e aproveite a natureza da cidade.",
};

export default async function TrailsPage() {
  const allTrails = await getPublishedTrails();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto p-4 md:p-6">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-dark-green">
            Explorar Trilhas
          </h1>
          <p className="text-muted-foreground mt-1 text-md">
            {allTrails.length} trilhas disponíveis em Petrópolis
          </p>
        </div>

        {/* Conteúdo principal */}
        <TrailsClientWrapper trails={allTrails} />
      </div>
    </div>
  );
}
