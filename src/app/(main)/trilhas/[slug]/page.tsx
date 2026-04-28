import { getTrailBySlug } from "@/src/lib/trails";
import TrailMap from "@/src/components/trails/TrailMap";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ITrailMap } from "@/src/types";
import FavoriteButton from "@/src/components/shared/FavoriteButton";
import Image from "next/image";
import { ArrowLeft, Clock, MapPin, Ruler } from "lucide-react";

export default async function TrilhaDetalhePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const trilha = await getTrailBySlug(slug);

  if (!trilha) notFound();

  const mapTrail: ITrailMap = {
    id: trilha.id,
    nome: trilha.nome,
    dificuldade: trilha.dificuldade,
    distancia_km: trilha.distancia_km,
    coordinates: trilha.geojson?.coordinates
      ? trilha.geojson.coordinates.map(([lng, lat]) => [lat, lng])
      : [],
  };

  // Imagens fake para demonstração de layout (substitua depois por trilha.imagens)
  const fakeImages = [
    trilha.imagem_url,
    "https://picsum.photos/id/1015/800/600",
    "https://picsum.photos/id/1016/800/600",
    "https://picsum.photos/id/133/800/600",
  ].filter(Boolean) as string[];

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Hero Section */}
      <div className="relative h-95 md:h-115 w-full">
        <Link
          href="/trilhas"
          className="z-10 absolute top-6 left-6 inline-flex items-center text-green-900 mb-6"
        >
          <ArrowLeft className="mr-2 h-5 w-5" /> Voltar
        </Link>
        {trilha.imagem_url && (
          <Image
            src={trilha.imagem_url}
            alt={trilha.nome}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
          <div className="max-w-5xl mx-auto">
            <Badge variant="secondary" className="mb-3 capitalize">
              {trilha.dificuldade}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              {trilha.nome}
            </h1>
            {trilha.localizacao && (
              <p className="mt-3 flex items-center gap-2 text-lg">
                <MapPin className="w-5 h-5" /> {trilha.localizacao}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-6xl -mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-14">
          {/* Coluna Principal */}
          <div className="lg:col-span-7 space-y-10">
            {/* Informações Técnicas */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <InfoCard
                icon={<Ruler className="w-5 h-5" />}
                label="Distância"
                value={`${trilha.distancia_km} km`}
              />
              <InfoCard
                icon={<Clock className="w-5 h-5" />}
                label="Tempo estimado"
                value={`${Math.floor(trilha.tempo_estimado_min / 60)}h ${trilha.tempo_estimado_min % 60}min`}
              />
              {trilha.desnivel_m && (
                <InfoCard
                  icon="↑"
                  label="Desnível"
                  value={`${trilha.desnivel_m} m`}
                />
              )}
              {trilha.altitude_max && (
                <InfoCard
                  icon="🏔️"
                  label="Altitude máx."
                  value={`${trilha.altitude_max} m`}
                />
              )}
            </div>

            {/* Descrição */}
            {trilha.descricao && (
              <div className="prose prose-slate max-w-none">
                <h2 className="text-2xl font-semibold mb-4 text-slate-800">
                  Sobre a trilha
                </h2>
                <p className="text-lg leading-relaxed text-slate-700">
                  {trilha.descricao}
                </p>
              </div>
            )}

            {/* Galeria de Imagens */}
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-slate-800">
                Fotos da trilha
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {fakeImages.map((img, index) => (
                  <div
                    key={index}
                    className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-sm"
                  >
                    <Image
                      src={img}
                      alt={`${trilha.nome} - foto ${index + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                      priority
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                size="lg"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-6 text-lg"
                disabled
              >
                Iniciar Trilha (em breve)
              </Button>

              <FavoriteButton trilhaId={trilha.id} />
            </div>
          </div>

          {/* Mapa - Coluna Lateral */}
          <div className="lg:col-span-5">
            <div className="sticky top-8">
              <h3 className="font-semibold text-slate-700 mb-3 px-1">
                Mapa da Trilha
              </h3>
              <div className="rounded-3xl overflow-hidden shadow-md bg-white p-2">
                <TrailMap
                  trails={[mapTrail]}
                  height="480px"
                  center={mapTrail.coordinates[0] || [-22.505, -43.178]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Componente auxiliar */
function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border shadow-sm">
      <div className="text-green-600 mb-2">{icon}</div>
      <p className="text-xs uppercase tracking-widest text-slate-500 font-medium">
        {label}
      </p>
      <p className="text-2xl font-semibold text-slate-800 mt-1">{value}</p>
    </div>
  );
}
