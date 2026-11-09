# Prompt: Echo Dashboard — Expo Universal (Launcher + Web)

Crie um app universal com Expo SDK 52+, TypeScript, NativeWind (TailwindCSS) e react-native-web. O app funciona como **launcher Android** no Echo Show 8 com LineageOS e como **web app** no browser via Vercel.

## Conceito

O app tem **três targets** a partir do mesmo código:

### 1. Android APK (Launcher)
- Compilado como launcher nativo (category `HOME` no AndroidManifest)
- Roda em **fullscreen landscape** permanente, sem status bar nem navigation bar
- Ao ligar o dispositivo, o app abre automaticamente como home screen
- Acessa o **MediaStore** do Android para ler fotos da galeria para o slideshow
- Funciona **offline** — clima é cacheado com AsyncStorage
- Tela-alvo: 1280x800 (Echo Show 8)

### 2. Web (Vercel)
- Exportado com `npx expo export:web`
- Mostra o **frame do Echo Show 8** (imagem PNG com tela transparente) com a dashboard rodando dentro
- Abaixo, instruções de setup e link para download do APK
- Deploy estático na Vercel

### 3. Web fullscreen (PWA fallback)
- Se acessado no browser do próprio Echo Show, detecta o user-agent/tela e renderiza direto em fullscreen sem o frame

## Dashboard (conteúdo da tela)

