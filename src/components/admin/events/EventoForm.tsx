"use client";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Card, CardContent } from "@/src/components/ui/card";
import { Evento, useTrilhasParaEventos } from "@/src/hooks/useEventos";
import { Separator } from "../../ui/separator";

interface EventoFormProps {
  mode: "create" | "edit";
  initialData?: Partial<Evento>;
  onSubmit: (formData: FormData) => Promise<void>;
  isPending?: boolean;
}

export default function EventoForm({
  mode,
  initialData,
  onSubmit,
  isPending = false,
}: EventoFormProps) {
  const { data: trilhas, isLoading: carregandoTrilhas } =
    useTrilhasParaEventos();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        {/* <CardHeader>
          <CardTitle>
            {mode === "create" ? "Novo Evento" : "Editar Evento"}
          </CardTitle>
        </CardHeader> */}

        <CardContent className="space-y-8">
          {/* Seção: Informações Básicas */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Informações Básicas
            </h3>

            <div className="space-y-4">
              <div className="flex flex-col gap-4">
                <Label htmlFor="titulo">Título do Evento *</Label>
                <Input
                  id="titulo"
                  name="titulo"
                  defaultValue={initialData?.titulo}
                  required
                />
              </div>

              <div className="flex flex-col gap-4">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  name="descricao"
                  defaultValue={initialData?.descricao || ""}
                  rows={5}
                />
              </div>
            </div>
          </section>

          <Separator />

          {/* Seção: Data, Vagas e Trilha */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Detalhes do Evento
            </h3>

            <div className="space-y-4">
              <div className="flex flex-col gap-4">
                <Label htmlFor="data_hora">Data e Hora *</Label>
                <Input
                  id="data_hora"
                  name="data_hora"
                  type="datetime-local"
                  defaultValue={initialData?.data_hora?.slice(0, 16)}
                  required
                />
              </div>

              <div className="flex flex-col gap-4">
                <Label htmlFor="vagas_limite">
                  Vagas (deixe vazio para ilimitado)
                </Label>
                <Input
                  id="vagas_limite"
                  name="vagas_limite"
                  type="number"
                  min={1}
                  defaultValue={initialData?.vagas_limite || ""}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 ">
              <Label htmlFor="trilha_id">Trilha (opcional)</Label>
              <Select
                name="trilha_id"
                defaultValue={initialData?.trilha_id || "none"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma trilha (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">
                    Evento Geral (sem trilha específica)
                  </SelectItem>

                  {carregandoTrilhas ? (
                    <SelectItem value="loading" disabled>
                      Carregando trilhas...
                    </SelectItem>
                  ) : (
                    trilhas?.map((trilha) => (
                      <SelectItem key={trilha.id} value={trilha.id}>
                        {trilha.nome}
                        <span className="text-xs text-slate-500 ml-2">
                          ({trilha.dificuldade})
                        </span>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </section>

          <Separator />

          {/* Seção: Organizador */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Organizador
            </h3>

            <div className="flex flex-col gap-4 ">
              <div className="flex flex-col gap-4 ">
                <Label htmlFor="organizador_nome">Nome do Organizador *</Label>
                <Input
                  id="organizador_nome"
                  name="organizador_nome"
                  defaultValue={initialData?.organizador_nome}
                  required
                />
              </div>

              <div className="flex flex-col gap-4 ">
                <Label htmlFor="organizador_contato">
                  Contato do Organizador
                </Label>
                <Input
                  id="organizador_contato"
                  name="organizador_contato"
                  defaultValue={initialData?.organizador_contato || ""}
                  placeholder="WhatsApp, email, etc."
                />
              </div>
            </div>
          </section>

          {/* Status só existe em modo edição — não faz sentido escolher status ao criar */}
          {mode === "edit" && (
            <>
              <Separator />
              <section className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Status
                </h3>

                <div className="max-w-xs">
                  <Select
                    name="status"
                    defaultValue={initialData?.status || "ativo"}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="cancelado">Cancelado</SelectItem>
                      <SelectItem value="concluido">Concluído</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </section>
            </>
          )}
        </CardContent>
      </Card>

      {/* Submit — sticky no mobile, inline no desktop */}
      <div className="max-w-3xl mx-auto">
        <Button type="submit" size="lg" disabled={isPending} className="w-full">
          {isPending
            ? "Salvando..."
            : mode === "create"
              ? "Criar Evento"
              : "Salvar Alterações"}
        </Button>
      </div>
    </form>
  );
}
