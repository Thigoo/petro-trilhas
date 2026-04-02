// src/types/index.ts

export interface ITrail {
  id: string;
  nome: string;
  slug: string;
  dificuldade: "leve" | "moderada" | "difícil";
  distancia_km: number;
  tempo_estimado_min: number;
  descricao: string | null;

  geojson: {
    type: string;
    coordinates: [number, number][]; // [longitude, latitude] no banco
  } | null;

  imagem_url?: string | null;
  altitude_max?: number | null;

  created_at?: string;
  updated_at?: string;
}

// Tipo simplificado para usar no componente TrailMap
export interface ITrailMap {
  id: string;
  nome: string;
  dificuldade: string;
  distancia_km: number;
  coordinates: [number, number][]; // [latitude, longitude] que o Leaflet espera
}

export type Difficulty = "todas" | "leve" | "moderada" | "difícil";
