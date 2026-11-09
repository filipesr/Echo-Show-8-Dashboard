import { useCachedData } from "@/hooks/useCachedData";
import { fetchAgenda } from "@/lib/agenda";
import type { AgendaData } from "@/types/agenda";

const REFRESH_MS = 5 * 60 * 1000;

// Null when no agenda URL is configured
export function useAgenda(url: string): AgendaData | null {
  return useCachedData(url ? `echo-dashboard:agenda:v1:${url}` : null, () => fetchAgenda(url), REFRESH_MS);
}
