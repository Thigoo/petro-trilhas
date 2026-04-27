"use client";

import { Card } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import Link from "next/link";
import { ITrail } from "@/src/types";
import { ArrowRight, Clock, MapPin, Ruler } from "lucide-react";
import Image from "next/image";

interface CardTrailProps {
  trail: ITrail;
}

export default function TrailCard({ trail }: CardTrailProps) {
  return (
    <Link href={`/trilhas/${trail.slug}`} className="block">
      <Card className="group overflow-hidden p-0 hover:border-green-500 hover:shadow-xl transition-all duration-300 h-full flex flex-col md:flex-row">
        {/* Imagem */}
        <div className="relative w-full md:w-5/12 lg:w-2/5 h-56 md:h-auto overflow-hidden bg-slate-200">
          {trail.imagem_url ? (
            <Image
              src={trail.imagem_url}
              alt={trail.nome}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-slate-800 to-slate-900">
              <span className="text-6xl text-slate-500">🏔️</span>
            </div>
          )}

          {/* Badge de dificuldade sobre a imagem */}
          <div className="absolute top-4 left-4">
            <Badge
              variant="secondary"
              className="capitalize font-medium shadow-md"
            >
              {trail.dificuldade}
            </Badge>
          </div>
        </div>

        {/* Informações */}
        <div className="flex-1 flex flex-col p-6">
          <div className="flex-1">
            <h3 className="font-semibold text-default text-xl leading-tight group-hover:text-green-700 transition-colors mb-3">
              {trail.nome}
            </h3>

            {trail.descricao_curta && (
              <p className="text-slate-600 text-[15px] line-clamp-2 mb-5">
                {trail.descricao_curta}
              </p>
            )}
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-slate-600">
                <Ruler className="w-4 h-4" />
                <span className="font-medium">{trail.distancia_km} km</span>
              </div>

              <div className="flex items-center gap-1.5 text-slate-600">
                <Clock className="w-4 h-4" />
                <span className="font-medium">
                  {Math.floor(trail.tempo_estimado_min / 60)}h{" "}
                  {trail.tempo_estimado_min % 60}min
                </span>
              </div>
            </div>

            {trail.desnivel_m && (
              <div className="flex items-center gap-1.5 text-slate-600">
                <span className="text-lg leading-none">↑</span>
                <span className="font-medium">
                  {trail.desnivel_m} m de desnível
                </span>
              </div>
            )}

            {trail.localizacao && (
              <div className="flex items-center gap-1.5 text-slate-600">
                <MapPin className="w-4 h-4" />
                <span>{trail.localizacao}</span>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-green-600 transition-colors" />
          </div>
        </div>
      </Card>
    </Link>
  );
}
