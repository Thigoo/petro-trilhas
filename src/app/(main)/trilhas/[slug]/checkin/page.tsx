"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getTrailBySlug } from "@/src/lib/trails";
import ProtectedRoute from "@/src/lib/auth/ProtectedRoute";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Textarea } from "@/src/components/ui/textarea";
import { Label } from "@/src/components/ui/label";
import { ArrowLeft, Upload } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ITrail } from "@/src/types";

export default function CheckinPage() {
  const params = useParams();
  const router = useRouter();
  //   const { user } = useAuth();

  const slug = params.slug as string;
  const [trilha, setTrilha] = useState<ITrail | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [notas, setNotas] = useState("");

  useEffect(() => {
    async function loadTrilha() {
      if (!slug) return;
      const data = await getTrailBySlug(slug);
      if (data) setTrilha(data);
      setLoading(false);
    }
    loadTrilha();
  }, [slug]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoFile) {
      alert("Por favor, envie uma foto da chegada.");
      return;
    }

    setSubmitting(true);
    // TODO: Implementar upload + salvamento
    console.log("Check-in enviado para trilha:", slug);

    alert("Check-in realizado com sucesso! (Simulação)");
    router.push(`/trilhas/${slug}`);
  };

  if (loading)
    return <div className="text-center py-20">Carregando trilha...</div>;
  if (!trilha)
    return <div className="text-center py-20">Trilha não encontrada.</div>;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 pb-12">
        <div className="container mx-auto p-4 md:p-6 max-w-2xl">
          <div className="flex items-center gap-4 mb-8">
            <Link
              href={`/trilhas/${slug}`}
              className="text-green-600 hover:text-green-700"
            >
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-2xl font-bold text-green-900">
              Fazer Check-in
            </h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{trilha.nome}</CardTitle>
              <p className="text-sm text-slate-500">
                {trilha.dificuldade} • {trilha.distancia_km} km •{" "}
                {trilha.tempo_estimado_min} min
              </p>
            </CardHeader>

            <CardContent className="space-y-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Upload de Foto */}
                <div>
                  <Label className="text-base font-medium mb-3 block">
                    Foto da chegada (obrigatória)
                  </Label>

                  <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:border-green-400 transition-colors">
                    {photoPreview ? (
                      <Image
                        src={photoPreview}
                        alt="Preview"
                        className="mx-auto max-h-80 rounded-xl"
                        width={800}
                        height={600}
                        loading="lazy"
                        quality={75}
                      />
                    ) : (
                      <div>
                        <Upload className="mx-auto h-12 w-12 text-slate-400 mb-3" />
                        <p className="text-slate-600">
                          Clique para enviar foto da trilha
                        </p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label
                      htmlFor="photo-upload"
                      className="mt-4 inline-block px-6 py-2 bg-green-100 text-green-700 rounded-full cursor-pointer hover:bg-green-200 transition-colors"
                    >
                      Escolher foto
                    </label>
                  </div>
                </div>

                {/* Observações */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="notas">Observações (opcional)</Label>
                  <Textarea
                    id="notas"
                    placeholder="Como foi a experiência? Alguma observação?"
                    value={notas}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setNotas(e.target.value)
                    }
                    rows={4}
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-green-600 hover:bg-green-700 py-7 text-lg"
                  disabled={submitting || !photoFile}
                >
                  {submitting
                    ? "Registrando check-in..."
                    : "Confirmar Check-in"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
