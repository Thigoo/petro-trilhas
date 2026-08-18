import { getTrailBySlug } from "@/src/api/trails";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { notFound } from "next/navigation";
import { ITrailMap } from "@/src/types";
import FavoriteButton from "@/src/components/shared/FavoriteButton";
import Image from "next/image";
import { Clock, MapPin, Ruler } from "lucide-react";
import TrailImageGallery from "@/src/components/trails/TrailImageGallery";
import { ShareButton } from "@/src/components/trails/ShareTrailButton";

import { Metadata } from "next";
import TrailWeather from "@/src/components/trails/TrailWeather";
import ExpandableDescription from "@/src/components/shared/ExpandableDescription";
import BackButton from "@/src/components/shared/BackButton";
import { getCoordinates } from "@/src/utils/getCoordinates";
import TrailMap from "@/src/components/trails/TrailMapDynamic";
import { EventoBadge } from "@/src/components/events/EventoBadge";
import Link from "next/link";
import { InfoCard } from "@/src/components/trails/InfoCard";
import { formatarTempoEstimado } from "@/src/utils/formatter";

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

        {trilha.imagem_url ? (
          <Image
            src={trilha.imagem_url}
            alt={trilha.nome}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-slate-800 to-slate-900">
            <span className="text-6xl">🏔️</span>
          </div>
        )}

        {/* Camadas de gradiente para profundidade e legibilidade */}
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-black/10" />
        <div className="absolute inset-0 bg-linear-to-r from-black/40 via-transparent to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 lg:p-12">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge
                variant="secondary"
                className="capitalize text-muted-foreground"
              >
                {trilha.dificuldade}
              </Badge>
              <Link href="/eventos">
                <EventoBadge trilhaId={trilha.id} />
              </Link>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.05] text-white tracking-tight drop-shadow-sm">
              {trilha.nome}
            </h1>

            {trilha.localizacao && (
              <p className="mt-3 flex items-center gap-2 text-base md:text-lg text-white/85">
                <MapPin className="w-5 h-5 shrink-0" />
                {trilha.localizacao}
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
                value={formatarTempoEstimado(trilha.tempo_estimado_min)}
              />
              {trilha.desnivel_m && (
                <InfoCard
                  icon="↑"
                  label="Desnível"
                  value={`${trilha.desnivel_m} m`}
                />
              )}
              {trilha.altitude_max ? (
                <InfoCard
                  icon="🏔️"
                  label="Altitude máx."
                  value={`${trilha.altitude_max} m`}
                />
              ) : null}
            </div>

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
            <div className="pt-2 space-y-3">
              <div className="flex gap-3">
                <Button
                  asChild
                  size="lg"
                  className="h-14 flex-1 text-base font-semibold rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-lg shadow-blue-500/25 transition-all duration-200"
                >
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MapPin className="mr-2.5 h-5 w-5" />
                    Como Chegar
                  </a>
                </Button>

                <FavoriteButton trilhaId={trilha.id} />

                <ShareButton
                  title={trilha.nome}
                  url={
                    typeof window !== "undefined" ? window.location.href : ""
                  }
                />
              </div>

              {/* <Button
    size="lg"
    className="w-full h-14 text-base font-semibold rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 shadow-lg shadow-emerald-500/30 transition-all duration-200"
    disabled
  >
    <Play className="mr-3 h-5 w-5" />
    Iniciar Trilha
    <span className="ml-2 text-xs opacity-75">(em breve)</span>
  </Button> */}
            </div>

            {/* Seção de Clima */}
            {mapTrail.coordinates && mapTrail.coordinates.length > 0 && (
              <TrailWeather
                latitude={mapTrail.coordinates[0][0]}
                longitude={mapTrail.coordinates[0][1]}
              />
            )}
          </div>

          {/* Mapa - Coluna Lateral */}
          <div className="lg:col-span-5">
            <h3 className="font-semibold text-muted-foreground mb-3 px-1">
              Mapa detalhado da trilha
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
