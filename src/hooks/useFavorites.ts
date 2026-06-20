import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../providers/AuthProvider";
import { supabase } from "../lib/supabase";

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    if (!user) {
      void Promise.resolve().then(() => {
        setFavorites([]);
        setLoading(false);
      });
      return;
    }

    const loadFavorites = async () => {
      const { data, error } = await supabase
        .from("favoritos")
        .select("trilha_id")
        .eq("user_id", user.id);

      if (!error && data) {
        setFavorites(data.map((f) => f.trilha_id));
      }
      setLoading(false);
    };

    loadFavorites();
  }, [user]);

  const toggleFavorite = useCallback(
    async (trilhaId: string) => {
      if (!user) {
        setShowLoginPrompt(true);
        return;
      }

      const isFav = favorites.includes(trilhaId);

      if (isFav) {
        setFavorites((prev) => prev.filter((id) => id !== trilhaId));

        const { error } = await supabase
          .from("favoritos")
          .delete()
          .eq("user_id", user?.id)
          .eq("trilha_id", trilhaId);

        if (error) {
          // rollback se falhar
          setFavorites((prev) => [...prev, trilhaId]);
        }
      } else {
        setFavorites((prev) => [...prev, trilhaId]);

        const { error } = await supabase
          .from("favoritos")
          .insert({ user_id: user?.id, trilha_id: trilhaId });

        if (error) {
          setFavorites((prev) => prev.filter((id) => id !== trilhaId));
        }
      }
    },
    [user, favorites],
  );

  const isFavorite = (trilhaId: string) => favorites.includes(trilhaId);

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    loading,
    showLoginPrompt,
    setShowLoginPrompt,
  };
}
