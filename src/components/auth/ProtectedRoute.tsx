"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/src/providers/AuthProvider";
import { LoginPromptDialog } from "../shared/LoginDialog";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
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
        onCancel={() => router.back()}
        title="Entre para acessar seu perfil"
        description="Você precisa estar logado para ver e editar suas informações."
        confirmText="Fazer login"
        cancelText="Voltar"
      />
    );
  }

  return <>{children}</>;
}
