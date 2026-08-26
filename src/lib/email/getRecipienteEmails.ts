import { supabaseAdmin } from "../supabase/admin";

export async function getAllUserEmails(): Promise<string[]> {
  const { data, error } = await supabaseAdmin.auth.admin.listUsers();

  if (error) {
    console.error("[email] Erro ao buscar usuários para notificação:", error);
    return [];
  }

  return data.users
    .map((u) => u.email)
    .filter((email): email is string => !!email);
}
