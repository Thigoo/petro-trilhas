import { supabase } from "@/src/lib/supabase";
import { ITrail } from "../types";

// Função para buscar todas as trilhas
export async function getTrails(): Promise<ITrail[]> {
  const { data, error } = await supabase
    .from("trilhas")
    .select("*")
    .order("nome", { ascending: true });

  if (error) {
    console.error("Erro ao buscar trilhas:", error.message);
    return [];
  }

  // Garantimos que o geojson seja tratado corretamente
  return (data || []).map((trilha: ITrail) => ({
    ...trilha,
    geojson: trilha.geojson || null,
    distancia_km: Number(trilha.distancia_km) || 0,
    tempo_estimado_min: Number(trilha.tempo_estimado_min) || 0,
    altitude_max: trilha.altitude_max ? Number(trilha.altitude_max) : null,
  })) as ITrail[];
}

// Função auxiliar para buscar uma trilha específica por slug (útil na página de detalhes)
export async function getTrailBySlug(slug: string): Promise<ITrail | null> {
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
  } as ITrail;
}
