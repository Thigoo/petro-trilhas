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
