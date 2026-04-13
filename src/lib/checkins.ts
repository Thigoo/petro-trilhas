import { supabase } from "./supabase";

interface ICheckin {
  trilha_id: string;
  user_id: string;
  comentario?: string;
  nota?: string | null;
  foto_file: File;
}

export default async function postCheckin({
  trilha_id,
  user_id,
  comentario,
  nota,
  foto_file,
}: ICheckin) {
  try {
    const file_ext = foto_file.name.split(".").pop();
    const file_name = `${user_id}/${Date.now()}/${file_ext}`;

    const { error: upLoadError } = await supabase.storage
      .from("checkin-photos")
      .upload(file_name, foto_file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (upLoadError) throw upLoadError;

    const { data: urlData } = supabase.storage
      .from("checkin-photos")
      .getPublicUrl(file_name);

    const foto_url = urlData.publicUrl;

    const { error: checkinError } = await supabase.from("checkins").insert({
      user_id,
      trilha_id,
      foto_url,
      comentario,
      nota,
    });

    if (checkinError) throw checkinError;

    await supabase.rpc("increment_points", {
      user_uuid: user_id,
      points: 10,
    });

    return { success: true, message: "Checkin realizado com sucesso!" };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Erro no checkin:", error);
    return {
      success: false,
      message: error.message || "Erro ao realizar checkin",
    };
  }
}
