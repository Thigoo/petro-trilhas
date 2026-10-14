import { GuiaCard } from "@/src/components/guias/GuiaCard";
import { supabase } from "@/src/lib/supabase";
import { Guia } from "@/src/types/user";

export const metadata = {
  title: "Encontre seu guia | Trilhas Petrópolis",
};

export default async function GuiasPage() {
  const { data: guias, error } = await supabase
    .from("guias")
    .select("*")
    .eq("ativo", true)
    .order("nome", { ascending: true });

  if (error) {
    // trata erro conforme padrão do projeto (log, fallback de UI, etc.)
    throw new Error("Não foi possível carregar os guias.");
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-dark-green">
          Encontre seu guia
        </h1>
        <p className="text-muted-foreground mt-1 text-lg">
          Guias de ecoturismo credenciados para te acompanhar nas trilhas de
          Petrópolis.
        </p>
      </div>

      {guias.length === 0 ? (
        <p className="text-muted-foreground">
          Nenhum guia disponível no momento.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(guias as Guia[]).map((guia) => (
            <GuiaCard key={guia.id} guia={guia} />
          ))}
        </div>
      )}
    </div>
  );
}
