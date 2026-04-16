"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getTrailBySlug } from "@/src/lib/trails";
import TrailMap from "@/src/components/trails/TrailMap";
import { Button } from "@/src/components/ui/button";
import { ArrowLeft, AlertTriangle, Flag } from "lucide-react";
import Link from "next/link";
import { ITrail } from "@/src/types";
import LoadingScreen from "@/src/components/shared/LoadingScreen";
import ProtectedRoute from "@/src/lib/auth/ProtectedRoute";

export default function ActiveTrailPage() {
  const params = useParams();
  const router = useRouter();

  const slug = params.slug as string;

  const [trail, setTrail] = useState<ITrail | null>(null);
  const [userPosition, setUserPosition] = useState<[number, number]>([0, 0]);
  const [loading, setLoading] = useState(true);
  const [loadingUserPosition, setLoadingUserPosition] = useState(true);
  const [isTracking, setIsTracking] = useState(false);
  const [followUser, setFollowUser] = useState(true);

  useEffect(() => {
    async function loadTrilha() {
      const data = await getTrailBySlug(slug);
      if (data) setTrail(data);
      setLoading(false);
    }
    loadTrilha();
  }, [slug]);

  // Inicia rastreamento GPS
  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Seu navegador não suporta geolocalização.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLoadingUserPosition(true);
        const { latitude, longitude } = position.coords;
        setUserPosition([latitude, longitude]);
        setLoadingUserPosition(false);
        setIsTracking(true);
      },
      (error) => {
        console.error("Erro no GPS:", error);
        alert(
          "Não foi possível obter sua localização. Verifique as permissões.",
        );
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 15000,
      },
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  const handleFinalizarTrilha = () => {
    router.push(`/trilhas/${slug}/checkin`);
  };

  if (loading) return <LoadingScreen />;
  if (!trail)
    return <div className="text-center py-20">Trilha não encontrada.</div>;

  return (
    <ProtectedRoute>
      <div className="fixed inset-0 bg-slate-950 z-50 flex flex-col">
        {/* Header superior */}
        <div className="bg-black/80 backdrop-blur-md p-4 flex items-center justify-between text-white z-10">
          <Link href={`/trilhas/${slug}`} className="flex items-center gap-2">
            <ArrowLeft size={24} />
            <span className="font-medium">Voltar</span>
          </Link>

          <div className="text-center">
            <p className="text-sm text-slate-400">Modo Trilha Ativa</p>
            <p className="font-semibold">{trail.nome}</p>
          </div>

          <Button
            variant="destructive"
            size="sm"
            onClick={handleFinalizarTrilha}
          >
            <Flag className="mr-2" size={18} />
            Finalizar
          </Button>
        </div>

        {/* Mapa em tela cheia */}
        <div className="flex-1 relative">
          {!loadingUserPosition && (
            <TrailMap
              height="100%"
              center={userPosition} // Petrópolis
              userPosition={userPosition}
              trails={[
                {
                  id: trail.id,
                  nome: trail.nome,
                  dificuldade: trail.dificuldade,
                  distancia_km: trail.distancia_km,
                  coordinates: trail.geojson?.coordinates
                    ? trail.geojson.coordinates.map(([lng, lat]) => [lat, lng])
                    : [],
                },
              ]}
              followUser={followUser}
            />
          )}
          {isTracking && userPosition && (
            <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-4 py-2 rounded-full w-75 z-100 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Rastreando posição • {userPosition[0].toFixed(4)},{" "}
              {userPosition[1].toFixed(4)}
            </div>
          )}
        </div>

        {/* Botão flutuante de reporte */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-0">
          {/* Botão flutuante de reporte - Versão corrigida */}
          <div className="flex fixed bottom-6 left-1/2 -translate-x-1/2 z-100 pointer-events-auto">
            <Button
              onClick={() => setFollowUser(!followUser)}
              variant={followUser ? "default" : "secondary"}
              className="bg-green-600 hover:bg-orange-700 shadow-2xl rounded-full px-8 py-7 text-white flex items-center gap-3 text-base font-medium"
              size="lg"
            >
              {followUser ? "Parar de seguir" : "Seguir minha posição"}
            </Button>
            <Button
              size="lg"
              className="bg-orange-600 hover:bg-orange-700 shadow-2xl rounded-full px-8 py-7 text-white flex items-center gap-3 text-base font-medium"
              onClick={() => console.log("Reportar problema clicado")}
            >
              <AlertTriangle size={24} />
              Reportar Problema
            </Button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
