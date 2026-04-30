import { IProfile } from "@/src/types";
import { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { supabase } from "../supabase";

export function useProfile() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function loadProfileData() {
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Erro ao buscar perfil:", error.message);
      } else {
        setProfile(data);
        if (data?.role === "admin") {
          setIsAdmin(true);
        }
      }
      setLoading(false);
    }

    loadProfileData();
  }, [user]);

  return {
    user,
    profile,
    loading: authLoading || loading,
    isLoggedIn: !!user,
    isAdmin,
  };
}
