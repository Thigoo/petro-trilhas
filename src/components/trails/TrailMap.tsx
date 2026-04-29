"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ITrailMap } from "@/src/types";
import { useMap } from "react-leaflet";
import Link from "next/link";
import { ArrowRight, RotateCw } from "lucide-react";
import { Button } from "../ui/button";

// Correção de ícones do Leaflet
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const userIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);

const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false },
);

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false },
);

const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

interface TrailMapProps {
  trails: ITrailMap[];
  height?: string;
  center?: [number, number];
  className?: string;
  userPosition?: [number, number] | null;
  followUser?: boolean;
  withRoute?: boolean;
}

function AutoFollow({
  userPosition,
  followUser,
}: {
  userPosition: [number, number] | null;
  followUser: boolean;
}) {
  const map = useMap();

  useEffect(() => {
    if (userPosition && followUser) {
      map.flyTo(userPosition, map.getZoom(), {
        animate: true,
        duration: 1.2,
      });
    }
  }, [userPosition, followUser, map]);
  return null;
}

export default function TrailMap({
  trails,
  height = "500px",
  center,
  className = "",
  userPosition,
  followUser = false,
  withRoute = false,
}: TrailMapProps) {
  const mapRef = useRef<L.Map | null>(null);

  const goToCenter = () => {
    if (mapRef.current) {
      if (!center) return;
      mapRef.current.flyTo(center, mapRef.current.getZoom(), {
        animate: true,
        duration: 1.2,
      });
    }
  };

  // Cleanup importante para evitar erro de "Map container is being reused"
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div
      className={`rounded-2xl overflow-hidden border border-slate-200 shadow-sm ${className}`}
      style={{ height }}
    >
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full z-0"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Button
          variant="outline"
          size="icon"
          onClick={goToCenter}
          className="absolute bottom-10 right-5 z-1000 h-12 w-12 rounded-full shadow-md bg-white hover:bg-slate-50 border-slate-200"
          title="Centralizar mapa"
        >
          <RotateCw size={24} className="text-green-700" />
        </Button>

        {trails.map((trail) => (
          <div key={trail.id}>
            <Polyline
              positions={trail.coordinates}
              pathOptions={{
                color:
                  trail.dificuldade === "difícil"
                    ? "#ef4444"
                    : trail.dificuldade === "moderada"
                      ? "#eab308"
                      : "#22c55e",
                weight: 5,
                opacity: 0.8,
              }}
            />
            <Marker position={trail.coordinates[0]}>
              <Popup className="custom-popup">
                <div className="min-w-35">
                  <strong className="block text-base">{trail.nome}</strong>

                  <div className="flex items-center justify-between w-full pt-2">
                    {trail.dificuldade} • {trail.distancia_km} km
                    {withRoute && (
                      <Link
                        href={`/trilhas/${trail.slug}`}
                        className="font-medium text-md group"
                      >
                        <ArrowRight
                          size={18}
                          className="text-green-600 hover:text-green-700 group-hover:translate-x-0.5 transition-transform bg-slate-100 rounded-full -p-2"
                        />
                      </Link>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
            {userPosition && (
              <Marker position={userPosition} icon={userIcon}>
                <Popup>
                  <strong>Você está aqui!</strong>
                  <br />
                  Posição atualizada em tempo real
                </Popup>
              </Marker>
            )}
          </div>
        ))}
        <AutoFollow
          userPosition={userPosition ?? null}
          followUser={followUser}
        />
      </MapContainer>
    </div>
  );
}
