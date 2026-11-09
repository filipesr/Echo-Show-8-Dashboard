import { ActivityAction, startActivityAsync } from "expo-intent-launcher";
import { router } from "expo-router";
import { useEffect, useState, type ReactNode } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSettings } from "@/hooks/useSettings";
import { useSystemStatus } from "@/hooks/useSystemStatus";
import { searchPlaces, type Place } from "@/lib/geocoding";
import { listAlbums, requestPhotoPermission, supportsAlbums, type AlbumOption } from "@/lib/photos";
import { MAX_EXTRA_CITIES } from "@/lib/settings";
import { colors, fonts } from "@/lib/theme";

const STEP = 0.1;
const isAndroid = Platform.OS === "android";

const percent = (value: number | "auto" | null) =>
  value === null ? "--" : value === "auto" ? "Auto" : `${Math.round(value * 100)}%`;

// Unknown or automatic values start the stepper from the middle
const toNumber = (value: number | "auto" | null) => (typeof value === "number" ? value : 0.5);

export default function SettingsScreen() {
  const { settings, updateSettings } = useSettings();
  const system = useSystemStatus();

  const [query, setQuery] = useState("");
  const [places, setPlaces] = useState<Place[] | null>(null);
  const [agendaUrl, setAgendaUrl] = useState(settings.agendaUrl);
  const [albums, setAlbums] = useState<AlbumOption[] | null>(null);
  const [photosDenied, setPhotosDenied] = useState(false);

  useEffect(() => {
    if (!supportsAlbums) return;
    requestPhotoPermission()
      .then((granted) => (granted ? listAlbums() : Promise.reject(new Error("denied"))))
      .then(setAlbums)
      .catch(() => setPhotosDenied(true));
  }, []);

  async function search() {
    if (!query.trim()) return;
    setPlaces(await searchPlaces(query.trim()).catch(() => []));
  }

  const isSamePlace = (a: { lat: number; lon: number }, b: { lat: number; lon: number }) =>
    a.lat === b.lat && a.lon === b.lon;
  const canAddExtra = settings.extraCities.length < MAX_EXTRA_CITIES;

  function clearSearch() {
    setPlaces(null);
    setQuery("");
  }

  function setMainCity(place: Place) {
    updateSettings({
      city: place.name,
      lat: place.lat,
      lon: place.lon,
      // A city can't be both main and extra
      extraCities: settings.extraCities.filter((c) => !isSamePlace(c, place)),
    });
    clearSearch();
  }

  function addExtraCity(place: Place) {
    const known = isSamePlace(settings, place) || settings.extraCities.some((c) => isSamePlace(c, place));
    if (!known && canAddExtra) {
      updateSettings({
        extraCities: [...settings.extraCities, { name: place.name, lat: place.lat, lon: place.lon }],
      });
    }
    clearSearch();
  }

  function removeExtraCity(index: number) {
    updateSettings({ extraCities: settings.extraCities.filter((_, i) => i !== index) });
  }

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.column} contentContainerStyle={styles.columnContent}>
        <Section title="Cidade">
          <Text style={styles.value}>
            {settings.city} <Text style={styles.muted}>({settings.lat.toFixed(2)}, {settings.lon.toFixed(2)})</Text>
          </Text>
          <View style={styles.inputRow}>
            <TextInput
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={search}
              placeholder="Buscar cidade…"
              placeholderTextColor={colors.textFaint}
              returnKeyType="search"
              style={styles.input}
            />
            <Button label="Buscar" onPress={search} />
          </View>
          {places?.length === 0 && <Text style={styles.muted}>Nenhuma cidade encontrada.</Text>}
          {places?.map((place) => (
            <View key={`${place.lat},${place.lon}`} style={styles.row}>
              <View style={styles.rowText}>
                <Text style={styles.rowTitle}>{place.name}</Text>
                <Text style={styles.muted}>{place.region}</Text>
              </View>
              <Button label="Principal" onPress={() => setMainCity(place)} />
              {canAddExtra && <Button label="Adicionar" onPress={() => addExtraCity(place)} />}
            </View>
          ))}
        </Section>

        <Section title={`Outras cidades (até ${MAX_EXTRA_CITIES})`}>
          {settings.extraCities.length === 0 && (
            <Text style={styles.muted}>Busque uma cidade e toque em “Adicionar” para vê-la como badge no cabeçalho.</Text>
          )}
          {settings.extraCities.map((city, i) => (
            <View key={`${city.lat},${city.lon}`} style={styles.row}>
              <Text style={[styles.rowTitle, styles.rowText]}>{city.name}</Text>
              <Button label="Remover" onPress={() => removeExtraCity(i)} />
            </View>
          ))}
        </Section>

        <Section title="Agenda (URL do JSON)">
          <View style={styles.inputRow}>
            <TextInput
              value={agendaUrl}
              onChangeText={setAgendaUrl}
              placeholder="https://gist.githubusercontent.com/…/agenda.json"
              placeholderTextColor={colors.textFaint}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              style={styles.input}
            />
            <Button label="Salvar" onPress={() => updateSettings({ agendaUrl: agendaUrl.trim() })} />
          </View>
          <Text style={styles.muted}>Formato: docs/agenda.example.json. Vazio desativa a agenda.</Text>
        </Section>

        {supportsAlbums && (
          <Section title="Pasta de fotos">
            {photosDenied && <Text style={styles.muted}>Permissão de fotos negada.</Text>}
            {!photosDenied && !albums && <Text style={styles.muted}>Carregando pastas…</Text>}
            {albums?.length === 0 && <Text style={styles.muted}>Nenhuma pasta com fotos no aparelho.</Text>}
            {albums?.map((album) => {
              const selected = album.id === settings.photoAlbum?.id;
              return (
                <Pressable
                  key={album.id}
                  style={[styles.row, selected && styles.rowSelected]}
                  onPress={() => updateSettings({ photoAlbum: { id: album.id, title: album.title } })}
                >
                  <Text style={styles.rowTitle}>{album.title}</Text>
                  <Text style={styles.muted}>{album.count} fotos</Text>
                </Pressable>
              );
            })}
          </Section>
        )}
      </ScrollView>

      <ScrollView style={styles.column} contentContainerStyle={styles.columnContent}>
        {isAndroid && (
          <Section title="Aparelho">
            <Stepper
              label="Brilho"
              value={percent(system.brightness)}
              onChange={(delta) => system.setBrightness(toNumber(system.brightness) + delta)}
            />
            <Stepper
              label="Volume"
              value={percent(system.volume)}
              onChange={(delta) => system.setVolume(toNumber(system.volume) + delta)}
            />
            <Text style={styles.muted}>
              Wi-Fi: {system.wifi.connected ? `conectado, sinal ${system.wifi.strength ?? "--"}%` : "desconectado"}
            </Text>
          </Section>
        )}

        {isAndroid && (
          <Section title="Sistema">
            <Button label="Configurações do Android" onPress={() => startActivityAsync(ActivityAction.SETTINGS)} />
            <Button label="Wi-Fi" onPress={() => startActivityAsync(ActivityAction.WIFI_SETTINGS)} />
            <Button label="Trocar launcher padrão" onPress={() => startActivityAsync(ActivityAction.HOME_SETTINGS)} />
          </Section>
        )}

        <Button label="Voltar ao dashboard" onPress={() => router.back()} primary />
      </ScrollView>
    </View>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.heading}>{title}</Text>
      {children}
    </View>
  );
}

