import { MetadataRoute } from "next";
import { supabase } from "../lib/supabase";
import { BASE_URL } from "../constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: trilhas } = await supabase
    .from("trilhas")
    .select("slug, updated_at")
    .eq("publicada", true);

  const { data: eventos } = await supabase
    .from("eventos")
    .select("id, updated_at")
    .eq("status", "ativo");

  const trilhaUrls: MetadataRoute.Sitemap = (trilhas ?? []).map((t) => ({
    url: `${BASE_URL}/trilhas/${t.slug}`,
    lastModified: t.updated_at ? new Date(t.updated_at) : new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const eventoUrls: MetadataRoute.Sitemap = (eventos ?? []).map((e) => ({
    url: `${BASE_URL}/eventos/${e.id}`,
    lastModified: e.updated_at ? new Date(e.updated_at) : new Date(),
    changeFrequency: "daily", // eventos mudam mais (vagas, confirmações)
    priority: 0.7,
  }));

  const staticUrls: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "monthly", priority: 1.0 },
    { url: `${BASE_URL}/trilhas`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/eventos`, changeFrequency: "daily", priority: 0.9 },
  ];

  return [...staticUrls, ...trilhaUrls, ...eventoUrls];
}
