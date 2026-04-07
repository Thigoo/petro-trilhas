"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Correção de ícones do Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
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

interface MapTrail {
  id: string;
  nome: string;
  dificuldade: string;
  distancia_km: number;
  coordinates: [number, number][];
}

interface TrailMapProps {
  trails: MapTrail[];
  height?: string;
  center?: [number, number];
  className?: string;
}

export default function TrailMap({
  trails,
  height = "500px",
  center,
  className = "",
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
        className="h-full w-full"
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
          </div>
        ))}
      </MapContainer>
    </div>
  );
}
