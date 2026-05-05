import { ITrailFormState } from "@/src/components/admin/TrailForm";
import { ITrail } from "@/src/types";

export function mapTrailToFormState(trail: ITrail): Partial<ITrailFormState> {
  return {
    nome: trail.nome,
    slug: trail.slug,
    dificuldade: trail.dificuldade,
    localizacao: trail.localizacao ?? "",
    descricao_curta: trail.descricao_curta ?? "",
    descricao: trail.descricao ?? "",
    fonte: trail.fonte ?? "",
    distancia_km: trail.distancia_km,
    tempo_estimado_min: trail.tempo_estimado_min,
    desnivel_m: trail.desnivel_m ?? "",
    altitude_max: trail.altitude_max ?? "",

    // O pulo do gato: Transforma o objeto GeoJSON em string para o Textarea
    geojson: trail.geojson ? JSON.stringify(trail.geojson, null, 2) : "",

    // Imagens: No form, o arquivo File começa nulo na edição,
    // mas o preview recebe a URL que já existe no banco.
    imagem_url: null,
    imagem_preview: trail.imagem_url ?? "",

    imagens: [], // Files novos começam vazios
    galeria_previews: trail.imagens ?? [], // URLs existentes vão para o preview
  };
}
