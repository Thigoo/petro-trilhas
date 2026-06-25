import { useQuery } from "@tanstack/react-query";

interface Municipio {
  id: number;
  nome: string;
}

export function useMunicipios(uf: string | null) {
  return useQuery({
    queryKey: ["ibge", "municipios", uf],
    queryFn: async () => {
      const res = await fetch(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`,
      );
      if (!res.ok) throw new Error("Falha ao buscar municípios");
      return res.json() as Promise<Municipio[]>;
    },
    enabled: !!uf, // só busca depois que um estado foi escolhido
    staleTime: Infinity,
  });
}
