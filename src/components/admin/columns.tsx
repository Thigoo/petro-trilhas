// src/components/admin/trilhas/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Edit, Trash2, Eye } from "lucide-react";
import { ITrail } from "@/src/types";

export const columns: ColumnDef<ITrail>[] = [
  {
    accessorKey: "imagem_url",
    header: "Imagem",
    cell: ({ row }) => {
      const imagemUrl = row.original.imagem_url;
      return imagemUrl ? (
        <div className="relative w-12 h-12 rounded-md overflow-hidden border">
          <Image
            src={imagemUrl}
            alt={row.original.nome}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="w-12 h-12 bg-slate-200 rounded-md flex items-center justify-center text-slate-400">
          🏔️
        </div>
      );
    },
  },
  {
    accessorKey: "nome",
    header: "Nome da Trilha",
    cell: ({ row }) => (
      <div className="font-medium max-w-65 truncate">{row.original.nome}</div>
    ),
  },
  {
    accessorKey: "dificuldade",
    header: "Dificuldade",
    cell: ({ row }) => {
      const diff = row.original.dificuldade;
      const colors = {
        leve: "bg-green-100 text-green-700",
        moderada: "bg-yellow-100 text-yellow-700",
        difícil: "bg-red-100 text-red-700",
      };
      return (
        <Badge
          variant="secondary"
          className={colors[diff as keyof typeof colors]}
        >
          {diff}
        </Badge>
      );
    },
  },
  {
    accessorKey: "distancia_km",
    header: "Distância",
    cell: ({ row }) => `${row.original.distancia_km} km`,
  },
  {
    accessorKey: "desnivel_m",
    header: "Desnível",
    cell: ({ row }) =>
      row.original.desnivel_m ? `${row.original.desnivel_m} m` : "-",
  },
  {
    accessorKey: "localizacao",
    header: "Localização",
    cell: ({ row }) => row.original.localizacao || "-",
  },
  {
    accessorKey: "publicada",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.publicada ? "default" : "secondary"}>
        {row.original.publicada ? "Publicado" : "Rascunho"}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {
      const trail = row.original;
      return (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/admin/trilhas/${trail.id}/edit`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>

          <Button variant="ghost" size="icon" asChild>
            <Link href={`/trilhas/${trail.slug}`} target="_blank">
              <Eye className="h-4 w-4" />
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
