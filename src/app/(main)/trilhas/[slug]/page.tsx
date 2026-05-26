import { getTrailBySlug } from "@/src/api/trails";
import TrailMap from "@/src/components/trails/TrailMap";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { notFound } from "next/navigation";
import { ITrailMap } from "@/src/types";
import FavoriteButton from "@/src/components/shared/FavoriteButton";
import Image from "next/image";
import { Clock, MapPin, Play, Ruler } from "lucide-react";
import TrailImageGallery from "@/src/components/trails/TrailImageGallery";
import { ShareButton } from "@/src/components/trails/ShareTrailButton";

import { Metadata } from "next";
import TrailWeather from "@/src/components/trails/TrailWeather";
import ExpandableDescription from "@/src/components/shared/ExpandableDescription";
import BackButton from "@/src/components/shared/BackButton";
import { getCoordinates } from "@/src/utils/getCoordinates";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const trilha = await getTrailBySlug(slug);

  if (!trilha) {
    return {
      title: "Trilha não encontrada | Petro Trilhas",
    };
  }

  const description =
    trilha.descricao_curta || trilha.descricao?.substring(0, 155) || "";

  return {
    title: `${trilha.nome} | Petro Trilhas`,
    description: description,

    openGraph: {
      title: trilha.nome,
      description: description,
      images: [
        {
          url: trilha.imagem_url || "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: trilha.nome,
        },
      ],
      type: "article",
    },
  };
}

export default async function TrilhaDetalhePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const trilha = await getTrailBySlug(slug);

  if (!trilha) notFound();

  let lat = -22.505;
  let lng = -43.178;

  if (trilha.geojson?.type === "FeatureCollection" && trilha.geojson.features) {
    const lineFeature = trilha.geojson.features.find(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (f: any) => f.geometry?.type === "LineString",
    );

    if (lineFeature?.geometry?.coordinates?.length ?? 0 > 0) {
      const firstPoint = lineFeature?.geometry.coordinates[0] as [
        number,
        number,
      ];
      if (firstPoint) {
        lng = firstPoint[0]; // longitude
        lat = firstPoint[1]; // latitude
      }
    }
  }

  const mapTrail: ITrailMap = {
    id: trilha.id,
    nome: trilha.nome,
    slug: trilha.slug,
    dificuldade: trilha.dificuldade,
    distancia_km: trilha.distancia_km,
    coordinates: getCoordinates(trilha.geojson),
    geojson: trilha.geojson,
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Hero Section */}
      <div className="relative h-87.5 md:h-125 w-full overflow-hidden">
        <BackButton />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
        {trilha.imagem_url && (
          <Image
            src={trilha.imagem_url}
            alt={trilha.nome}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            priority
          />
        )}

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
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
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

            {/* Seção de Clima */}
            {mapTrail.coordinates && mapTrail.coordinates.length > 0 && (
              <TrailWeather
                latitude={mapTrail.coordinates[0][0]}
                longitude={mapTrail.coordinates[0][1]}
              />
            )}

            {/* Descrição */}
            {trilha.descricao && (
              <ExpandableDescription description={trilha.descricao} />
            )}

            {/* Galeria de Imagens */}
            <TrailImageGallery
              images={trilha.imagens || []}
              trailName={trilha.nome}
            />

            {/* Ações da Trilha */}
            <div className="pt-8 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  size="lg"
                  className="h-14 text-base font-semibold rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 shadow-lg shadow-emerald-500/30 transition-all duration-200"
                  disabled
                >
                  <Play className="mr-3 h-5 w-5" />
                  Iniciar Trilha
                  <span className="ml-2 text-xs opacity-75">(em breve)</span>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-14 text-base font-semibold rounded-2xl border-2 bg-blue-100 text-blue-500 hover:bg-blue-200 hover:text-blue-500 transition-all"
                >
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MapPin className="mr-3 h-5 w-5" />
                    Como Chegar
                  </a>
                </Button>
              </div>

              <div className="flex gap-3 pt-2">
                <FavoriteButton trilhaId={trilha.id} />

                <ShareButton
                  title={trilha.nome}
                  url={
                    typeof window !== "undefined" ? window.location.href : ""
                  }
                />
              </div>
            </div>
          </div>

          {/* Mapa - Coluna Lateral */}
          <div className="lg:col-span-5">
            <h3 className="font-semibold text-slate-700 mb-3 px-1">
              Mapa da Trilha
            </h3>
            <div className="rounded-3xl overflow-hidden shadow-md bg-white p-2">
              <TrailMap
                trails={[mapTrail]}
                height="480px"
                center={[lat, lng]}
                withRoute={false}
                zoom={14}
                showPoi
              />
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
