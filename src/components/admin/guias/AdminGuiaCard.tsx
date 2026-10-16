"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Edit,
  Trash2,
  Phone,
  BadgeCheck,
  Languages,
  Mail,
  Tag,
} from "lucide-react";
import { toast } from "sonner";
import { Guia } from "@/src/types/user";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import GuiaDeleteModal from "./GuiaDeleteModal";
import { useGuiaMutations } from "@/src/hooks/useGuias";
import { InstagramIcon } from "../../icons/InstagramIcon";
import { useRouter } from "next/navigation";

export default function AdminGuiaCard({ guias }: { guias: Guia[] }) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [guiaToDelete, setGuiaToDelete] = useState<{
    id: string;
    nome: string;
    foto_url: string | null;
  } | null>(null);
  const { deletarGuia, deletando } = useGuiaMutations();
  const router = useRouter();

  if (guias.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
        Nenhum guia cadastrado ainda.
      </div>
    );
  }

  const handleDelete = (guia: Guia) => {
    setGuiaToDelete({ id: guia.id, nome: guia.nome, foto_url: guia.foto_url });
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!guiaToDelete) return;

    try {
      await deletarGuia({
        guiaId: guiaToDelete.id,
        fotoUrl: guiaToDelete.foto_url,
      });
      toast.success("Guia deletado com sucesso!");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao deletar guia");
    } finally {
      setDeleteModalOpen(false);
      setGuiaToDelete(null);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {guias.map((guia) => (
          <div
            key={guia.id}
            className="bg-white rounded-2xl border p-4 space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative h-12 w-12 rounded-full overflow-hidden bg-slate-100 shrink-0">
                  {guia.foto_url ? (
                    <Image
                      src={guia.foto_url}
                      alt={guia.nome}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-slate-400 font-semibold">
                      {guia.nome.charAt(0)}
                    </div>
                  )}
                </div>
                <h3 className="font-semibold leading-snug truncate">
                  {guia.nome}
                </h3>
              </div>

              <Badge
                variant={guia.ativo ? "default" : "secondary"}
                className="shrink-0"
              >
                {guia.ativo ? "Ativo" : "Inativo"}
              </Badge>
            </div>

            <div className="space-y-1.5 text-sm text-slate-600">
              {guia.bio && (
                <p className="text-slate-600 line-clamp-2">{guia.bio}</p>
              )}

              {guia.cadastur && (
                <div className="flex items-center gap-2 flex-wrap">
                  <BadgeCheck size={15} className="text-emerald-600 shrink-0" />
                  Cadastur {guia.cadastur}
                  {guia.cadastur_validade && (
                    <span className="text-xs text-slate-400">
                      (válido até{" "}
                      {new Date(guia.cadastur_validade).toLocaleDateString(
                        "pt-BR",
                      )}
                      )
                    </span>
                  )}
                </div>
              )}

              {guia.telefone && (
                <div className="flex items-center gap-2">
                  <Phone size={15} className="text-slate-400 shrink-0" />
                  {guia.telefone}
                </div>
              )}

              {guia.email && (
                <div className="flex items-center gap-2">
                  <Mail size={15} className="text-slate-400 shrink-0" />
                  {guia.email}
                </div>
              )}

              {guia.instagram && (
                <div className="flex items-center gap-2">
                  <InstagramIcon
                    size={15}
                    className="text-slate-400 shrink-0"
                  />
                  {guia.instagram}
                </div>
              )}

              {guia.especialidades && guia.especialidades.length > 0 && (
                <div className="flex items-start gap-2 pt-1">
                  <Tag size={15} className="text-slate-400 shrink-0 mt-0.5" />
                  <div className="flex flex-wrap gap-1.5">
                    {guia.especialidades.map((esp) => (
                      <Badge
                        key={esp}
                        variant="secondary"
                        className="bg-slate-100 text-slate-700"
                      >
                        {esp}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {guia.idiomas && guia.idiomas.length > 0 && (
                <div className="flex items-start gap-2 pt-1">
                  <Languages
                    size={15}
                    className="text-slate-400 shrink-0 mt-0.5"
                  />
                  <div className="flex flex-wrap gap-1.5">
                    {guia.idiomas.map((idioma) => (
                      <Badge
                        key={idioma}
                        variant="secondary"
                        className="bg-slate-100 text-slate-700"
                      >
                        {idioma}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-xs text-slate-400 pt-1">
                Cadastrado em{" "}
                {new Date(guia.created_at).toLocaleDateString("pt-BR")}
              </p>
            </div>

            <div className="flex gap-2 pt-1">
              <Button variant="outline" size="sm" asChild className="flex-1">
                <Link href={`/guias-admin/${guia.id}/edit`}>
                  <Edit size={15} className="mr-1.5" />
                  Editar
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-red-600 hover:bg-red-50 hover:text-red-600"
                onClick={() => handleDelete(guia)}
              >
                <Trash2 size={15} className="mr-1.5" />
                Excluir
              </Button>
            </div>
          </div>
        ))}
      </div>

      <GuiaDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        nome={guiaToDelete?.nome || ""}
        deleting={deletando}
      />
    </>
  );
}
