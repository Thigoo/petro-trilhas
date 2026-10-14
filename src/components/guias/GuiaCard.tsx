// components/guias/GuiaCard.tsx
import Image from "next/image";
import { Phone, BadgeCheck } from "lucide-react";
import { Guia } from "@/src/types/user";
import { Badge } from "../ui/badge";

export function GuiaCard({ guia }: { guia: Guia }) {
  const whatsappLink = guia.telefone
    ? `https://wa.me/${guia.telefone.replace(/\D/g, "")}`
    : null;

  return (
    <div className="rounded-2xl border bg-white overflow-hidden hover:shadow-md transition-shadow p-4 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="relative h-16 w-16 rounded-full overflow-hidden bg-slate-100 shrink-0">
          {guia.foto_url ? (
            <Image
              src={guia.foto_url}
              alt={guia.nome}
              fill
              sizes="64px"
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-slate-400 text-xl font-semibold">
              {guia.nome.charAt(0)}
            </div>
          )}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="font-semibold truncate">{guia.nome}</h3>
            {guia.cadastur && (
              <BadgeCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            )}
          </div>
          {guia.cadastur && (
            <p className="text-xs text-muted-foreground">
              Cadastur {guia.cadastur}
            </p>
          )}
        </div>
      </div>

      {guia.bio && (
        <p className="text-sm text-muted-foreground line-clamp-3">{guia.bio}</p>
      )}

      {guia.especialidades && guia.especialidades.length > 0 && (
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
      )}

      <div className="flex items-center gap-3 mt-auto pt-2">
        {whatsappLink && (
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:underline"
          >
            <Phone className="h-4 w-4" />
            WhatsApp
          </a>
        )}
        {guia.instagram && (
          <a
            href={`https://instagram.com/${guia.instagram.replace("@", "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-medium-green"
          >
            {/* <Instagram className="h-4 w-4" /> */}
            Instagram
          </a>
        )}
      </div>
    </div>
  );
}
