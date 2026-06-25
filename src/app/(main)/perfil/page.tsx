"use client";

import ProtectedRoute from "@/src/components/auth/ProtectedRoute";
import { FavoritesList } from "@/src/components/profile/FavoriteList";
import { ProfileForm } from "@/src/components/profile/ProfileForm";
import LoadingScreen from "@/src/components/shared/LoadingScreen";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { useProfile } from "@/src/hooks/useProfile";
import { useAuth } from "@/src/providers/AuthProvider";
import { getPlaceholderAvatar } from "@/src/utils/formatter";
import { Calendar, Heart, Settings } from "lucide-react";
import Image from "next/image";

export default function ProfilePage() {
  const { user } = useAuth();
  const {
    profile,
    loading,
    saving,
    updateProfile,
    updateAvatar,
    uploadingAvatar,
  } = useProfile();

  return (
    <ProtectedRoute>
      {loading ? (
        <LoadingScreen />
      ) : (
        <div className="min-h-screen bg-slate-50 pb-12 text-muted-foreground">
          <div className="container mx-auto px-4 py-8 max-w-3xl">
            {/* Header de identidade */}
            <div className="flex items-center gap-4 mb-8">
              <div className="relative h-16 w-16 shrink-0 rounded-full overflow-hidden bg-medium-green/20 ring-2 ring-medium-green">
                {profile?.avatar_url ? (
                  <Image
                    src={profile?.avatar_url}
                    alt={profile?.full_name || "Avatar"}
                    fill
                    sizes="100%"
                    loading="eager"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-light-green">
                    {getPlaceholderAvatar(profile?.full_name || "")}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl font-bold tracking-tight truncate">
                  {profile?.full_name || "Usuário Petro Trilhas"}
                </h1>
                <p className="text-sm truncate">{user?.email}</p>
              </div>
            </div>

            {/* Abas */}
            <Tabs defaultValue="dados">
              <TabsList className="grid w-full grid-cols-3 bg-gray-300">
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
                    onUpload={updateAvatar}
                    uploading={uploadingAvatar}
                  />
                )}
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
        </div>
      )}
    </ProtectedRoute>
  );
}
