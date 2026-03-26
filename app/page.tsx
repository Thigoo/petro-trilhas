"use client";

import dynamic from "next/dynamic";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Aqui está o segredo: carregamos o componente desativando o SSR
const Map = dynamic(() => import("@/components/map/map-inner"), {
  ssr: false,
  loading: () => (
    <div className="h-100 w-full bg-muted animate-pulse rounded-lg flex items-center justify-center">
      Carregando mapa das trilhas...
    </div>
  ),
});

export default function HomePage() {
  return (
    <main className="container mx-auto p-4 space-y-6">
      <header className="py-6">
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          Petro Trilhas
        </h1>
        <p className="text-muted-foreground">
          Ecoturismo seguro e sustentável na Serra Fluminense.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-full md:col-span-1">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Explorar Mapa</CardTitle>
              <Badge variant="outline">Petrópolis/RJ</Badge>
            </div>
            <CardDescription>
              Visualize as trilhas oficiais e pontos de interesse.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Adicionamos uma div com altura fixa aqui para garantir que o mapa apareça */}
            <div className="h-100 w-full">
              <Map />
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Destaque do Dia</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-secondary rounded-md">
              <h3 className="font-semibold">Pedra do Cortiço</h3>
              <p className="text-sm text-muted-foreground">
                Nível: Moderado • 1h30 de subida
              </p>
            </div>
            <p className="text-sm italic text-orange-600 font-medium">
              ⚠️ Alerta: Possibilidade de chuva isolada à tarde.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
