"use server";

import { supabase } from "@/src/lib/supabase";
import { trailSchema } from "@/src/validations/trail";
import { revalidatePath } from "next/cache";

export async function registerTrail(formData: FormData) {
  const rawEntries = Object.fromEntries(formData.entries());
  const result = trailSchema.safeParse({
    ...rawEntries,
    imagem_url: formData.get("imagem_url"),
    imagens: formData.getAll("imagens"),
  });

  if (!result.success) {
    const errorMessage = result.error.issues[0].message;
    return { success: false, message: `Erro de validação: ${errorMessage}` };
  }

  const validatedData = result.data;

  try {
    const mainFile = formData.get("imagem_url") as File;
    const mainFilePath = `trilhas/${validatedData.slug}/capa-${Date.now()}-${mainFile.name}`;

    const { error: mainError } = await supabase.storage
      .from("trails-photos")
      .upload(mainFilePath, mainFile);

    if (mainError)
      throw new Error(`Erro no upload da capa: ${mainError.message}`);

    const mainPublicUrl = supabase.storage
      .from("trails-photos")
      .getPublicUrl(mainFilePath).data.publicUrl;

    const galleryFiles = formData.getAll("imagens") as File[];
    const galleryUrls: string[] = [];

    for (const file of galleryFiles) {
      if (file.size === 0) continue;

      const path = `trilhas/${validatedData.slug}/galeria-${Date.now()}-${file.name}`;
      const { error: galError } = await supabase.storage
        .from("trails-photos")
        .upload(path, file);

      if (!galError) {
        const url = supabase.storage.from("trails-photos").getPublicUrl(path)
          .data.publicUrl;
        galleryUrls.push(url);
      }
    }

    const { error: dbError } = await supabase.from("trilhas").insert({
      nome: validatedData.nome,
      slug: validatedData.slug,
      dificuldade: validatedData.dificuldade,
      distancia_km: validatedData.distancia_km,
      tempo_estimado_min: validatedData.tempo_estimado_min,
      desnivel_m: validatedData.desnivel_m,
      altitude_max: validatedData.altitude_max,
      localizacao: validatedData.localizacao,
      descricao: validatedData.descricao,
      descricao_curta: validatedData.descricao_curta,
      fonte: validatedData.fonte,
      geojson: JSON.parse(validatedData.geojson),
      imagem_url: mainPublicUrl,
      imagens: galleryUrls,
    });

    if (dbError) throw dbError;

    revalidatePath("/trilhas");
    revalidatePath("/trilhas-admin");

    return {
      success: true,
      message: "Trilha e fotos cadastradas com sucesso!",
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Critical Error:", error);
    return {
      success: false,
      message:
        error.message || "Ocorreu um erro inesperado ao salvar a trilha.",
    };
  }
}
