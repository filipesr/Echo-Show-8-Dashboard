"use client";

import { useCachedData } from "@/hooks/useCachedData";
import { AGENDA_URL, fetchAgenda } from "@/lib/agenda";
import type { AgendaData } from "@/types/agenda";

const STORAGE_KEY = "echo-dashboard:agenda:v1";
const REFRESH_MS = 5 * 60 * 1000;

// Null when NEXT_PUBLIC_AGENDA_URL is not configured (and nothing cached)
export function useAgenda(): AgendaData | null {
  return useCachedData(STORAGE_KEY, fetchAgenda, REFRESH_MS, Boolean(AGENDA_URL));
}
