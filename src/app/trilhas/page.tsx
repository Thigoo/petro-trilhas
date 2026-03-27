"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { getTrilhas, type Trilha } from "@/src/lib/trilhas";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Skeleton } from "@/src/components/ui/skeleton";

// Carregamos o seu TrailMap com SSR desativado
const TrailMap = dynamic(() => import("@/src/components/map/TrailMap"), {
  ssr: false,
  loading: () => <Skeleton className="h-125 w-full rounded-xl" />,
});

export default function TrilhasPage() {
  const [todasTrilhas, setTodasTrilhas] = useState<Trilha[]>([]);
  const [trilhasFiltradas, setTrilhasFiltradas] = useState<Trilha[]>([]);
  const [filtroAtivo, setFiltroAtivo] = useState<string>("todas");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        const dados = await getTrilhas();
        setTodasTrilhas(dados);
        setTrilhasFiltradas(dados);
      } catch (error) {
        console.error("Erro ao carregar trilhas:", error);
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, []);

  // Lógica de Filtro
  const filtrarTrilhas = (dificuldade: string) => {
    setFiltroAtivo(dificuldade);
    if (dificuldade === "todas") {
      setTrilhasFiltradas(todasTrilhas);
    } else {
      setTrilhasFiltradas(
        todasTrilhas.filter((t) => t.dificuldade === dificuldade),
      );
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-4">
        <Skeleton className="h-10 w-62.5" />
        <Skeleton className="h-125 w-full" />
      </div>
    );
  }

  return (
    <main className="container mx-auto p-4 space-y-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-green-900">
            Explorar Petrópolis
          </h1>
          <p className="text-muted-foreground">
            {trilhasFiltradas.length} trilhas encontradas.
          </p>
        </div>

        {/* Filtros de Dificuldade */}
        <div className="flex gap-2 p-1 bg-muted rounded-lg border">
          {["todas", "leve", "moderada", "difícil"].map((d) => (
            <Button
              key={d}
              variant={filtroAtivo === d ? "default" : "ghost"}
              size="sm"
              onClick={() => filtrarTrilhas(d)}
              className="capitalize"
            >
              {d}
            </Button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Mapa - Ocupa 3 colunas */}
        <div className="lg:col-span-3">
          <TrailMap
            height="550px"
            trails={trilhasFiltradas
              .filter((t) => t.geojson && t.geojson.coordinates.length > 0) // <--- FILTRO DE SEGURANÇA
              .map((t) => ({
                id: t.id,
                nome: t.nome,
                dificuldade: t.dificuldade,
                distancia_km: Number(t.distancia_km),
                coordinates: t.geojson.coordinates.map((c: any) => [
                  c[1],
                  c[0],
                ]),
              }))}
          />
        </div>

        {/* Lista Lateral - Ocupa 1 coluna */}
        <aside className="space-y-4 max-h-137.5 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-green-200">
          {trilhasFiltradas.map((t) => (
            <Card
              key={t.id}
              className="hover:border-green-500 transition-all cursor-pointer group"
            >
              <CardHeader className="p-4">
                <div className="flex justify-between items-start mb-1">
                  <CardTitle className="text-base group-hover:text-green-700 transition-colors">
                    {t.nome}
                  </CardTitle>
                  <Badge variant="outline" className="capitalize text-[10px]">
                    {t.dificuldade}
                  </Badge>
                </div>
                <CardDescription className="text-xs line-clamp-2">
                  {t.descricao}
                </CardDescription>
                <div className="flex items-center gap-3 mt-3 text-[11px] font-semibold text-slate-500">
                  <span className="flex items-center gap-1">
                    📏 {t.distancia_km}km
                  </span>
                  <span className="flex items-center gap-1">
                    ⏱️ {t.tempo_estimado_min}min
                  </span>
                </div>
              </CardHeader>
            </Card>
          ))}
          {trilhasFiltradas.length === 0 && (
            <div className="text-center p-8 text-muted-foreground">
              Nenhuma trilha encontrada neste nível.
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
