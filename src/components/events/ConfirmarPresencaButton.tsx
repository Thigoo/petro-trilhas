"use client";

import { Check, Loader2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useConfirmacoes } from "@/src/hooks/useConfirmacoes";
import { LoginPromptDialog } from "@/src/components/shared/LoginDialog";

export function ConfirmarPresencaButton({ eventoId }: { eventoId: string }) {
  const {
    jaConfirmou,
    toggleConfirmacao,
    confirmando,
    erroVagas,
    showLoginPrompt,
    setShowLoginPrompt,
  } = useConfirmacoes(eventoId);

  return (
    <>
      <div className="space-y-2">
        <Button
          onClick={toggleConfirmacao}
          disabled={confirmando}
          variant={jaConfirmou ? "outline" : "default"}
          className={
            jaConfirmou
              ? "border-emerald-600 text-emerald-700 hover:bg-emerald-50"
              : "bg-emerald-600 hover:bg-emerald-700"
          }
        >
          {confirmando ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : jaConfirmou ? (
            <Check className="mr-2 h-4 w-4" />
          ) : null}
          {jaConfirmou ? "Presença confirmada" : "Confirmar presença"}
        </Button>

        {erroVagas && <p className="text-sm text-red-600">{erroVagas}</p>}
      </div>

      <LoginPromptDialog
        open={showLoginPrompt}
        onOpenChange={setShowLoginPrompt}
        title="Entre para confirmar presença"
        description="Você precisa estar logado para confirmar presença em eventos e ver quem mais vai."
        confirmText="Fazer login"
        cancelText="Continuar navegando"
      />
    </>
  );
}
