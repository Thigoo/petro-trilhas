import { Guia } from "@/src/types/user";
import { Button } from "../../ui/button";
import { useState } from "react";
import { Card, CardContent } from "../../ui/card";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import Image from "next/image";
import { Textarea } from "../../ui/textarea";
import { Switch } from "../../ui/switch";

interface GuiaFormProps {
  mode: "create" | "edit";
  initialData?: Partial<Guia>;
  onSubmit: (formData: FormData) => Promise<void>;
  isPending?: boolean;
}

export default function GuiaForm({
  mode,
  initialData,
  onSubmit,
  isPending = false,
}: GuiaFormProps) {
  const [fotoPreview, setFotoPreview] = useState<string | null>(
    initialData?.foto_url || null,
  );

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="space-y-8">
          {/* Seção: Identificação */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Identificação
            </h3>

            <div className="space-y-4">
              <div className="flex flex-col gap-4">
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  name="nome"
                  defaultValue={initialData?.nome}
                  required
                />
              </div>

              <div className="flex flex-col gap-4">
                <Label htmlFor="foto">Foto</Label>
                <div className="flex items-center gap-4">
                  {fotoPreview && (
                    <div className="relative h-16 w-16 rounded-full overflow-hidden bg-slate-100 shrink-0">
                      <Image
                        src={fotoPreview}
                        alt="Preview"
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <Input
                    id="foto"
                    name="foto"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleFotoChange}
                  />
                </div>
                {initialData?.foto_url && (
                  <input
                    type="hidden"
                    name="foto_url_atual"
                    value={initialData.foto_url}
                  />
                )}
              </div>

              <div className="flex flex-col gap-4">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  defaultValue={initialData?.bio || ""}
                  rows={4}
                />
              </div>
            </div>
          </section>

          {/* <Separator /> */}

          {/* Seção: Credenciamento */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Credenciamento
            </h3>

            <div className="space-y-4">
              <div className="flex flex-col gap-4">
                <Label htmlFor="cadastur">Cadastur</Label>
                <Input
                  id="cadastur"
                  name="cadastur"
                  defaultValue={initialData?.cadastur || ""}
                  placeholder="Número de registro"
                />
              </div>

              <div className="flex flex-col gap-4">
                <Label htmlFor="cadastur_validade">Validade do Cadastur</Label>
                <Input
                  id="cadastur_validade"
                  name="cadastur_validade"
                  type="date"
                  defaultValue={initialData?.cadastur_validade || ""}
                />
              </div>
            </div>
          </section>

          {/* <Separator /> */}

          {/* Seção: Contato */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Contato
            </h3>

            <div className="space-y-4">
              <div className="flex flex-col gap-4">
                <Label htmlFor="telefone">WhatsApp</Label>
                <Input
                  id="telefone"
                  name="telefone"
                  defaultValue={initialData?.telefone || ""}
                  placeholder="(24) 99999-9999"
                />
              </div>

              <div className="flex flex-col gap-4">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={initialData?.email || ""}
                />
              </div>

              <div className="flex flex-col gap-4">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  name="instagram"
                  defaultValue={initialData?.instagram || ""}
                  placeholder="@usuario"
                />
              </div>
            </div>
          </section>

          {/* <Separator /> */}

          {/* Seção: Atuação */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Atuação
            </h3>

            <div className="space-y-4">
              <div className="flex flex-col gap-4">
                <Label htmlFor="especialidades">
                  Especialidades (separadas por vírgula)
                </Label>
                <Input
                  id="especialidades"
                  name="especialidades"
                  defaultValue={initialData?.especialidades?.join(", ") || ""}
                  placeholder="trekking, rapel, cachoeira"
                />
              </div>

              <div className="flex flex-col gap-4">
                <Label htmlFor="idiomas">Idiomas (separados por vírgula)</Label>
                <Input
                  id="idiomas"
                  name="idiomas"
                  defaultValue={initialData?.idiomas?.join(", ") || ""}
                  placeholder="pt-BR, en, es"
                />
              </div>
            </div>
          </section>

          {/* Status só existe em modo edição */}
          {mode === "edit" && (
            <>
              {/* <Separator /> */}
              <section className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Status
                </h3>

                <div className="flex items-center gap-3 max-w-xs">
                  <Switch
                    id="ativo"
                    name="ativo"
                    defaultChecked={initialData?.ativo ?? true}
                  />
                  <Label htmlFor="ativo">Ativo</Label>
                </div>
              </section>
            </>
          )}
        </CardContent>
      </Card>

      <div className="max-w-3xl mx-auto">
        <Button type="submit" size="lg" disabled={isPending} className="w-full">
          {isPending
            ? "Salvando..."
            : mode === "create"
              ? "Criar Guia"
              : "Salvar Alterações"}
        </Button>
      </div>
    </form>
  );
}
