import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Guia } from "../types/user";
import { supabase } from "../lib/supabase";
import { useAuth } from "../providers/AuthProvider";
import { getGuiaById } from "../api/guias";

export function useAdminGuias() {
  return useQuery({
    queryKey: ["admin", "guias"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("guias")
        .select("*")
        .order("nome", { ascending: true });

      if (error) throw error;
      return data as Guia[];
    },
  });
}

export function useGuia(guiaId: string | null) {
  return useQuery({
    queryKey: ["guias", guiaId],
    queryFn: () => getGuiaById(guiaId!),
    enabled: !!guiaId,
  });
}

export function useGuias() {
  return useQuery({
    queryKey: ["guias"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("guias")
        .select("*")
        .eq("ativo", true)
        .order("nome", { ascending: true });

      if (error) throw error;
      return data as Guia[];
    },
  });
}

// Mutations: criar, editar, deletar — uso restrito a admin
export function useGuiaMutations() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { mutateAsync: criarGuia, isPending: criando } = useMutation({
    mutationFn: async (formData: FormData) => {
      let fotoUrl = "";
      const fotoFile = formData.get("foto") as File | null;

      if (fotoFile instanceof File && fotoFile.size > 0) {
        const filePath = `guias/${Date.now()}-${fotoFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from("guias")
          .upload(filePath, fotoFile);

        if (uploadError) throw uploadError;

        fotoUrl = supabase.storage.from("guias").getPublicUrl(filePath)
          .data.publicUrl;
      }

      const { data, error } = await supabase
        .from("guias")
        .insert({
          nome: formData.get("nome") as string,
          bio: (formData.get("bio") as string) || null,
          telefone: (formData.get("telefone") as string) || null,
          email: (formData.get("email") as string) || null,
          instagram: (formData.get("instagram") as string) || null,
          cadastur: (formData.get("cadastur") as string) || null,
          cadastur_validade:
            (formData.get("cadastur_validade") as string) || null,
          especialidades: parseTagsInput(formData.get("especialidades")),
          idiomas: parseTagsInput(formData.get("idiomas")),
          foto_url: fotoUrl || null,
          criado_por: user!.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Guia;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guias"] });
    },
  });

  const { mutateAsync: editarGuia, isPending: editando } = useMutation({
    mutationFn: async ({
      guiaId,
      formData,
      fotoUrlAtual,
    }: {
      guiaId: string;
      formData: FormData;
      fotoUrlAtual?: string | null;
    }) => {
      let fotoUrl = fotoUrlAtual || null;
      const fotoFile = formData.get("foto") as File | null;

      if (fotoFile instanceof File && fotoFile.size > 0) {
        const filePath = `guias/${Date.now()}-${fotoFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from("guias")
          .upload(filePath, fotoFile);

        if (uploadError) throw uploadError;

        fotoUrl = supabase.storage.from("guias").getPublicUrl(filePath)
          .data.publicUrl;
      }

      const { data, error } = await supabase
        .from("guias")
        .update({
          nome: formData.get("nome") as string,
          bio: (formData.get("bio") as string) || null,
          telefone: (formData.get("telefone") as string) || null,
          email: (formData.get("email") as string) || null,
          instagram: (formData.get("instagram") as string) || null,
          cadastur: (formData.get("cadastur") as string) || null,
          cadastur_validade:
            (formData.get("cadastur_validade") as string) || null,
          especialidades: parseTagsInput(formData.get("especialidades")),
          idiomas: parseTagsInput(formData.get("idiomas")),
          foto_url: fotoUrl,
          ativo: formData.get("ativo") === "on",
        })
        .eq("id", guiaId)
        .select()
        .single();

      if (error) throw error;
      return data as Guia;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["guias"] });
      queryClient.setQueryData(["guias", data.id], data);
    },
  });

  const { mutateAsync: deletarGuia, isPending: deletando } = useMutation({
    mutationFn: async (guiaId: string) => {
      const { error } = await supabase.from("guias").delete().eq("id", guiaId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guias"] });
    },
  });

  return {
    criarGuia,
    criando,
    editarGuia,
    editando,
    deletarGuia,
    deletando,
  };
}

function parseTagsInput(value: FormDataEntryValue | null): string[] {
  if (typeof value !== "string" || !value.trim()) return [];
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}
