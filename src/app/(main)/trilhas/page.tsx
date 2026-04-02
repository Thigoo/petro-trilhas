"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Button } from "@/src/components/ui/button";
import { getTrails } from "@/src/lib/trails";
import type { Trail, TrailMap } from "@/src/types";
import TrailCard from "@/src/components/trails/TrailCard";

const MapTrail = dynamic(() => import("@/src/components/trails/TrailMap"), {
  ssr: false,
  loading: () => <Skeleton className="h-155 w-full rounded-2xl" />,
});

export default function TrailsPage() {
  const [allTrails, setAllTrails] = useState<Trail[]>([]);
  const [filteredTrails, setFilteredTrails] = useState<Trail[]>([]);
  const [activeFilter, setActiveFilter] = useState<
    "todas" | "leve" | "moderada" | "difícil"
  >("todas");
  const [loading, setLoading] = useState(true);

  // Carrega as trilhas do Supabase
  useEffect(() => {
    async function loadData() {
      try {
        const dados = await getTrails();
        setAllTrails(dados);
        setFilteredTrails(dados);
      } catch (error) {
        console.error("Erro ao carregar trilhas:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filtra as trilhas
  const filtrarTrilhas = (
    dificuldade: "todas" | "leve" | "moderada" | "difícil",
  ) => {
    setActiveFilter(dificuldade);

    if (dificuldade === "todas") {
      setFilteredTrails(allTrails);
    } else {
      setFilteredTrails(allTrails.filter((t) => t.dificuldade === dificuldade));
    }
  };

  // Prepara os dados para o mapa (converte geojson para formato [lat, lng])
  const mapTrails: TrailMap[] = filteredTrails
    .filter((t) => t.geojson?.coordinates && t.geojson.coordinates.length > 0)
    .map((t) => ({
      id: t.id,
      nome: t.nome,
      dificuldade: t.dificuldade,
      distancia_km: t.distancia_km,
      coordinates: t.geojson!.coordinates.map(
        ([lng, lat]: [number, number]) => [lat, lng],
      ),
    }));

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <Skeleton className="h-12 w-80 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Skeleton className="lg:col-span-8 h-155 rounded-2xl" />
          <div className="lg:col-span-4 space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <div className="container mx-auto p-6">
        {/* Cabeçalho da página */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-green-900">
              Explorar Trilhas
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              {filteredTrails.length} trilhas disponíveis em Petrópolis
            </p>
          </div>

          {/* Filtros */}
          <div className="flex gap-2 bg-white p-1.5 rounded-2xl border shadow-sm">
            {(["todas", "leve", "moderada", "difícil"] as const).map((d) => (
              <Button
                key={d}
                variant={activeFilter === d ? "default" : "ghost"}
                size="sm"
                onClick={() => filtrarTrilhas(d)}
                className="capitalize px-8 font-medium"
              >
                {d === "todas" ? "Todas" : d}
              </Button>
            ))}
          </div>
        </div>

        {/* Layout: Mapa + Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Mapa - 8 colunas no desktop */}
          <div className="lg:col-span-8">
            <MapTrail height="620px" trails={mapTrails} />
          </div>

          {/* Lista de Cards - 4 colunas no desktop */}
          <div className="lg:col-span-4">
            <div className="sticky top-6 space-y-4 max-h-[calc(100vh-140px)] overflow-y-auto pr-3">
              {filteredTrails.length > 0 ? (
                filteredTrails.map((trilha) => (
                  <TrailCard key={trilha.id} trail={trilha} />
                ))
              ) : (
                <div className="text-center py-20 bg-white rounded-2xl border">
                  <p className="text-muted-foreground">
                    Nenhuma trilha encontrada com este filtro.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
