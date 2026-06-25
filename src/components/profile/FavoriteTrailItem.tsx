"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Ruler } from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import { ITrail } from "@/src/types";

interface FavoriteTrailItemProps {
  trail: ITrail;
  onRemove: (trilhaId: string) => void;
}

const dificuldadeColor: Record<string, string> = {
  leve: "bg-emerald-100 text-emerald-700",
  moderada: "bg-amber-100 text-amber-700",
  difícil: "bg-red-100 text-red-700",
};

export function FavoriteTrailItem({ trail, onRemove }: FavoriteTrailItemProps) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl border bg-white hover:shadow-sm transition-shadow">
      <Link
        href={`/trilhas/${trail.slug}`}
        className="flex items-center gap-3 flex-1 min-w-0"
      >
        <div className="relative h-14 w-14 shrink-0 rounded-xl overflow-hidden bg-slate-100">
          {trail.imagem_url ? (
            <Image
              src={trail.imagem_url}
              alt={trail.nome}
              fill
              className="object-cover"
              sizes="56px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-slate-800 to-slate-900">
              <span className="text-3xl">🏔️</span>
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 ">
          <p className="font-medium text-sm truncate">{trail.nome}</p>
          <div className="flex items-center gap-2 mt-1">
            <Badge
              variant="secondary"
              className={`text-xs px-2 py-0 capitalize ${dificuldadeColor[trail.dificuldade] ?? ""}`}
            >
              {trail.dificuldade}
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Ruler className="h-3 w-3" />
              {trail.distancia_km} km
            </span>
          </div>
        </div>
      </Link>

      <button
        onClick={(e) => {
          e.preventDefault();
          onRemove(trail.id);
        }}
        className="shrink-0 p-2 rounded-full hover:bg-rose-50 transition-colors"
        aria-label="Remover dos favoritos"
      >
        <Heart className="h-4 w-4 fill-rose-500 text-rose-500" />
      </button>
    </div>
  );
}
