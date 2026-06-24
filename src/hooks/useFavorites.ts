import { useState, useCallback } from "react";
import { useAuth } from "../providers/AuthProvider";
import { supabase } from "../lib/supabase";
import { ITrail } from "../types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface FavoritoRow {
  trilha_id: string;
  trilhas: ITrail;
}

export function useFavorites() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const { data: favoriteRows = [], isLoading: loading } = useQuery({
    queryKey: ["favoritos", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("favoritos")
        .select("trilha_id, trilhas(*)")
        .eq("user_id", user!.id);

      if (error) throw error;
      return data as unknown as FavoritoRow[];
    },
    enabled: !!user,
  });

  // Derivados a partir do mesmo dado — sem estado próprio
  const favorites = favoriteRows.map((f) => f.trilha_id);
  const favoriteTrails = favoriteRows.map((f) => f.trilhas);

  const addMutation = useMutation({
    mutationFn: async (trilhaId: string) => {
      const { error } = await supabase
        .from("favoritos")
        .insert({ user_id: user!.id, trilha_id: trilhaId });
      if (error) throw error;
    },
    // Optimistic update: atualiza o cache ANTES da resposta do servidor
    onMutate: async (trilhaId) => {
      await queryClient.cancelQueries({ queryKey: ["favoritos", user?.id] });
      const previous = queryClient.getQueryData<FavoritoRow[]>([
        "favoritos",
        user?.id,
      ]);

      // Não temos os dados completos da trilha ainda nesse ponto,
      // então adicionamos um registro "otimista" mínimo
      queryClient.setQueryData<FavoritoRow[]>(
        ["favoritos", user?.id],
        (old = []) => [...old, { trilha_id: trilhaId, trilhas: {} as ITrail }],
      );

      return { previous };
    },
    onError: (_err, _trilhaId, context) => {
      // Rollback se der erro
      if (context?.previous) {
        queryClient.setQueryData(["favoritos", user?.id], context.previous);
      }
    },
    onSettled: () => {
      // Garante que o dado real (com a trilha completa) seja buscado depois
      queryClient.invalidateQueries({ queryKey: ["favoritos", user?.id] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (trilhaId: string) => {
      const { error } = await supabase
        .from("favoritos")
        .delete()
        .eq("user_id", user!.id)
        .eq("trilha_id", trilhaId);
      if (error) throw error;
    },
    onMutate: async (trilhaId) => {
      await queryClient.cancelQueries({ queryKey: ["favoritos", user?.id] });
      const previous = queryClient.getQueryData<FavoritoRow[]>([
        "favoritos",
        user?.id,
      ]);

      queryClient.setQueryData<FavoritoRow[]>(
        ["favoritos", user?.id],
        (old = []) => old.filter((f) => f.trilha_id !== trilhaId),
      );

      return { previous };
    },
    onError: (_err, _trilhaId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["favoritos", user?.id], context.previous);
      }
    },
  });

  const toggleFavorite = useCallback(
    (trilhaId: string) => {
      if (!user) {
        setShowLoginPrompt(true);
        return;
      }

      const isFav = favorites.includes(trilhaId);
      if (isFav) {
        removeMutation.mutate(trilhaId);
      } else {
        addMutation.mutate(trilhaId);
      }
    },
    [user, favorites, addMutation, removeMutation],
  );

  const isFavorite = (trilhaId: string) => favorites.includes(trilhaId);

  return {
    favorites,
    favoriteTrails,
    toggleFavorite,
    isFavorite,
    loading,
    showLoginPrompt,
    setShowLoginPrompt,
  };
}
