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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cidade">Cidade</Label>
          <Input
            id="cidade"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            placeholder="Petrópolis"
            className="bg-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="estado">Estado</Label>
          <Input
            id="estado"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            placeholder="RJ"
            maxLength={2}
            className="bg-white"
          />
        </div>
      </div>

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

      <Button type="submit" disabled={saving} className="w-full">
        {saving ? "Salvando..." : "Salvar alterações"}
      </Button>
    </form>
  );
}
