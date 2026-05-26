// Extrai as coordenadas da LineString
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getCoordinates = (geojson: any): [number, number][] => {
  if (!geojson) return [];

  if (geojson.type === "FeatureCollection" && geojson.features) {
    const lineFeature = geojson.features.find(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (f: any) => f.geometry?.type === "LineString",
    );
    return (
      lineFeature?.geometry?.coordinates?.map(
        ([lng, lat]: [number, number]) => [lat, lng],
      ) || []
    );
  }

  // Formato antigo
  if (Array.isArray(geojson.coordinates)) {
    return geojson.coordinates.map(([lng, lat]: [number, number]) => [
      lat,
      lng,
    ]);
  }

  return [];
};
