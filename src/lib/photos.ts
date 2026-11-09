import {
  Album,
  AssetField,
  MediaType,
  Query,
  requestPermissionsAsync,
} from "expo-media-library";

// Android version; the web one is ./photos.web.ts (same exports)
export const supportsAlbums = true;

export interface AlbumOption {
  id: string;
  title: string;
  count: number;
}

// Asks for read access to photos (READ_EXTERNAL_STORAGE on Android 11)
export async function requestPhotoPermission(): Promise<boolean> {
  const { granted } = await requestPermissionsAsync(false, ["photo"]);
  return granted;
}

// MediaStore "albums" are the device folders that contain media
// (e.g. DCIM/Camera, Pictures/Family), so picking an album = picking a folder
export async function listAlbums(): Promise<AlbumOption[]> {
  // getAlbumsMetadata returns one row per media file on Android (expo-media-library
  // doesn't deduplicate), so keep one entry per album id before counting
  const albums = new Map(
    (await Album.getAlbumsMetadata()).map((album) => [album.id, album])
  );
  const options = await Promise.all(
    [...albums.values()].map(async ({ id, title }) => ({
      id,
      title,
      count: await new Album(id).getAssetCount(),
    }))
  );
  return options
    .filter((album) => album.count > 0)
    .sort((a, b) => a.title.localeCompare(b.title));
}

// Returns the image URIs of an album. On Android the asset id already is
// its content:// URI, which expo-image loads directly (no extra lookup).
export async function getSlideshowPhotos(albumId: string | null): Promise<string[]> {
  if (!albumId) return [];
  const assets = await new Query()
    .album(new Album(albumId))
    .eq(AssetField.MEDIA_TYPE, MediaType.IMAGE)
    .orderBy({ key: AssetField.CREATION_TIME, ascending: false })
    .exe();
  return assets.map((asset) => asset.id);
}
