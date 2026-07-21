"use client";

import { useState } from "react";
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Evento, useTrilhasParaEventos } from "@/src/hooks/useEventos";

interface EventoFormProps {
  mode: "create" | "edit";
  initialData?: Evento;
  onSubmit: (data: FormData) => Promise<void>;
}

export default function EventoForm({
  mode,
  initialData,
  onSubmit,
}: EventoFormProps) {
  const [isPending, setIsPending] = useState(false);
  const { data: trilhas, isLoading: carregandoTrilhas } =
    useTrilhasParaEventos();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    await onSubmit(formData);
    setIsPending(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {mode === "create" ? "Novo Evento" : "Editar Evento"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Label htmlFor="titulo">Título do Evento *</Label>
              <Input
                id="titulo"
                name="titulo"
                defaultValue={initialData?.titulo}
                required
              />
            </div>

            <div>
              <Label htmlFor="data_hora">Data e Hora *</Label>
              <Input
                id="data_hora"
                name="data_hora"
                type="datetime-local"
                defaultValue={initialData?.data_hora?.slice(0, 16)}
                required
              />
            </div>

            <div>
              <Label htmlFor="vagas_limite">
                Vagas (deixe vazio para ilimitado)
              </Label>
              <Input
                id="vagas_limite"
                name="vagas_limite"
                type="number"
                defaultValue={initialData?.vagas_limite || ""}
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="trilha_id">Trilha (opcional)</Label>
              <Select
                name="trilha_id"
                defaultValue={initialData?.trilha_id || ""}
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

            <div className="md:col-span-2">
              <Label htmlFor="organizador_nome">Nome do Organizador *</Label>
              <Input
                id="organizador_nome"
                name="organizador_nome"
                defaultValue={initialData?.organizador_nome}
                required
              />
            </div>

            <div className="md:col-span-2">
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

            <div className="md:col-span-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                name="descricao"
                defaultValue={initialData?.descricao || ""}
                rows={5}
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
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
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={isPending}
            className="w-full"
          >
            {isPending
              ? "Salvando..."
              : mode === "create"
                ? "Criar Evento"
                : "Salvar Alterações"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
