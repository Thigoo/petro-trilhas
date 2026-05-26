"use client";

import { Difficulty, ITrailMap, ITrail } from "@/src/types";
import TrailCard from "./TrailCard";
import { useState } from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { getCoordinates } from "@/src/utils/getCoordinates";

const TrailMap = dynamic(() => import("@/src/components/trails/TrailMap"), {
  ssr: false,
  loading: () => <Skeleton className="h-155 w-full rounded-2xl" />,
});

export function TrailsClientWrapper({ trails }: { trails: ITrail[] }) {
  const [activeFilter, setActiveFilter] = useState<Difficulty>("todas");
  const [filteredTrails, setFilteredTrails] = useState<ITrail[]>(trails);

  const filtrarTrilhas = (dificuldade: Difficulty) => {
    setActiveFilter(dificuldade);
    if (dificuldade === "todas") {
      setFilteredTrails(trails);
    } else {
      setFilteredTrails(trails.filter((t) => t.dificuldade === dificuldade));
    }
  };

  const mapTrails: ITrailMap[] = filteredTrails
    .filter(
      (t) =>
        t.geojson?.type === "FeatureCollection" &&
        t.geojson.features?.length > 0,
    )
    .map((t) => {
      const geojson = t.geojson!;

      const lineFeature = geojson.features.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (f: any) => f.geometry?.type === "LineString",
      );

      const coordinates = getCoordinates(lineFeature?.geometry);

      return {
        id: t.id,
        nome: t.nome,
        slug: t.slug,
        dificuldade: t.dificuldade,
        distancia_km: t.distancia_km,
        coordinates: coordinates,
        geojson: geojson, // mantemos completo para usar POIs na página de detalhes
      };
    });

  return (
    <>
      {/* Filtros */}
      <div className="flex justify-center mb-6 md:mb-8">
        <div className="flex gap-2 bg-white p-1.5 rounded-2xl border shadow-sm overflow-x-auto no-scrollbar">
          {(["todas", "leve", "moderada", "difícil"] as const).map((d) => (
            <Button
              key={d}
              variant={activeFilter === d ? "default" : "ghost"}
              size="sm"
              onClick={() => filtrarTrilhas(d)}
              className="capitalize whitespace-nowrap"
            >
              {d === "todas" ? "Todas" : d}
            </Button>
          ))}
        </div>
      </div>

      {/* Mapa + Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Mapa */}
        <div className="lg:col-span-7 p-4">
          <TrailMap
            key={`map-${activeFilter}-${filteredTrails.length}`}
            height="480px"
            center={[-22.505, -43.178]}
            trails={mapTrails}
            withRoute={true}
          />
        </div>

        {/* Lista de Cards */}
        <div className="flex p-2 lg:col-span-5">
          <div className="w-full space-y-4 lg:sticky lg:max-h-[calc(100vh-160px)] lg:overflow-y-auto lg:pr-3">
            {filteredTrails.length > 0 ? (
              filteredTrails.map((trail) => (
                <TrailCard key={trail.id} trail={trail} />
              ))
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border">
                Nenhuma trilha encontrada com este filtro.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
