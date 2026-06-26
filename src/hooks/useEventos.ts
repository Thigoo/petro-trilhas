import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/src/lib/supabase";
import { useAuth } from "../providers/AuthProvider";

export interface Evento {
  id: string;
  trilha_id: string;
  titulo: string;
  descricao: string | null;
  organizador_nome: string;
  organizador_contato: string | null;
  data_hora: string;
  vagas_limite: number | null;
  status: "ativo" | "cancelado" | "concluido";
  criado_por: string;
  created_at: string;
  // join opcional com a trilha, útil na listagem geral
  trilhas?: {
    nome: string;
    slug: string;
    imagem_url: string | null;
  };
}

interface ConfirmacaoComEvento {
  created_at: string;
  eventos: Evento | null;
}

export type NovoEvento = Omit<
  Evento,
  "id" | "status" | "criado_por" | "created_at" | "trilhas"
>;

// Lista todos os eventos ativos, com dados básicos da trilha (pra tela geral de eventos)
export function useEventos() {
  return useQuery({
    queryKey: ["eventos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("eventos")
        .select("*, trilhas(nome, slug, imagem_url)")
        .eq("status", "ativo")
        .order("data_hora", { ascending: true });

      if (error) throw error;
      return data as Evento[];
    },
  });
}

// Lista eventos de uma trilha específica (pra mostrar na página de detalhes)
export function useEventosPorTrilha(trilhaId: string | null) {
  return useQuery({
    queryKey: ["eventos", "trilha", trilhaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("eventos")
        .select("*")
        .eq("trilha_id", trilhaId!)
        .eq("status", "ativo")
        .order("data_hora", { ascending: true });

      if (error) throw error;
      return data as Evento[];
    },
    enabled: !!trilhaId,
  });
}

// Busca um evento específico (pra tela de detalhes do evento)
export function useEvento(eventoId: string | null) {
  return useQuery({
    queryKey: ["eventos", eventoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("eventos")
        .select("*, trilhas(nome, slug, imagem_url)")
        .eq("id", eventoId!)
        .single();

      if (error) throw error;
      return data as Evento;
    },
    enabled: !!eventoId,
  });
}

export function useMeusEventos() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["eventos", "meus", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("evento_confirmacoes")
        .select("created_at, eventos(*, trilhas(nome, slug, imagem_url))")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const rows = data as unknown as ConfirmacaoComEvento[];

      return rows
        .map((row) => row.eventos)
        .filter((evento): evento is Evento => evento !== null) as Evento[];
    },
    enabled: !!user,
  });
}

// Mutations: criar, cancelar — uso restrito a admin (a UI que vai exigir AdminRoute)
export function useEventoMutations() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { mutateAsync: criarEvento, isPending: criando } = useMutation({
    mutationFn: async (novoEvento: NovoEvento) => {
      const { data, error } = await supabase
        .from("eventos")
        .insert({ ...novoEvento, criado_por: user!.id })
        .select()
        .single();

      if (error) throw error;
      return data as Evento;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["eventos"] });
    },
  });

  const { mutateAsync: cancelarEvento, isPending: cancelando } = useMutation({
    mutationFn: async (eventoId: string) => {
      const { data, error } = await supabase
        .from("eventos")
        .update({ status: "cancelado" })
        .eq("id", eventoId)
        .select()
        .single();

      if (error) throw error;
      return data as Evento;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["eventos"] });
      queryClient.setQueryData(["eventos", data.id], data);
    },
  });

  return { criarEvento, criando, cancelarEvento, cancelando };
}
