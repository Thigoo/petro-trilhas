"use server";

import { supabase } from "@/src/lib/supabase";
import { revalidatePath } from "next/cache";

export async function deleteEvento(id: string) {
  console.log("deletando evento", id);
  const { error } = await supabase.from("eventos").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Erro ao deletar evento");
  }

  revalidatePath("/eventos-admin");
  revalidatePath("/eventos");

  return { success: true };
}
