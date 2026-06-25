"use client";

import Image from "next/image";

interface Confirmado {
  userId: string;
  nome: string | null;
  avatarUrl: string | null;
}

interface ConfirmadosAvatarStackProps {
  confirmados: Confirmado[];
  total: number;
  maxVisivel?: number;
}

export function ConfirmadosAvatarStack({
  confirmados,
  total,
  maxVisivel = 5,
}: ConfirmadosAvatarStackProps) {
  if (total === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Seja o primeiro a confirmar presença!
      </p>
    );
  }

  const visiveis = confirmados.slice(0, maxVisivel);
  const restantes = total - visiveis.length;

  return (
    <div className="flex items-center gap-3">
      <div className="flex -space-x-2.5">
        {visiveis.map((c) => (
          <div
            key={c.userId}
            className="relative h-9 w-9 rounded-full overflow-hidden ring-2 ring-white bg-emerald-100"
            title={c.nome ?? "Participante"}
          >
            {c.avatarUrl ? (
              <Image
                src={c.avatarUrl}
                alt={c.nome ?? ""}
                fill
                sizes="36px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-emerald-700">
                {(c.nome ?? "?")[0]?.toUpperCase()}
              </div>
            )}
          </div>
        ))}

        {restantes > 0 && (
          <div className="relative h-9 w-9 rounded-full ring-2 ring-white bg-slate-100 flex items-center justify-center text-xs font-medium text-slate-600">
            +{restantes}
          </div>
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{total}</span>{" "}
        {total === 1 ? "confirmado" : "confirmados"}
      </p>
    </div>
  );
}
