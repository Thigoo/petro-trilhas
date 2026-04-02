import { supabase } from "@/src/lib/supabase";

export interface Trilha {
  id: string;
  nome: string;
  slug: string;
  dificuldade: "leve" | "moderada" | "difícil";
  distancia_km: number;
  tempo_estimado_min: number;
  descricao: string | null;

  // GeoJSON vindo do banco (jsonb)
  geojson: {
    type: string;
    coordinates: [number, number][]; // [longitude, latitude] no GeoJSON
  } | null;

  imagem_url?: string | null;
  altitude_max?: number | null;

  created_at?: string;
  updated_at?: string;
}

// Função para buscar todas as trilhas
export async function getTrails(): Promise<Trilha[]> {
  const { data, error } = await supabase
    .from("trilhas")
    .select("*")
    .order("nome", { ascending: true });

  if (error) {
    console.error("Erro ao buscar trilhas:", error.message);
    return [];
  }

  // Garantimos que o geojson seja tratado corretamente
  return (data || []).map((trilha: Trilha) => ({
    ...trilha,
    geojson: trilha.geojson || null,
    distancia_km: Number(trilha.distancia_km) || 0,
    tempo_estimado_min: Number(trilha.tempo_estimado_min) || 0,
    altitude_max: trilha.altitude_max ? Number(trilha.altitude_max) : null,
  })) as Trilha[];
}

// Função auxiliar para buscar uma trilha específica por slug (útil na página de detalhes)
export async function getTrailBySlug(slug: string): Promise<Trilha | null> {
  const { data, error } = await supabase
    .from("trilhas")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    console.error("Erro ao buscar trilha por slug:", error?.message);
    return null;
  }

  return {
    ...data,
    distancia_km: Number(data.distancia_km) || 0,
    tempo_estimado_min: Number(data.tempo_estimado_min) || 0,
    altitude_max: data.altitude_max ? Number(data.altitude_max) : null,
  } as Trilha;
}
