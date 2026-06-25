"use client";

import { Profile } from "@/src/types/user";
import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { AvatarUpload } from "./AvatarUpload";
import { LocationFields } from "./LocationFields";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/providers/AuthProvider";

interface ProfileFormProps {
  profile: Profile;
  saving: boolean;
  onSave: (updates: Partial<Profile>) => Promise<Profile>;
  onUpload: (file: File) => Promise<Profile>;
  uploading: boolean;
}

export function ProfileForm({
  profile,
  saving,
  onSave,
  onUpload,
  uploading,
}: ProfileFormProps) {
  const [fullName, setFullName] = useState(profile.full_name ?? "");
  const [cidade, setCidade] = useState(profile.cidade ?? "");
  const [estado, setEstado] = useState(profile.estado ?? "");
  const [dificuldade, setDificuldade] = useState(
    profile.preferencia_dificuldade ?? "",
  );

  const [feedback, setFeedback] = useState<"success" | "error" | null>(null);

  const { signOut } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    try {
      await onSave({
        full_name: fullName,
        cidade,
        estado,
        preferencia_dificuldade:
          dificuldade as Profile["preferencia_dificuldade"],
      });
      setFeedback("success");
    } catch {
      setFeedback("error");
    }
  };

  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="full_name">Nome</Label>
        <Input
          id="full_name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Seu nome completo"
          className="bg-white"
        />
      </div>

      <LocationFields
        cidade={cidade}
        estado={estado}
        onCidadeChange={setCidade}
        onEstadoChange={setEstado}
      />

      <div className="space-y-2">
        <Label htmlFor="dificuldade">Nível de trilha preferido</Label>
        <Select value={dificuldade} onValueChange={setDificuldade}>
          <SelectTrigger className="bg-white" id="dificuldade">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas" defaultChecked>
              Todas
            </SelectItem>
            <SelectItem value="leve">Leve</SelectItem>
            <SelectItem value="moderada">Moderada</SelectItem>
            <SelectItem value="difícil">Difícil</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {feedback === "success" && (
        <p className="text-sm text-medium-green">
          Perfil atualizado com sucesso.
        </p>
      )}
      {feedback === "error" && (
        <p className="text-sm text-red-600">
          Não foi possível salvar. Tente novamente.
        </p>
      )}

      <AvatarUpload
        userName={profile.full_name ?? ""}
        uploading={uploading}
        onUpload={onUpload}
      />

      <Button
        type="submit"
        disabled={saving}
        className="bg-medium-green w-full"
      >
        {saving ? "Salvando..." : "Salvar alterações"}
      </Button>
      {/* <div className="w-fit"> */}
      <Button variant="destructive" onClick={handleLogout} className="w-full">
        <LogOut className="mr-2 h-4 w-4" />
        Sair da conta
      </Button>
      {/* </div> */}
    </form>
  );
}
