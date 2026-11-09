// Web version of ./photos.ts: there is no MediaStore in the browser, so the
// slideshow reads a JSON array of image URLs. By default that is
// /photos/index.json, generated from public/photos by `npm run photos:index`.
const PHOTOS_URL = process.env.EXPO_PUBLIC_PHOTOS_URL || "/photos/index.json";

export interface AlbumOption {
  id: string;
  title: string;
  count: number;
}

export const supportsAlbums = false;

export async function requestPhotoPermission(): Promise<boolean> {
  return false;
}

export async function listAlbums(): Promise<AlbumOption[]> {
  return [];
}

export async function getSlideshowPhotos(): Promise<string[]> {
  const res = await fetch(PHOTOS_URL);
  if (!res.ok) return [];
  const data: unknown = await res.json();
  return Array.isArray(data) ? data.filter((u) => typeof u === "string") : [];
}
