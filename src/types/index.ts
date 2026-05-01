export interface ITrail {
  id: string;
  nome: string;
  slug: string;
  dificuldade: "leve" | "moderada" | "difícil";
  distancia_km: number;
  tempo_estimado_min: number;
  descricao: string | null;
  descricao_curta: string | null;
  localizacao: string | null;
  desnivel_m: string | null;
  fonte: string | null;
  publicada: boolean;
  geojson: {
    type: string;
    coordinates: [number, number][];
  } | null;

  imagem_url?: string | null;
  imagens?: string[] | null;
  altitude_max?: number | null;

  created_at?: string;
  updated_at?: string;
}

export interface ITrailMap {
  id: string;
  nome: string;
  slug?: string;
  dificuldade: string;
  distancia_km: number;
  coordinates: [number, number][];
}

export type Difficulty = "todas" | "leve" | "moderada" | "difícil";

export interface IProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: "user" | "admin";
  pontos_eco: number;
  created_at: string;
  updated_at: string;
}
