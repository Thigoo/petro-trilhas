export interface ITrail {
  id: string;
  nome: string;
  slug: string;
  dificuldade: "leve" | "moderada" | "difícil";
  distancia_km: number;
  tempo_estimado_min: number;
  descricao?: string | null;
  descricao_curta?: string | null;
  localizacao?: string | null;
  desnivel_m?: number | null;
  altitude_max?: number | null;
  fonte?: string | null;
  publicada?: boolean;

  geojson: {
    type: "FeatureCollection";
    features: Array<{
      type: "Feature";
      geometry:
        | { type: "LineString"; coordinates: [number, number][] }
        | { type: "Point"; coordinates: [number, number] };
      properties?: {
        name?: string;
        description?: string;
        cmt?: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: any;
      };
    }>;
  } | null;

  imagem_url?: string | null;
  imagens?: string[] | null;

  created_at?: string;
  updated_at?: string;
}

export interface ITrailMap {
  id: string;
  nome: string;
  slug?: string;
  dificuldade: string;
  distancia_km: number;
  coordinates?: [number, number][];
  geojson?: ITrail["geojson"];
}

export type Difficulty = "todas" | "leve" | "moderada" | "difícil";
