"use client";

import { useAuth } from "@/src/lib/auth/AuthProvider";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/src/lib/auth/ProtectedRoute";
import { useProfile } from "@/src/lib/auth/useProfile";
import LoadingScreen from "@/src/components/shared/LoadingScreen";

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const { profile, loading } = useProfile();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  if (!user) {
    router.push("/trilhas");
    return <div>Redirecionando...</div>;
  }

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Meu Perfil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-sm text-slate-500">Nome</p>
              <p className="text-lg font-medium">
                {user.user_metadata?.full_name || "Usuário Petro Trilhas"}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Email</p>
              <p className="text-lg">{user.email}</p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Pontos eco</p>
              <p className="text-lg">{profile?.pontos_eco}</p>
            </div>

            <div className="pt-6 border-t">
              <Button
                variant="destructive"
                onClick={handleLogout}
                className="w-full"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sair da conta
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
