import { supabase } from "./supabase";

// 1. Definição da Interface baseada no seu SQL
export interface Trilha {
  id: string;
  nome: string;
  slug: string;
  // Alinhado com o CHECK (leve, moderada, difícil) do seu SQL
  dificuldade: "leve" | "moderada" | "difícil";
  distancia_km: number;
  tempo_estimado_min: number;
  descricao: string;
  // O campo no banco se chama 'geojson' (jsonb)
  geojson: {
    type: "LineString";
    coordinates: [number, number][]; // Formato GeoJSON: [longitude, latitude]
  };
  imagem_url?: string;
  altitude_max?: number;
  created_at?: string;
  updated_at?: string;
}

// 2. Função de busca no Supabase
export async function getTrilhas() {
  const { data, error } = await supabase
    .from("trilhas")
    .select("*")
    .order("nome", { ascending: true });

  if (error) {
    console.error("Erro ao buscar trilhas no Supabase:", error.message);
    return [];
  }

  // Fazemos o cast para a interface Trilha para o TypeScript nos ajudar no restante do app
  return data as Trilha[];
}
