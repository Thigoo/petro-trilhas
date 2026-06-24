"use client";

import ProtectedRoute from "@/src/components/auth/ProtectedRoute";
import { FavoritesList } from "@/src/components/profile/FavoriteList";
import { ProfileForm } from "@/src/components/profile/ProfileForm";
import LoadingScreen from "@/src/components/shared/LoadingScreen";
import { Button } from "@/src/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { useProfile } from "@/src/hooks/useProfile";
import { useAuth } from "@/src/providers/AuthProvider";
import { Calendar, Heart, LogOut, Settings } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const { profile, loading, saving, updateProfile } = useProfile();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <ProtectedRoute>
      {loading ? (
        <LoadingScreen />
      ) : (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          {/* Header de identidade */}
          <div className="flex items-center gap-4 mb-8">
            <div className="relative h-16 w-16 shrink-0 rounded-full overflow-hidden bg-emerald-100 ring-2 ring-emerald-600/20">
              {user?.user_metadata?.avatar_url ? (
                <Image
                  src={user.user_metadata.avatar_url}
                  alt={profile?.full_name || "Avatar"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-emerald-700">
                  {(profile?.full_name || user?.email || "U")[0].toUpperCase()}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight truncate">
                {profile?.full_name || "Usuário Petro Trilhas"}
              </h1>
              <p className="text-sm text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
          </div>

          {/* Abas */}
          <Tabs defaultValue="dados" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="dados" className="gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Dados</span>
              </TabsTrigger>
              <TabsTrigger value="favoritos" className="gap-2">
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">Favoritos</span>
              </TabsTrigger>
              <TabsTrigger value="eventos" className="gap-2">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Eventos</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dados" className="mt-6 space-y-6">
              {profile && (
                <ProfileForm
                  profile={profile}
                  saving={saving}
                  onSave={updateProfile}
                />
              )}

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
            </TabsContent>

            <TabsContent value="favoritos" className="mt-6">
              <FavoritesList />
            </TabsContent>

            <TabsContent value="eventos" className="mt-6">
              <div className="text-center py-16 text-muted-foreground">
                <Calendar className="h-10 w-10 mx-auto mb-3 opacity-40" />
                <p>Em breve você poderá acompanhar seus eventos aqui.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </ProtectedRoute>
  );
}
