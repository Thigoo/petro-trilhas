import { z } from "zod";

export const trailSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  slug: z.string().min(3, "O slug deve ser preenchido"),
  dificuldade: z.enum(["leve", "moderada", "difícil"]),

  distancia_km: z.coerce
    .number()
    .min(0.1, "Distância deve ser maior que 0.1 km"),
  tempo_estimado_min: z.coerce
    .number()
    .int()
    .min(1, "Tempo deve ser pelo menos 1 minuto"),

  desnivel_m: z.coerce.number().min(0).nullable().optional(),
  altitude_max: z.coerce.number().min(0).nullable().optional(),

  localizacao: z.string().min(1, "Localização é obrigatória"),
  descricao_curta: z.string().max(150).nullable().optional(),
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
      z.instanceof(File), // Nova imagem enviada
      z.string().min(1), // URL existente (string)
      z.string().url(), // URL válida
      z.literal(""), // String vazia (comum no update)
      z.null(),
      z.undefined(),
    ])
    .optional()
    .nullable(),

  imagens: z
    .union([z.array(z.any()), z.array(z.instanceof(File))])
    .optional()
    .default([]),
});
