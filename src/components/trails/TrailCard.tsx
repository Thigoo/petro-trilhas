"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import Link from "next/link";
import { Trail } from "@/src/types";

interface CardTrailProps {
  trail: Trail;
}

export default function TrailCard({ trail }: CardTrailProps) {
  return (
    <Link href={`/trilhas/${trail.slug}`}>
      <Card className="hover:border-green-500 hover:shadow-md transition-all duration-200 cursor-pointer group h-full">
        <CardHeader className="p-5">
          <div className="flex justify-between items-start mb-3">
            <CardTitle className="text-lg leading-tight group-hover:text-green-700 transition-colors">
              {trail.nome}
            </CardTitle>
            <Badge
              variant="outline"
              className="capitalize text-xs font-medium px-3 py-1"
            >
              {trail.dificuldade}
            </Badge>
          </div>

          <CardDescription className="text-sm text-slate-600 line-clamp-2 mb-4">
            {trail.descricao}
          </CardDescription>

          <div className="flex items-center gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-1.5">
              <span>📏</span>
              <span className="font-medium">{trail.distancia_km} km</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>⏱️</span>
              <span className="font-medium">
                {trail.tempo_estimado_min} min
              </span>
            </div>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
