import AsyncStorage from "@react-native-async-storage/async-storage";

export interface City {
  name: string;
  lat: number;
  lon: number;
}

// Extra cities shown as badges next to the main one in the top bar
export const MAX_EXTRA_CITIES = 3;

// User settings stored on the device. EXPO_PUBLIC_* env vars only provide
// the defaults: an installed APK can't be rebuilt to change them.
export interface Settings {
  city: string;
  lat: number;
  lon: number;
  extraCities: City[];
  agendaUrl: string; // JSON endpoint, empty = no agenda
  photoAlbum: { id: string; title: string } | null; // Android only
}

const STORAGE_KEY = "echo-dashboard:settings:v1";

export const DEFAULT_SETTINGS: Settings = {
  city: process.env.EXPO_PUBLIC_CITY || "Hernandarias",
  lat: Number(process.env.EXPO_PUBLIC_LAT || -25.41),
  lon: Number(process.env.EXPO_PUBLIC_LON || -54.63),
  extraCities: [],
  agendaUrl: process.env.EXPO_PUBLIC_AGENDA_URL || "",
  photoAlbum: null,
};

export async function loadSettings(): Promise<Settings> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
}

export async function saveSettings(settings: Settings): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}
