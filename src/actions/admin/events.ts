"use server";

import { NovoEvento } from "@/src/hooks/useEventos";
import { supabase } from "@/src/lib/supabase";
import { revalidatePath } from "next/cache";

// TODO: implementar todo o crud para ser usado na mutation
export async function updateEvento(id: string, data: Partial<NovoEvento>) {
  const { error } = await supabase.from("eventos").update(data).eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Erro ao atualizar evento");
  }

  revalidatePath("/eventos-admin");
  revalidatePath("/eventos");

  return { success: true };
}

export async function deleteEvento(id: string) {
  const { error } = await supabase.from("eventos").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Erro ao deletar evento");
  }

  revalidatePath("/eventos-admin");
  revalidatePath("/eventos");

  return { success: true };
}
