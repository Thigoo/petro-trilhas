"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Importamos o JSON (O Next.js permite importar JSON direto)
import castelinhoData from "@/public/data/castelinho.json";

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MapInner() {
  // Pegamos as coordenadas do JSON e invertemos para [lat, lng] que o Leaflet exige
  const castelinhoCoords = castelinhoData.features[0].geometry.coordinates.map(
    (coord) => [coord[1], coord[0]] as [number, number],
  );

  // Ponto inicial para o marcador
  const startPoint = castelinhoCoords[0];

  return (
    <MapContainer
      center={startPoint} // Centraliza na trilha
      zoom={15}
      scrollWheelZoom={false}
      className="h-full w-full"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Desenha a linha da trilha */}
      <Polyline
        positions={castelinhoCoords}
        pathOptions={{ color: "#16a34a", weight: 5, opacity: 0.7 }}
      />

      <Marker position={startPoint} icon={icon}>
        <Popup>
          <div className="font-sans">
            <h3 className="font-bold">
              {castelinhoData.features[0].properties.name}
            </h3>
            <p className="text-xs">
              {castelinhoData.features[0].properties.difficulty} •{" "}
              {castelinhoData.features[0].properties.distance}
            </p>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
