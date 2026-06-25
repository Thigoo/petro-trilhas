import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/src/lib/supabase";
import { useState } from "react";
import { useAuth } from "../providers/AuthProvider";

interface ConfirmacaoComPerfil {
  user_id: string;
  created_at: string;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

export function useConfirmacoes(eventoId: string | null) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const { data: confirmacoes = [], isLoading: loading } = useQuery({
    queryKey: ["confirmacoes", eventoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("evento_confirmacoes")
        .select("user_id, created_at, profiles(full_name, avatar_url)")
        .eq("evento_id", eventoId!)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as unknown as ConfirmacaoComPerfil[];
    },
    enabled: !!eventoId,
  });

  const confirmados = confirmacoes.map((c) => ({
    userId: c.user_id,
    nome: c.profiles?.full_name,
    avatarUrl: c.profiles?.avatar_url,
  }));

  const totalConfirmados = confirmados.length;
  const jaConfirmou = !!user && confirmacoes.some((c) => c.user_id === user.id);

  const confirmMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("evento_confirmacoes")
        .insert({ evento_id: eventoId!, user_id: user!.id });
      if (error) throw error;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["confirmacoes", eventoId] });
      const previous = queryClient.getQueryData<ConfirmacaoComPerfil[]>([
        "confirmacoes",
        eventoId,
      ]);

      // adiciona o próprio usuário à lista imediatamente
      queryClient.setQueryData<ConfirmacaoComPerfil[]>(
        ["confirmacoes", eventoId],
        (old = []) => [
          ...old,
          {
            user_id: user!.id,
            created_at: new Date().toISOString(),
            profiles: {
              full_name: user!.user_metadata?.full_name ?? null,
              avatar_url: user!.user_metadata?.avatar_url ?? null,
            },
          },
        ],
      );

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["confirmacoes", eventoId], context.previous);
      }
    },
    onSettled: () => {
      // Garante consistência (ex: se trigger de vagas rejeitar, reverte pro estado real)
      queryClient.invalidateQueries({ queryKey: ["confirmacoes", eventoId] });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("evento_confirmacoes")
        .delete()
        .eq("evento_id", eventoId!)
        .eq("user_id", user!.id);
      if (error) throw error;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["confirmacoes", eventoId] });
      const previous = queryClient.getQueryData<ConfirmacaoComPerfil[]>([
        "confirmacoes",
        eventoId,
      ]);

      queryClient.setQueryData<ConfirmacaoComPerfil[]>(
        ["confirmacoes", eventoId],
        (old = []) => old.filter((c) => c.user_id !== user!.id),
      );

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["confirmacoes", eventoId], context.previous);
      }
    },
  });

  const toggleConfirmacao = () => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }

    if (jaConfirmou) {
      cancelMutation.mutate();
    } else {
      confirmMutation.mutate();
    }
  };

  return {
    confirmados,
    totalConfirmados,
    jaConfirmou,
    loading,
    toggleConfirmacao,
    confirmando: confirmMutation.isPending,
    erroVagas: confirmMutation.error?.message?.includes("vagas")
      ? "Esse evento já atingiu o limite de vagas."
      : null,
    showLoginPrompt,
    setShowLoginPrompt,
  };
}
