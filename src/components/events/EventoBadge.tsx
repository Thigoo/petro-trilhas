"use client";

import Link from "next/link";
import { Calendar } from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import { useEventosPorTrilha } from "@/src/hooks/useEventos";

export function EventoBadge({ trilhaId }: { trilhaId: string }) {
  const { data: eventos = [] } = useEventosPorTrilha(trilhaId);

  if (eventos.length === 0) return null;

  return (
    <Link href="/eventos">
      <Badge
        variant="secondary"
        className="bg-emerald-100 text-emerald-700 ml-2"
      >
        <Calendar className="h-3 w-3 mr-1" />
        {eventos.length === 1 ? "1 evento" : `${eventos.length} eventos`}
      </Badge>
    </Link>
  );
}
