"use client";

import { useState, useEffect } from "react";
import { trailSchema } from "@/src/validations/trail";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Button } from "@/src/components/ui/button";
import { Save, Loader2, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import Image from "next/image";

interface TrailFormProps {
  initialData?: Partial<ITrailFormState>;
  onSubmit: (data: FormData) => Promise<void>;
  isEdit?: boolean;
}

export interface ITrailFormState {
  id?: string;
  nome: string;
  slug: string;
  dificuldade: "leve" | "moderada" | "difícil";
  localizacao: string;
  descricao_curta: string;
  descricao: string;
  fonte: string;

  distancia_km: string | number;
  tempo_estimado_min: string | number;
  desnivel_m: string | number;
  altitude_max: string | number;

  geojson: string;

  imagem_url: File | null;
  imagem_preview: string;

  imagens: File[];
  galeria_previews: string[];
}

export function TrailForm({ initialData, onSubmit, isEdit }: TrailFormProps) {
  const [isPending, setIsPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<ITrailFormState>({
    nome: initialData?.nome || "",
    slug: initialData?.slug || "",
    dificuldade: initialData?.dificuldade || "leve",
    distancia_km: initialData?.distancia_km || "",
    tempo_estimado_min: initialData?.tempo_estimado_min || "",
    desnivel_m: initialData?.desnivel_m || "",
    altitude_max: initialData?.altitude_max || "",
    localizacao: initialData?.localizacao || "",
    descricao_curta: initialData?.descricao_curta || "",
    descricao: initialData?.descricao || "",
    fonte: initialData?.fonte || "",
    geojson: initialData?.geojson || "",
    imagem_url: null,
    imagem_preview: initialData?.imagem_preview || "",
    imagens: [],
    galeria_previews: initialData?.galeria_previews || [],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      dificuldade: value as ITrailFormState["dificuldade"],
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        imagem_url: file,
        imagem_preview: URL.createObjectURL(file),
      }));
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    const newPreviews = files.map((file) => URL.createObjectURL(file));

    setFormData((prev) => ({
      ...prev,
      imagens: [...prev.imagens, ...files],
      galeria_previews: [...prev.galeria_previews, ...newPreviews],
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setErrors({});

    const result = trailSchema.safeParse(formData);

    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        formattedErrors[path] = issue.message;
      });
      console.log("ERROS DE VALIDAÇÃO:", formattedErrors);
      setErrors(formattedErrors);
      setIsPending(false);
      return;
    }

    try {
      const dataToSend = new FormData();
      if (isEdit) dataToSend.append("id", initialData?.id || "");
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "imagens") {
          formData.imagens.forEach((file) =>
            dataToSend.append("imagens", file),
          );
        } else if (key === "imagem_url") {
          dataToSend.append("imagem_url", value);
        } else {
          dataToSend.append(key, value);
        }
      });

      await onSubmit(dataToSend);
    } catch (error) {
      console.error(error);
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    return () => {
      if (formData.imagem_preview) {
        URL.revokeObjectURL(formData.imagem_preview);
      }
    };
  }, [formData.imagem_preview]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nome" className={errors.nome ? "text-red-500" : ""}>
            Nome da Trilha *
          </Label>
          <Input
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            className={
              errors.nome ? "border-red-500 focus-visible:ring-red-500" : ""
            }
          />
          {errors.nome && (
            <p className="text-red-500 text-xs font-medium">{errors.nome}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="slug"
            className={
              errors.slug ? "text-red-500 focus-visible:ring-red-500" : ""
            }
          >
            Slug *
          </Label>
          <Input
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            placeholder="pedra-quitandinha"
            required
          />
          {errors.slug && (
            <p className="text-red-500 text-xs font-medium">{errors.slug}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label>Dificuldade *</Label>
          <Select
            onValueChange={handleSelectChange}
            defaultValue={formData.dificuldade}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a dificuldade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="leve">Leve</SelectItem>
              <SelectItem value="moderada">Moderada</SelectItem>
              <SelectItem value="difícil">Difícil</SelectItem>
            </SelectContent>
          </Select>
          {errors.dificuldade && (
            <p className="text-red-500 text-xs font-medium">
              {errors.dificuldade}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="distancia_km">Distância (km) *</Label>
          <Input
            id="distancia_km"
            name="distancia_km"
            type="number"
            step="0.1"
            value={formData.distancia_km}
            onChange={handleChange}
            required
          />
          {errors.distancia_km && (
            <p className="text-red-500 text-xs font-medium">
              {errors.distancia_km}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="tempo_estimado_min">Tempo estimado (min) *</Label>
          <Input
            id="tempo_estimado_min"
            name="tempo_estimado_min"
            type="number"
            value={formData.tempo_estimado_min}
            onChange={handleChange}
            required
          />
          {errors.tempo_estimado_min && (
            <p className="text-red-500 text-xs font-medium">
              {errors.tempo_estimado_min}
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="desnivel_m">Desnível (m)</Label>
            <Input
              id="desnivel_m"
              name="desnivel_m"
              type="number"
              value={formData.desnivel_m}
              onChange={handleChange}
            />
            {errors.desnivel_m && (
              <p className="text-red-500 text-xs font-medium">
                {errors.desnivel_m}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="altitude_max">Altitude Máxima (m)</Label>
            <Input
              id="altitude_max"
              name="altitude_max"
              type="number"
              value={formData.altitude_max}
              onChange={handleChange}
            />
            {errors.altitude_max && (
              <p className="text-red-500 text-xs font-medium">
                {errors.altitude_max}
              </p>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="localizacao">Localização</Label>
          <Input
            id="localizacao"
            name="localizacao"
            value={formData.localizacao}
            onChange={handleChange}
            placeholder="Ex: Quitandinha, Itaipava, PARNASO"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="descricao_curta">Descrição Curta</Label>
          <Textarea
            id="descricao_curta"
            name="descricao_curta"
            value={formData.descricao_curta}
            onChange={handleChange}
            rows={3}
            placeholder="Resumo rápido da trilha..."
          />
          {errors.descricao_curta && (
            <p className="text-red-500 text-xs font-medium">
              {errors.descricao_curta}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="descricao">Descrição Completa</Label>
          <Textarea
            id="descricao"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            rows={8}
            placeholder="Descreva a trilha com detalhes..."
          />
          {errors.descricao && (
            <p className="text-red-500 text-xs font-medium">
              {errors.descricao}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="fonte">Fonte dos Dados</Label>
          <Input
            id="fonte"
            name="fonte"
            value={formData.fonte}
            onChange={handleChange}
            placeholder="Wikiloc, AllTrails, Pesquisa local..."
          />
          {errors.fonte && (
            <p className="text-red-500 text-xs font-medium">{errors.fonte}</p>
          )}
        </div>
      </div>
      <div className="space-y-3">
        <Label htmlFor="imagem_url">Imagem Principal</Label>

        <div className="flex flex-col gap-4">
          <Input
            id="imagem_url"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="cursor-pointer"
          />

          {formData.imagem_preview && (
            <div className="relative group">
              <div className="relative w-48 h-32 rounded-lg overflow-hidden border-2 border-slate-200">
                <Image
                  src={formData.imagem_preview}
                  alt="Preview"
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      imagem_url: null,
                      imagem_preview: "",
                    }))
                  }
                  className="absolute top-0 right-0 text-white rounded-full p-1 shadow-sm"
                >
                  <span className="sr-only">Remover</span>
                  <X size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
        <p className="text-xs text-slate-500">
          Recomendado: imagem horizontal, boa iluminação (máx. 5MB)
        </p>
      </div>
      <div className="space-y-3">
        <Label>Galeria de Fotos</Label>

        {/* Input de arquivos múltiplos */}
        <Input
          id="galeria"
          type="file"
          multiple
          accept="image/*"
          onChange={handleGalleryChange}
          className="cursor-pointer"
        />

        {/* Grid de Previews da Galeria */}
        {formData.galeria_previews.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {formData.galeria_previews.map((preview, index) => (
              <div
                key={index}
                className="relative group aspect-video rounded-md overflow-hidden border"
              >
                <Image
                  src={preview}
                  alt={`Preview galeria ${index}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newFiles = [...formData.imagens];
                    const newPreviews = [...formData.galeria_previews];
                    newFiles.splice(index, 1);
                    newPreviews.splice(index, 1);
                    setFormData((prev) => ({
                      ...prev,
                      imagens: newFiles,
                      galeria_previews: newPreviews,
                    }));
                  }}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
        <p className="text-xs text-slate-500">
          Selecione várias fotos da paisagem e pontos de interesse da trilha.
        </p>
        {errors.galeria && (
          <p className="text-red-500 text-xs font-medium">{errors.galeria}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="geojson" className="flex items-center gap-2">
          Dados GeoJSON (Rota) *
          <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 uppercase font-bold">
            JSON Obrigatório
          </span>
        </Label>

        <Textarea
          id="geojson"
          name="geojson"
          value={formData.geojson.trim()}
          onChange={handleChange}
          placeholder='{ "type": "LineString", "coordinates": [...] }'
          className="font-mono h-48 bg-slate-50 resize-y text-sm focus-visible:ring-green-700"
          required
        />

        <div className="flex justify-between items-start">
          <p className="text-xs text-slate-500 max-w-[80%]">
            Cole o conteúdo do arquivo .json ou .geojson exportado de
            ferramentas como geojson.io.
          </p>
        </div>
        {errors.geojson && (
          <p className="text-red-500 text-xs font-medium">{errors.geojson}</p>
        )}
      </div>

      <div className="pt-6">
        <Button type="submit" disabled={isPending} className="w-full md:w-auto">
          {isPending ? (
            <Loader2 className="mr-2 animate-spin" />
          ) : (
            <Save className="mr-2" />
          )}
          {isEdit ? "Atualizar Trilha" : "Salvar Trilha"}
        </Button>
      </div>
    </form>
  );
}
