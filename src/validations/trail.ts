import { z } from "zod";

export const trailSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  slug: z.string().min(3, "O slug deve ser preenchido"),
  dificuldade: z.custom((dificuldade) =>
    ["leve", "moderada", "difícil"].includes(dificuldade as string),
  ),
  distancia_km: z.coerce
    .number()
    .min(0.1, "A distância deve ser maior que zero"),
  tempo_estimado_min: z.coerce
    .number()
    .int()
    .min(1, "O tempo deve ser pelo menos 1 minuto"),
  desnivel_m: z.coerce.number().min(0).nullable().optional(),
  altitude_max: z.coerce.number().min(0).nullable().optional(),

  localizacao: z.string().min(1, "A localização é obrigatória"),
  descricao_curta: z
    .string()
    .max(150, "A descrição curta deve ter no máximo 150 caracteres")
    .nullable()
    .optional(),
  descricao: z.string().nullable().optional(),
  fonte: z.string().nullable().optional(),

  geojson: z.string().refine((val) => {
    try {
      JSON.parse(val);
      return true;
    } catch {
      return false;
    }
  }, "O GeoJSON deve ser um JSON válido"),

  imagem_url: z
    .union([
      z
        .instanceof(File)
        .refine((file) => file.size <= 5 * 1024 * 1024, "Máximo 5MB"),
      z.string().min(1, "URL da imagem é obrigatória"),
      z.null(),
      z.any(),
    ])
    .optional(),

  imagens: z.array(z.any()).optional().default([]),
});

export type TrailFormData = z.infer<typeof trailSchema>;