function Stepper({ label, value, onChange }: { label: string; value: string; onChange: (delta: number) => void }) {
  return (
    <View style={styles.stepper}>
      <Text style={styles.rowTitle}>{label}</Text>
      <View style={styles.stepperControls}>
        <Button label="−" onPress={() => onChange(-STEP)} />
        <Text style={styles.stepperValue}>{value}</Text>
        <Button label="+" onPress={() => onChange(STEP)} />
      </View>
    </View>
  );
}

function Button({ label, onPress, primary }: { label: string; onPress: () => void; primary?: boolean }) {
  return (
    <Pressable style={[styles.button, primary && styles.buttonPrimary]} onPress={onPress}>
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, flexDirection: "row", gap: 20, padding: 20, backgroundColor: colors.canvas },
  column: { flex: 1 },
  columnContent: { gap: 18 },
  section: { gap: 8 },
  heading: { color: colors.cyan, fontFamily: fonts.bodyBold, fontSize: 12, letterSpacing: 1, textTransform: "uppercase" },
  value: { color: colors.text, fontFamily: fonts.bodySemiBold, fontSize: 15 },
  muted: { color: colors.textFaint, fontFamily: fonts.body, fontSize: 12 },
  inputRow: { flexDirection: "row", gap: 8 },
  input: {
    flex: 1,
    minHeight: 44,
    paddingHorizontal: 12,
    borderRadius: 10,
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 14,
    backgroundColor: colors.tile,
    borderWidth: 1,
    borderColor: colors.panelBorder,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.tileBorder,
    backgroundColor: colors.tile,
  },
  rowText: { flex: 1 },
  rowSelected: { borderColor: colors.cyan, backgroundColor: colors.cyanBg },
  rowTitle: { color: colors.text, fontFamily: fonts.bodyMedium, fontSize: 14 },
  stepper: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  stepperControls: { flexDirection: "row", alignItems: "center", gap: 10 },
  stepperValue: { width: 48, textAlign: "center", color: colors.text, fontFamily: fonts.display, fontSize: 14 },
  button: {
    minHeight: 44,
    minWidth: 44,
    justifyContent: "center",
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
  },
  buttonPrimary: { backgroundColor: "#06b6d4" },
  buttonText: { color: colors.text, fontFamily: fonts.bodySemiBold, fontSize: 14, textAlign: "center" },
});
