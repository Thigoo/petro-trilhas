/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { supabase } from "@/src/lib/supabase";
import { trailSchema } from "@/src/validations/trail";
import { revalidatePath } from "next/cache";
import { XMLParser } from "fast-xml-parser";
import { sendNovaTrilhaEmail } from "@/src/lib/email/sendNovaTrilhaEmail";

export async function registerTrail(formData: FormData) {
  const rawEntries = Object.fromEntries(formData.entries());
  const result = trailSchema.safeParse({
    ...rawEntries,
    imagem_url: formData.get("imagem_url"),
    imagens: formData.getAll("imagens"),
  });

  if (!result.success) {
    console.log("❌ Validação falhou:", result.error.issues);
    return { success: false, message: result.error.issues[0].message };
  }

  const data = result.data;

  try {
    let imagemUrl = "";
    const mainFile = formData.get("imagem_principal") as File | null;

    if (mainFile instanceof File) {
      const filePath = `trilhas/${data.slug}/capa-${Date.now()}-${mainFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("trails-photos")
        .upload(filePath, mainFile);

      if (uploadError) throw uploadError;

      imagemUrl = supabase.storage.from("trails-photos").getPublicUrl(filePath)
        .data.publicUrl;
    }

    // === UPLOAD GALERIA ===
    const novasImagens = formData.getAll("imagens_novas") as File[];
    const imagensUrls: string[] = [];

    for (const file of novasImagens) {
      if (!(file instanceof File)) continue;

      const filePath = `trilhas/${data.slug}/galeria-${Date.now()}-${file.name}`;
      const { error } = await supabase.storage
        .from("trails-photos")
        .upload(filePath, file);

      if (!error) {
        const publicUrl = supabase.storage
          .from("trails-photos")
          .getPublicUrl(filePath).data.publicUrl;
        imagensUrls.push(publicUrl);
      }
    }
    const { error } = await supabase.from("trilhas").insert({
      nome: data.nome,
      slug: data.slug,
      dificuldade: data.dificuldade,
      distancia_km: data.distancia_km,
      tempo_estimado_min: data.tempo_estimado_min,
      desnivel_m: data.desnivel_m,
      altitude_max: data.altitude_max,
      localizacao: data.localizacao,
      descricao_curta: data.descricao_curta,
      descricao: data.descricao,
      fonte: data.fonte,
      geojson:
        typeof data.geojson === "string"
          ? JSON.parse(data.geojson)
          : data.geojson,
      imagem_url: imagemUrl,
      imagens: imagensUrls,
    });

    if (error) throw error;

    revalidatePath("/trilhas");
    revalidatePath("/trilhas-admin");

    return { success: true, message: "Trilha cadastrada com sucesso!" };
  } catch (error: any) {
    console.error("Erro ao salvar trilha:", error);
    return { success: false, message: error.message };
  }
}

export async function updateTrail(id: string, formData: FormData) {
  const slug = formData.get("slug") as string;

  if (!id || !slug) {
    return { success: false, message: "ID e slug são obrigatórios" };
  }

  try {
    // === IMAGEM PRINCIPAL ===
    let mainPublicUrl = formData.get("imagem_url_existente") as string | null;

    const mainFile = formData.get("imagem_principal") as File | null;

    if (mainFile instanceof File && mainFile.size > 0) {
      const mainFilePath = `trilhas/${slug}/capa-${Date.now()}-${mainFile.name}`;

      const { error: uploadError } = await supabase.storage
        .from("trails-photos")
        .upload(mainFilePath, mainFile, { upsert: true });

      if (uploadError) throw uploadError;

      mainPublicUrl = supabase.storage
        .from("trails-photos")
        .getPublicUrl(mainFilePath).data.publicUrl;
    }

    // === GALERIA ===
    const novasImagens = formData.getAll("imagens_novas") as File[];
    const novasUrls: string[] = [];

    for (const file of novasImagens) {
      if (!(file instanceof File) || file.size === 0) continue;

      const filePath = `trilhas/${slug}/galeria-${Date.now()}-${file.name}`;

      const { error } = await supabase.storage
        .from("trails-photos")
        .upload(filePath, file);

      if (!error) {
        const publicUrl = supabase.storage
          .from("trails-photos")
          .getPublicUrl(filePath).data.publicUrl;
        novasUrls.push(publicUrl);
      }
    }

    // URLs das imagens que o usuário NÃO removeu
    const imagensExistentes = formData.getAll("imagens_existentes") as string[];

    const galeriaFinal = [...imagensExistentes, ...novasUrls];

    // === ATUALIZAR NO BANCO ===
    const { error: dbError } = await supabase
      .from("trilhas")
      .update({
        nome: formData.get("nome"),
        slug: slug,
        dificuldade: formData.get("dificuldade"),
        distancia_km: Number(formData.get("distancia_km")),
        tempo_estimado_min: Number(formData.get("tempo_estimado_min")),
        desnivel_m: Number(formData.get("desnivel_m")),
        altitude_max: Number(formData.get("altitude_max")),
        localizacao: formData.get("localizacao"),
        descricao_curta: formData.get("descricao_curta"),
        descricao: formData.get("descricao"),
        fonte: formData.get("fonte"),
        geojson: formData.get("geojson")
          ? JSON.parse(formData.get("geojson") as string)
          : null,
        imagem_url: mainPublicUrl,
        imagens: galeriaFinal,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (dbError) throw dbError;

    revalidatePath("/trilhas");
    revalidatePath(`/trilhas/${slug}`);
    revalidatePath("/trilhas-admin");

    return { success: true, message: "Trilha atualizada com sucesso!" };
  } catch (error: any) {
    console.error("💥 ERRO ao atualizar trilha:", error);
    return {
      success: false,
      message: error.message || "Erro inesperado ao atualizar trilha",
    };
  }
}

export async function toggleTrailPublishStatus(
  id: string,
  currentStatus: boolean,
) {
  try {
    const novoStatus = !currentStatus;

    const { data: trail, error } = await supabase
      .from("trilhas")
      .update({ publicada: novoStatus })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // Só notifica quando a trilha está SENDO publicada agora (false -> true),
    // nunca ao despublicar.
    if (novoStatus === true && process.env.SEND_EMAIL === "true") {
      sendNovaTrilhaEmail(trail).catch((err) =>
        console.error("[email] erro inesperado no envio de notificação:", err),
      );
    }

    revalidatePath("/trilhas");
    revalidatePath("/trilhas-admin");
  } catch (error: any) {
    console.error("Toggle Error:", error);
  }
}

export async function deleteTrail(id: string, slug: string) {
  const folderPath = `trilhas/${slug}`;

  try {
    const { data: files, error: listError } = await supabase.storage
      .from("trails-photos")
      .list(folderPath);

    if (listError) {
      console.error("Erro ao listar arquivos:", listError);
    }

    if (files && files.length > 0) {
      const filesToDelete = files.map((file) => `${folderPath}/${file.name}`);
      const { error: storageError } = await supabase.storage
        .from("trails-photos")
        .remove(filesToDelete);

      if (storageError) {
        console.error("Erro ao deletar arquivos do storage:", storageError);
      }
    }

    const { error: dbError } = await supabase
      .from("trilhas")
      .delete()
      .eq("id", id);

    if (dbError) {
      throw new Error("Erro ao excluir a trilha do banco de dados.");
    }
  } catch (error) {
    console.error("Delete error:", error);
  }

  revalidatePath("/trilhas-admin");
  revalidatePath("/trilhas");
}

export async function processGPX(formData: FormData) {
  const file = formData.get("gpx") as File;

  const slug = formData.get("slug") as string;

  if (!file) {
    return { success: false, message: "Nenhum arquivo GPX enviado" };
  }

  try {
    const gpxText = await file.text();

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
    });

    const gpxData = parser.parse(gpxText);

    // Extrai a rota principal (trkseg)
    const track = gpxData.gpx.trk;
    const segments = Array.isArray(track.trkseg)
      ? track.trkseg
      : [track.trkseg];

    const coordinates: [number, number][] = [];

    segments.forEach((seg: any) => {
      const points = Array.isArray(seg.trkpt) ? seg.trkpt : [seg.trkpt];
      points.forEach((pt: any) => {
        if (pt && pt["@_lat"] && pt["@_lon"]) {
          coordinates.push([parseFloat(pt["@_lon"]), parseFloat(pt["@_lat"])]);
        }
      });
    });

    // Extrai Waypoints (POIs)
    const waypoints = gpxData.gpx.wpt
      ? Array.isArray(gpxData.gpx.wpt)
        ? gpxData.gpx.wpt
        : [gpxData.gpx.wpt]
      : [];

    const features = [
      {
        type: "Feature",
        properties: {
          name: file.name.split(".")[0] || slug,
        },
        geometry: {
          type: "LineString",
          coordinates: coordinates,
        },
      },
      ...waypoints.map((wp: any) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [parseFloat(wp["@_lon"]), parseFloat(wp["@_lat"])],
        },
        properties: {
          name: wp.name || "Ponto de interesse",
          description: wp.desc || "",
          cmt: wp.cmt || "",
        },
      })),
    ];

    const featureCollection = {
      type: "FeatureCollection",
      features: features,
    };

    return {
      success: true,
      data: {
        geojson: featureCollection,
        coordinatesCount: coordinates.length,
        waypointsCount: waypoints.length,
      },
    };
  } catch (error: any) {
    console.error("Erro ao processar GPX:", error);
    return {
      success: false,
      message: "Erro ao processar arquivo GPX: " + error.message,
    };
  }
}
