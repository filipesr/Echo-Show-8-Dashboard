import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Clock from "@/components/Clock";
import { useSettings } from "@/hooks/useSettings";
import { getSlideshowPhotos, supportsAlbums } from "@/lib/photos";
import { colors, fonts } from "@/lib/theme";

const PHOTO_DURATION_MS = 10 * 1000;
const FADE_MS = 3000;

// Fullscreen photo frame: photos from the folder chosen in the settings
// (Android) or from the photos URL (web), crossfading every 10s.
// Any touch goes back to the dashboard.
export default function Slideshow() {
  const { settings } = useSettings();
  const albumId = settings.photoAlbum?.id ?? null;
  const [photos, setPhotos] = useState<string[] | null>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    getSlideshowPhotos(albumId)
      .then(setPhotos)
      .catch((error) => {
        console.warn("Photos load failed", error);
        setPhotos([]);
      });
  }, [albumId]);

  useEffect(() => {
    if (!photos || photos.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % photos.length), PHOTO_DURATION_MS);
    return () => clearInterval(id);
  }, [photos]);

  return (
    <Pressable style={styles.screen} onPress={() => router.back()}>
      {photos && photos.length > 0 ? (
        // expo-image crossfades to the new source (transition) and decodes
        // a bitmap sized to the view instead of the full camera resolution
        <Image
          source={{ uri: photos[index] }}
          alt=""
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={FADE_MS}
        />
      ) : (
        <Text style={styles.empty}>
          {photos && (supportsAlbums ? "Nenhuma foto. Escolha uma pasta nas configurações." : "Nenhuma foto encontrada.")}
        </Text>
      )}
      <View style={styles.clock}>
        <Clock size="small" />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#000", alignItems: "center", justifyContent: "center" },
  empty: { color: colors.textFaint, fontFamily: fonts.body, fontSize: 16 },
  clock: { position: "absolute", right: 32, bottom: 24 },
});
