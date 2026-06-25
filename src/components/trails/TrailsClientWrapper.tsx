"use client";

import { Difficulty, ITrailMap, ITrail } from "@/src/types";
import TrailCard from "./TrailCard";
import { useState } from "react";
import { getCoordinates } from "@/src/utils/getCoordinates";
import TrailMap from "./TrailMapDynamic";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

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
      <div className="flex justify-center mb-6 md:mb-8 h-10">
        <Tabs
          value={activeFilter}
          onValueChange={(value) => filtrarTrilhas(value as Difficulty)}
        >
          <TabsList className="bg-white rounded-lg border shadow-sm overflow-x-auto no-scrollbar text-muted-foreground">
            {(["todas", "leve", "moderada", "difícil"] as const).map((d) => (
              <TabsTrigger
                key={d}
                value={d}
                className="text-sm capitalize whitespace-nowrap px-4 data-[state=active]:bg-dark-green data-[state=active]:text-white"
              >
                {d === "todas" ? "Todas" : d}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
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
