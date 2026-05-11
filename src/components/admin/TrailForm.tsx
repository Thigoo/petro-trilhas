"use client";

import { useState, useEffect } from "react";
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: any; // TODO: Definir tipagem
  onSubmit: (formData: FormData) => Promise<void>;
}

export function TrailForm({ initialData, onSubmit }: TrailFormProps) {
  const isEdit = !!initialData?.id;
  const [formData, setFormData] = useState({
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
    geojson: initialData?.geojson
      ? JSON.stringify(initialData.geojson, null, 2)
      : "",
  });

  // Imagens
  const [imagemPrincipal, setImagemPrincipal] = useState<File | null>(null);
  const [imagemPreview, setImagemPreview] = useState<string>(
    initialData?.imagem_url || "",
  );

  const [novasImagensGaleria, setNovasImagensGaleria] = useState<File[]>([]);
  const [galeriaExistente, setGaleriaExistente] = useState<string[]>(
    initialData?.imagens || [],
  );
  const [galeriaPreviews, setGaleriaPreviews] = useState<string[]>(
    initialData?.imagens || [],
  );

  const [isPending, setIsPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagemPrincipal(file);
      setImagemPreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setNovasImagensGaleria((prev) => [...prev, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setGaleriaPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeMainImage = () => {
    setImagemPrincipal(null);
    setImagemPreview("");
  };

  const removeGalleryImage = (index: number) => {
    const isExisting = index < galeriaExistente.length;

    if (isExisting) {
      setGaleriaExistente((prev) => prev.filter((_, i) => i !== index));
    } else {
      const newIndex = index - galeriaExistente.length;
      setNovasImagensGaleria((prev) => prev.filter((_, i) => i !== newIndex));
    }

    setGaleriaPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    const dataToSend = new FormData();

    // Campos textuais
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        dataToSend.append(key, String(value));
      }
    });

    // Imagem Principal
    if (imagemPrincipal) {
      dataToSend.append("imagem_principal", imagemPrincipal);
    } else if (isEdit && initialData?.imagem_url) {
      dataToSend.append("imagem_url_existente", initialData.imagem_url);
    }

    // Galeria - Novas imagens
    novasImagensGaleria.forEach((file) => {
      dataToSend.append("imagens_novas", file);
    });

    // Galeria - Imagens que já existiam (não foram removidas)
    galeriaExistente.forEach((url) => {
      dataToSend.append("imagens_existentes", url);
    });

    try {
      await onSubmit(dataToSend);
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar trilha");
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    return () => {
      if (imagemPreview) {
        URL.revokeObjectURL(imagemPreview);
      }
    };
  }, [imagemPreview]);

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
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, dificuldade: value }))
            }
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
            onChange={handleMainImageChange}
            className="cursor-pointer"
          />

          {imagemPreview && (
            <div className="relative w-64 h-44 rounded-xl overflow-hidden border">
              <Image
                src={imagemPreview}
                alt="Preview"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
              />
              <button
                type="button"
                onClick={removeMainImage}
                className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>
        <p className="text-xs text-slate-500">
          Recomendado: imagem horizontal, boa iluminação (máx. 5MB)
        </p>
      </div>
      <div className="space-y-3">
        {/* Grid de Previews da Galeria */}
        <Label>Fotos da Galeria (opcional)</Label>
        <Input
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          onChange={handleGalleryChange}
        />

        {galeriaPreviews.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {galeriaPreviews.map((preview, index) => (
              <div
                key={index}
                className="relative aspect-video rounded-lg overflow-hidden border group"
              >
                <Image
                  src={preview}
                  alt={`galeria-${index}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeGalleryImage(index)}
                  className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                >
                  <X size={16} />
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
          value={formData.geojson}
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
          {initialData ? "Atualizar Trilha" : "Salvar Trilha"}
        </Button>
      </div>
    </form>
  );
}
