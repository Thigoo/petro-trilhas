"use client";

import { ArrowRight, Clock, Heart, MapPin, Ruler } from "lucide-react";
import { useFavorites } from "@/src/hooks/useFavorites";
import { LoginPromptDialog } from "@/src/components/shared/LoginDialog";
import Link from "next/link";
import { Card } from "../ui/card";
import Image from "next/image";
import { ITrail } from "@/src/types";
import { Badge } from "../ui/badge";

interface CardTrailProps {
  trail: ITrail;
}

export default function TrailCard({ trail }: CardTrailProps) {
  const { toggleFavorite, isFavorite, showLoginPrompt, setShowLoginPrompt } =
    useFavorites();
  const favorited = isFavorite(trail.id);

  return (
    <>
      <Link href={`/trilhas/${trail.slug}`} className="block p-2">
        <Card className="group overflow-hidden p-0 hover:shadow-xl transition-all duration-300 h-full flex flex-col md:flex-row text-muted-foreground">
          {/* Imagem */}
          <div className="relative w-full md:w-5/12 lg:w-2/5 h-56 md:h-auto overflow-hidden">
            {trail.imagem_url ? (
              <Image
                src={trail.imagem_url}
                alt={trail.nome}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 40vw"
                loading="eager"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-slate-800 to-slate-900">
                <span className="text-6xl">🏔️</span>
              </div>
            )}

            {/* Badge de dificuldade sobre a imagem */}
            <div className="absolute top-4 left-4">
              <Badge className="capitalize text-muted-foreground font-medium shadow-md bg-white">
                {trail.dificuldade}
              </Badge>
            </div>

            {/* Botão de favorito sobre a imagem */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(trail.id);
              }}
              aria-label={
                favorited ? "Remover dos favoritos" : "Adicionar aos favoritos"
              }
              className="absolute top-4 right-4 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-white transition-colors"
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  favorited ? "fill-rose-500 text-rose-500" : "text-slate-600"
                }`}
              />
            </button>
          </div>

          {/* Informações */}
          <div className="flex-1 flex flex-col p-6">
            <div className="flex-1">
              <h3 className="font-semibold text-xl leading-tight group-hover:text-medium-green transition-colors mb-3">
                {trail.nome}
              </h3>

              {trail.descricao_curta && (
                <p className="text-[15px] mb-5">{trail.descricao_curta}</p>
              )}
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <Ruler className="w-4 h-4" />
                  <span className="font-medium">{trail.distancia_km} km</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">
                    {Math.floor(trail.tempo_estimado_min / 60)}h{" "}
                    {trail.tempo_estimado_min % 60}min
                  </span>
                </div>
              </div>

              {trail.localizacao && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  <span>{trail.localizacao}</span>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-medium-green transition-colors" />
            </div>
          </div>
        </Card>
      </Link>

      <LoginPromptDialog
        open={showLoginPrompt}
        onOpenChange={setShowLoginPrompt}
        title="Entre para favoritar trilhas"
        description="Você precisa estar logado para salvar trilhas favoritas e acessá-las depois."
        confirmText="Fazer login"
        cancelText="Continuar navegando"
      />
    </>
  );
}
