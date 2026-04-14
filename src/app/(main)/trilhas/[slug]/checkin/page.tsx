"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
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
import { Input } from "@/src/components/ui/input";
import { useAuth } from "@/src/lib/auth/AuthProvider";
import postCheckin from "@/src/lib/checkins";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/src/components/shared/LoadingScreen";

export default function CheckinPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const slug = params.slug as string;
  const [trail, setTrail] = useState<ITrail | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState("");

  useEffect(() => {
    async function loadTrilha() {
      if (!slug) return;
      const data = await getTrailBySlug(slug);
      if (data) setTrail(data);
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

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!photoFile) {
      alert("Por favor, envie uma foto da chegada.");
      return;
    }

    if (!user) {
      alert("Você precisa estar logado para fazer o check-in.");
      return;
    }

    setSubmitting(true);

    if (!trail) {
      console.error("Cadê a trilha gente!");
      return;
    }

    const result = await postCheckin({
      trilha_id: trail.id,
      user_id: user.id,
      comentario: comment,
      nota: rating.trim() || null,
      foto_file: photoFile,
    });

    setSubmitting(false);

    if (result.success) {
      alert(result.message);
      router.push(`/trilhas/${slug}`);
    } else {
      alert(result.message);
    }
  };

  if (loading) return <LoadingScreen />;
  if (!trail)
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
              <CardTitle>{trail.nome}</CardTitle>
              <p className="text-sm text-slate-500">
                {trail.dificuldade} • {trail.distancia_km} km •{" "}
                {trail.tempo_estimado_min} min
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
                        alt="Preview da foto"
                        width={800}
                        height={600}
                        className="mx-auto max-h-105 w-full object-contain rounded-2xl"
                        style={{ height: "auto" }}
                        priority={false}
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
                  <Label htmlFor="comment">Comentário (opcional)</Label>
                  <Textarea
                    id="comment"
                    placeholder="Como foi a experiência? Deixe seu comentário."
                    value={comment}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setComment(e.target.value)
                    }
                    rows={4}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="notas">Nota</Label>
                  <Input
                    id="notas"
                    placeholder="Nota (de 0 a 10)"
                    value={rating}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setRating(e.target.value)
                    }
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
