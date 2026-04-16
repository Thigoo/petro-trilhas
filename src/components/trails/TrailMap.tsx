"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ITrailMap } from "@/src/types";
import { useMap } from "react-leaflet";

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
}: TrailMapProps) {
  const mapRef = useRef<L.Map | null>(null);

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
              <Popup>
                <div>
                  <strong>{trail.nome}</strong>
                  <br />
                  {trail.dificuldade} • {trail.distancia_km} km
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
