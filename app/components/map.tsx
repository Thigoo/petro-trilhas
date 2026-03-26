"use client"; // Indica que este componente roda apenas no navegador

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Corrigindo o bug dos ícones do Leaflet no Next.js
// Sem isso, o marcador da trilha não aparece corretamente
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MapClient() {
  // Coordenadas centrais de Petrópolis para o início do app
  const petropolisPos: [number, number] = [-22.5122, -43.1789];

  return (
    <div className="h-100 w-full rounded-lg border shadow-sm overflow-hidden">
      <MapContainer
        center={petropolisPos}
        zoom={13}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={petropolisPos} icon={icon}>
          <Popup>
            Bem-vindo ao Petro Trilhas! <br /> O coração da Cidade Imperial.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
