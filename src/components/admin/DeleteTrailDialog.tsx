"use client";

import { useState, useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/components/ui/alert-dialog";
import { DropdownMenuItem } from "@/src/components/ui/dropdown-menu";
import { deleteTrail } from "@/src/actions/admin/trails";
import { toast } from "sonner";

interface DeleteTrailDialogProps {
  id: string;
  slug: string;
  trailName: string;
}

export function DeleteTrailDialog({
  id,
  slug,
  trailName,
}: DeleteTrailDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteTrail(id, slug);
        setOpen(false);
        toast.success("Trilha excluida com sucesso!");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error("Erro ao excluir trilha.");
        console.error("Erro ao excluir trilha:", error);
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {/* O asChild aqui é crucial para integrar com o DropdownMenuItem */}
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()} // Evita fechar o dropdown antes do modal abrir
          className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Excluir
        </DropdownMenuItem>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
          <AlertDialogDescription>
            Isso excluirá permanentemente a trilha <strong>{trailName}</strong>{" "}
            e removerá todos os arquivos associados ao slug{" "}
            <code className="bg-slate-200 px-1">{slug}</code> no storage.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Excluindo...
              </>
            ) : (
              "Sim, excluir"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