Layout landscape 1280x800, fundo escuro (#0a0a0a), fonte clara:

### Metade superior (~50%)
- **Esquerda**: relógio digital grande, formato 24h (HH:MM), segundos menores ao lado. Abaixo, dia da semana e data completa em português (ex: "Segunda-feira, 9 de novembro")
- **Direita**: clima atual — ícone do tempo (SVG/componente), temperatura atual grande (ex: 31°), nome da cidade. Abaixo, umidade e sensação térmica

### Metade inferior — duas linhas:

#### Linha 1: Previsão horária (próximas 8 horas)
- 8 colunas iguais
- Cada: hora (14h), ícone, temperatura
- FlatList horizontal no native, flex-row no web

#### Linha 2: Previsão diária (próximos 4 dias)
- 4 colunas
- Cada: dia da semana abreviado, ícone, máxima / mínima

## Slideshow (screensaver)

### No Android (APK launcher)
- Após 5 minutos de inatividade, entra no slideshow
- Lê fotos do **MediaStore** do dispositivo usando `expo-media-library`
- Busca fotos de um álbum específico chamado "Dashboard" (se existir) ou todas as fotos
- Exibe em fullscreen com transição fade (3s transição, 10s por foto)
- Relógio menor semi-transparente no canto inferior esquerdo
- Toque na tela volta ao dashboard

### Na web
- Carrega fotos de uma URL configurável (`EXPO_PUBLIC_PHOTOS_URL`, JSON com array de URLs de imagens)
- Ou de `/public/photos/` como fallback estático
- Mesma lógica de transição e idle timer

## API de clima

- **Open-Meteo API** (gratuita, sem API key): `https://api.open-meteo.com/v1/forecast`
- Localização via env: `EXPO_PUBLIC_LAT` (default -25.41) e `EXPO_PUBLIC_LON` (default -54.63)
- Dados: current_weather, hourly (temperature_2m, weathercode, 24h), daily (temperature_2m_max/min, weathercode, 7d)
- Atualizar a cada 15 minutos
- Cache com AsyncStorage (native) / localStorage (web) — último resultado válido usado offline

## Launcher Android

### app.json (expo config)
```json
{
  "expo": {
    "name": "Echo Dashboard",
    "slug": "echo-dashboard",
    "orientation": "landscape",
    "android": {
      "package": "com.echodashboard.launcher",
      "intentFilters": [
        {
          "action": "MAIN",
          "category": ["HOME", "DEFAULT"]
        }
      ]
    },
    "plugins": [
      "expo-media-library"
    ]
  }
}
```

### AndroidManifest extras (via expo plugin ou app.json)
```xml
<activity
  android:screenOrientation="landscape"
  android:launchMode="singleTask"
  android:stayOnTop="true"
  android:excludeFromRecents="true"
  android:immersive="true">
  <intent-filter>
    <action android:name="android.intent.action.MAIN" />
    <category android:name="android.intent.category.HOME" />
    <category android:name="android.intent.category.DEFAULT" />
  </intent-filter>
</activity>
```

### Fullscreen imersivo (sem status/nav bar)
```typescript
// Usar expo-navigation-bar e expo-status-bar
import * as NavigationBar from 'expo-navigation-bar';
import * as StatusBar from 'expo-status-bar';

// No App.tsx ao montar:
NavigationBar.setVisibilityAsync('hidden');
NavigationBar.setBehaviorAsync('overlay-swipe');
StatusBar.setStatusBarHidden(true, 'none');

// Manter tela ligada:
import { activateKeepAwakeAsync } from 'expo-keep-awake';
activateKeepAwakeAsync();
```

## Estrutura do projeto

```
app/                          # Expo Router (file-based routing)
  _layout.tsx                 # root layout, fullscreen setup, keep awake
  index.tsx                   # detecta platform e renderiza
src/
  components/
    DeviceFrame.tsx           # web only: frame do Echo Show com dashboard dentro
    DeviceFrame.web.tsx       # implementação web com imagem PNG
    Dashboard.tsx             # dashboard completa (shared)
    Clock.tsx                 # relógio 24h + data
    WeatherCurrent.tsx        # clima atual
    HourlyForecast.tsx        # previsão horária 8h
    DailyForecast.tsx         # previsão diária 4 dias
    Slideshow.tsx             # screensaver
    Slideshow.android.tsx     # versão Android com MediaStore
    Slideshow.web.tsx         # versão web com URLs
    WeatherIcon.tsx           # mapeamento weathercode → ícone
    SetupInfo.tsx             # web only: instruções de setup + download APK
  hooks/
    useWeather.ts             # fetch + cache Open-Meteo
    useClock.ts               # relógio a cada segundo
    usePlatform.ts            # detecta Android native vs web vs web-on-device
    useIdleTimer.ts           # inatividade → slideshow
    usePhotos.ts              # abstrai MediaStore (native) vs URLs (web)
    usePhotos.android.ts      # expo-media-library
    usePhotos.web.ts          # fetch de URLs
  lib/
    weather.ts                # tipos e fetch Open-Meteo
    storage.ts                # AsyncStorage (native) / localStorage (web)
  types/
    weather.d.ts
assets/
  echo-show-frame.png         # frame do dispositivo para modo web
  fonts/
    Inter.ttf
public/                        # web only
  photos/                      # fotos estáticas fallback
```

## Plataform-specific files

Usar a convenção do React Native de `.android.tsx` / `.web.tsx` para:
- `Slideshow` — MediaStore no Android, URLs na web
- `usePhotos` — expo-media-library no Android, fetch na web
- `DeviceFrame` — só existe na web (no Android, renderiza Dashboard direto)

## Dependências principais

```json
{
  "expo": "~52.0.0",
  "expo-router": "~4.0.0",
  "react-native-web": "~0.19.0",
  "nativewind": "^4.0.0",
  "tailwindcss": "^3.4.0",
  "expo-media-library": "~17.0.0",
  "expo-navigation-bar": "~4.0.0",
  "expo-status-bar": "~2.0.0",
  "expo-keep-awake": "~14.0.0",
  "@react-native-async-storage/async-storage": "2.1.0",
  "expo-screen-orientation": "~8.0.0"
}
```

## Requisitos técnicos

- Comentários descritivos em lógica complexa (mapeamento weathercode, lógica de MediaStore, idle timer, detecção de plataforma)
- Layout otimizado para 1280x800 mas responsivo em outros tamanhos
- Fonte Inter carregada via expo-font
- Ícones de clima como componentes React Native (Svg via react-native-svg ou condicional web/native)
- Animações: Animated API do React Native para transições do slideshow
- O app deve compilar com `npx expo export:web` sem erros
- O APK deve compilar com `eas build --platform android --profile preview`

## Build e deploy

### Web (Vercel)
```bash
npx expo export:web
# output em /dist — deploy automático na Vercel
```

### Android APK
```bash
eas build --platform android --profile preview
# Gera APK para sideload via adb install
```

### Dev
```bash
npx expo start
# Press w for web, press a for Android
```

## EAS config (eas.json)
```json
{
  "build": {
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk",
        "gradleCommand": ":app:assembleRelease"
      }
    },
    "production": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```
