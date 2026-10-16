import { Difficulty } from "..";

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  cidade: string | null;
  estado: string | null;
  preferencia_dificuldade: Difficulty | null;
  role: "user" | "admin";
}

// types/guia.ts (ou onde já ficam os outros tipos, ex: types/database.ts)
export type Guia = {
  id: string;
  nome: string;
  foto_url: string | null;
  bio: string | null;
  telefone: string | null;
  email: string | null;
  instagram: string | null;
  cadastur: string | null;
  cadastur_validade: string | null;
  especialidades: string[] | null;
  idiomas: string[] | null;
  ativo: boolean;
  criado_por: string;
  created_at: string;
  updated_at: string;
};

export type NovoGuia = Omit<
  Guia,
  "id" | "created_at" | "updated_at" | "criado_por"
>;
