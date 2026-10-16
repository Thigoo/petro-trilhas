import { supabase } from "../lib/supabase";
import { Guia } from "../types/user";

export async function getAllGuiasAdmin() {
  const { data, error } = await supabase
    .from("guias")
    .select("*")
    .order("nome", { ascending: true });

  if (error) {
    console.error(error);
    throw new Error("Erro ao buscar guias");
  }

  return data ? (data as Guia[]) : [];
}

export async function getGuiaById(id: string) {
  const { data, error } = await supabase
    .from("guias")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Erro ao buscar guia");
  }

  return data as Guia;
}
