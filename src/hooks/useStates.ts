import { useQuery } from "@tanstack/react-query";

interface Estado {
  id: number;
  sigla: string;
  nome: string;
}

export function useEstados() {
  return useQuery({
    queryKey: ["ibge", "estados"],
    queryFn: async () => {
      const res = await fetch(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome",
      );
      if (!res.ok) throw new Error("Falha ao buscar estados");
      return res.json() as Promise<Estado[]>;
    },
    staleTime: Infinity, // estados do Brasil não mudam — nunca precisa refetch
  });
}
