import z from "zod";

export const guiaSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  bio: z.string().optional(),
  telefone: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  instagram: z.string().optional(),
  cadastur: z.string().optional(),
  cadastur_validade: z.string().optional(),
  especialidades: z.string().optional(), // vem como CSV do input, tratado abaixo
  idiomas: z.string().optional(),
  ativo: z.coerce.boolean().optional(),
});
