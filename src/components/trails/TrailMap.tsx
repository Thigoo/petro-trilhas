"use client";

import dynamic from "next/dynamic";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Correção necessária para ícones do Leaflet no Next.js
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Import dinâmico para evitar problemas de SSR
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

interface Trail {
  id: string;
  nome: string;
  dificuldade: string;
  distancia_km: number;
  coordinates: [number, number][]; // [lat, lng]
}

interface TrailMapProps {
  trails?: Trail[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  onTrailClick?: (trail: Trail) => void;
}

export default function TrailMap({
  trails = [],
  center = [-22.505, -43.178], // Coordenadas aproximadas de Petrópolis
  zoom = 13,
  height = "500px",
  onTrailClick,
}: TrailMapProps) {
  // Cor das trilhas baseada na dificuldade
  const getTrailColor = (dificuldade: string) => {
    switch (dificuldade.toLowerCase()) {
      case "leve":
        return "#22c55e";
      case "moderada":
        return "#eab308";
      case "difícil":
        return "#ef4444";
      default:
        return "#16a34a";
    }
  };

  return (
    <div
      style={{ height }}
      className="rounded-xl overflow-hidden border border-slate-200 shadow-sm"
    >
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {trails.map((trail) => (
          <div key={trail.id}>
            {/* Desenha a linha da trilha */}
            <Polyline
              positions={trail.coordinates}
              pathOptions={{
                color: getTrailColor(trail.dificuldade),
                weight: 5,
                opacity: 0.75,
              }}
              eventHandlers={{
                click: () => onTrailClick?.(trail),
              }}
            />

            {/* Marcador no início da trilha */}
            <Marker position={trail.coordinates[0]}>
              <Popup>
                <div className="font-sans min-w-45">
                  <h3 className="font-bold text-base">{trail.nome}</h3>
                  <p className="text-sm text-slate-600">
                    {trail.dificuldade} • {trail.distancia_km} km
                  </p>
                </div>
              </Popup>
            </Marker>
          </div>
        ))}
      </MapContainer>
    </div>
  );
}
