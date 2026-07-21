import { Evento } from "../hooks/useEventos";
import { supabase } from "../lib/supabase";

export async function getAllEventosAdmin() {
  const { data, error } = await supabase
    .from("eventos")
    .select(
      `
      *,
      trilhas (
        nome,
        slug,
        imagem_url
      )
    `,
    )
    .order("data_hora", { ascending: false });

  if (error) {
    console.error(error);
    throw new Error("Erro ao buscar eventos");
  }

  return data ? (data as Evento[]) : [];
}

export async function getEventoById(id: string) {
  const { data, error } = await supabase
    .from("eventos")
    .select(
      `
      *,
      trilhas (
        nome,
        slug,
        imagem_url
      )
    `,
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Erro ao buscar evento");
  }

  return data as Evento;
}
