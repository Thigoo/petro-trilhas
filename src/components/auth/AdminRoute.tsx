"use client";

import { useProfile } from "@/src/hooks/useProfile";
import { useAuth } from "@/src/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { LoginPromptDialog } from "../shared/LoginDialog";

export default function AdminRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: profileLoading } = useProfile();
  const router = useRouter();

  if (authLoading || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Carregando...
      </div>
    );
  }

  if (!user) {
    return (
      <LoginPromptDialog
        open={true}
        onOpenChange={() => {}}
        onCancel={() => router.back()}
        title="Entre para acessar essa área"
        description="Você precisa estar logado para gerenciar trilhas."
        confirmText="Fazer login"
        cancelText="Voltar"
      />
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3">
        <p className="text-lg font-medium">Acesso restrito</p>
        <p className="text-sm text-muted-foreground">
          Essa área é exclusiva para administradores.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
