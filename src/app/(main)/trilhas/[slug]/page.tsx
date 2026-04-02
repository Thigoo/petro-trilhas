import { getTrailBySlug } from "@/src/lib/trails";
import TrailMap from "@/src/components/trails/TrailMap";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ITrailMap } from "@/src/types";

export default async function TrilhaDetalhePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const trilha = await getTrailBySlug(slug);

  if (!trilha) {
    notFound();
  }

  // Prepara dados para o mapa
  const mapTrail: ITrailMap = {
    id: trilha.id,
    nome: trilha.nome,
    dificuldade: trilha.dificuldade,
    distancia_km: trilha.distancia_km,
    coordinates: trilha.geojson?.coordinates
      ? trilha.geojson.coordinates.map(([lng, lat]) => [lat, lng])
      : [],
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <div className="container mx-auto p-4 md:p-6 max-w-5xl">
        {/* Botão Voltar */}
        <Link
          href="/trilhas"
          className="inline-flex items-center text-green-600 hover:text-green-700 mb-6"
        >
          ← Voltar para todas as trilhas
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Coluna Principal - Informações */}
          <div className="lg:col-span-3 space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Badge
                  variant="outline"
                  className="capitalize text-sm px-4 py-1"
                >
                  {trilha.dificuldade}
                </Badge>
                <span className="text-sm text-slate-500">
                  {trilha.distancia_km} km • {trilha.tempo_estimado_min} min
                </span>
              </div>

              <h1 className="text-4xl font-bold text-green-900 leading-tight">
                {trilha.nome}
              </h1>
            </div>

            {trilha.descricao && (
              <div className="prose prose-slate max-w-none">
                <p className="text-lg leading-relaxed text-slate-700">
                  {trilha.descricao}
                </p>
              </div>
            )}

            {/* Informações adicionais */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white p-4 rounded-2xl border">
                <span className="block text-slate-500 text-xs">Distância</span>
                <span className="text-2xl font-semibold">
                  {trilha.distancia_km} km
                </span>
              </div>
              <div className="bg-white p-4 rounded-2xl border">
                <span className="block text-slate-500 text-xs">
                  Tempo estimado
                </span>
                <span className="text-2xl font-semibold">
                  {trilha.tempo_estimado_min} min
                </span>
              </div>
            </div>

            {/* Ações */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                size="lg"
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Iniciar Trilha
              </Button>
              <Button size="lg" variant="outline" className="flex-1">
                Salvar nos Favoritos
              </Button>
            </div>
          </div>

          {/* Coluna do Mapa */}
          <div className="lg:col-span-2">
            <div className="sticky top-6">
              <div className="mb-4">
                <h3 className="font-semibold text-slate-700 mb-2">
                  Mapa da Trilha
                </h3>
              </div>
              <TrailMap
                trails={[mapTrail]}
                height="520px"
                className="rounded-3xl shadow-md"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
