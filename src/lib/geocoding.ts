export interface Place {
  name: string;
  region: string; // "Alto Paraná, Paraguai"
  lat: number;
  lon: number;
}

interface GeocodingResponse {
  results?: {
    name: string;
    latitude: number;
    longitude: number;
    admin1?: string;
    country?: string;
  }[];
}

// City search with the Open-Meteo geocoding API (free, no API key)
export async function searchPlaces(query: string): Promise<Place[]> {
  const params = new URLSearchParams({ name: query, count: "6", language: "pt" });
  const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params}`);
  if (!res.ok) throw new Error(`Geocoding error: ${res.status}`);
  const data: GeocodingResponse = await res.json();

  return (data.results ?? []).map((r) => ({
    name: r.name,
    region: [r.admin1, r.country].filter(Boolean).join(", "),
    lat: r.latitude,
    lon: r.longitude,
  }));
}
