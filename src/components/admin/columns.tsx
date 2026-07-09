"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Edit, Eye, MoreHorizontal, Lock, Globe } from "lucide-react";
import { ITrail } from "@/src/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { toggleTrailPublishStatus } from "@/src/actions/admin/trails";
import { DeleteTrailDialog } from "./DeleteTrailDialog";
import { toast } from "sonner";

export const columns: ColumnDef<ITrail>[] = [
  {
    accessorKey: "imagem_url",
    header: "Imagem",
    cell: ({ row }) => {
      return row.original.imagem_url ? (
        <Link
          href={row.original.imagem_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block group"
        >
          <div className="relative w-12 h-12 rounded-md overflow-hidden border transition-opacity group-hover:opacity-80">
            <Image
              src={row.original.imagem_url}
              alt={row.original.nome}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover"
            />
          </div>
        </Link>
      ) : (
        <div className="w-12 h-12 bg-slate-100 rounded-md flex items-center justify-center text-slate-400 border border-dashed">
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

      const currentStatus = trail.publicada;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>

            <DropdownMenuItem asChild>
              <Link
                href={`/trilhas-admin/${trail.slug}/edit`}
                className="flex items-center cursor-pointer"
              >
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link
                href={`/trilhas/${trail.slug}`}
                className="flex items-center cursor-pointer"
              >
                <Eye className="mr-2 h-4 w-4" />
                Visualizar no app
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => {
                try {
                  if (currentStatus !== undefined) {
                    toggleTrailPublishStatus(trail.id, currentStatus);
                  }
                  toast.success(
                    `Trilha ${currentStatus ? "despublicada" : "publicada"} com sucesso!`,
                  );
                } catch (error: unknown) {
                  toast.error("Erro ao alterar status.");
                  console.error("Toggle Error:", error);
                }
              }}
              className="cursor-pointer"
            >
              {trail.publicada ? (
                <div className="flex items-center">
                  <Lock className="mr-2 h-4 w-4" />
                  Despublicar
                </div>
              ) : (
                <>
                  <Globe className="mr-2 h-4 w-4" />
                  Publicar
                </>
              )}
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DeleteTrailDialog
              id={trail.id}
              slug={trail.slug}
              trailName={trail.nome}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
