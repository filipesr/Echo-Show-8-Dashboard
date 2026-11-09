## Echo Dashboard

A progressive web app designed as a standalone dashboard for jailbroken Amazon Echo Show 8 devices running LineageOS + Fully Kiosk Browser — or any landscape tablet.

### Features

- **24h clock** with live seconds, weekday and full date
- **Current weather** with temperature, feels-like, today's min/max, wind, rain chance and humidity, powered by [Open-Meteo](https://open-meteo.com/) (free, no API key required)
- **Hourly forecast** — next 8 hours with rain chance
- **Daily forecast** — today + next 4 days with min/max temperature bars
- **Weekly agenda** with events, reminders and a "next event in X min" countdown, from a JSON file you host anywhere
- **Photo slideshow** screensaver after 5 minutes of inactivity (or on demand), with a subtle clock overlay
- **Offline support** via service worker — keeps working with cached weather data when the network drops
- **Two display modes:**
  - **Web:** interactive mockup of an Echo Show 8 with the live dashboard running inside the screen area
  - **Installed PWA:** fullscreen, landscape-locked, no browser chrome — feels native on the device

### Why

Amazon's Echo Show devices are capable hardware held back by ads, telemetry and a locked-down OS. Once jailbroken with [saiyaku-athena](https://xdaforums.com/t/unlock-root-twrp-unbrick-amazon-echo-show-8-2nd-gen-2021-athena.4804958/) and flashed with [LineageOS 18.1](https://github.com/amazon-oss/releases/releases/tag/lineage-18.1-athena-v0.1), they become Android tablets with good speakers and a decent screen — but no purpose-built dashboard. This project fills that gap with a zero-dependency, self-hosted dashboard that runs entirely in the browser.

### Tech stack

- Next.js 14+ (App Router)
- TypeScript
- TailwindCSS
- Open-Meteo API (client-side, no backend needed)
- Deployed on Vercel

### Quick start

```bash
git clone https://github.com/YOUR_USER/echo-dashboard.git
cd echo-dashboard
npm install
cp .env.example .env.local  # set your coordinates
npm run dev
```

### Environment variables

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_LAT` | `-25.41` | Latitude for weather data |
| `NEXT_PUBLIC_LON` | `-54.63` | Longitude for weather data |
| `NEXT_PUBLIC_CITY` | `Hernandarias` | City name shown next to the current weather |
| `NEXT_PUBLIC_PHOTOS_URL` | — | Optional JSON endpoint returning an array of photo URLs for the slideshow |
| `NEXT_PUBLIC_AGENDA_URL` | — | Optional JSON endpoint with agenda events and reminders (see below) |

### How it works

- **Mode detection** (`src/hooks/useStandalone.ts`): installed PWA (`display-mode: fullscreen|standalone`, iOS `navigator.standalone`) or `?kiosk` in the URL renders the dashboard fullscreen; otherwise it is shown inside the Echo Show mockup (`src/components/DeviceFrame.tsx`).
- **Fixed canvas** (`src/components/Dashboard.tsx`): the dashboard is laid out at 1280x800 (Echo Show 8 resolution) and scaled to fit its container, so it looks identical on the device and in the mockup.
- **Data polling** (`src/hooks/useCachedData.ts`): weather (every 15 min) and agenda (every 5 min) are fetched client-side; the last response is kept in `localStorage` for instant reloads and offline use.
- **Screensaver** (`src/hooks/useIdleTimer.ts`, `src/components/Slideshow.tsx`): after 5 minutes without interaction, or via the "Iniciar Photo-Slide" button, photos fade in (3s) every 10s; any touch returns to the dashboard.
- **Service worker** (`public/sw.js`, production only): network-first for the page, cache-first for build assets, fonts and images (including slideshow photos).

### Project structure

```
src/
  app/          layout (metadata, manifest, SW registration) and page
  components/   Dashboard, DeviceFrame, StatusBar, Card, Clock, Weather*, *Forecast, Agenda, Slideshow, InstallButton, WeatherIcon
  hooks/        useClock, useCachedData, useWeather, useAgenda, useStandalone, useIdleTimer
  lib/          Open-Meteo client + weather code mapping, agenda fetch, local photos listing
  types/        weather and agenda types
docs/
  agenda.example.json   agenda file format
  screens/              visual design reference (mockup, DESIGN.md)
public/
  manifest.json, sw.js, icons
  photos/       slideshow images
```

### Slideshow photos

Drop images (`.jpg`, `.png`, `.webp`, `.avif`, `.gif`) into `public/photos/` and redeploy — they are listed at build time. Alternatively, set `NEXT_PUBLIC_PHOTOS_URL` to a JSON endpoint returning an array of image URLs; it is fetched in the browser and takes precedence over the local photos.

### Agenda

Set `NEXT_PUBLIC_AGENDA_URL` to a JSON file in the format of [`docs/agenda.example.json`](docs/agenda.example.json):

- `events`: `date` (`YYYY-MM-DD`), `time` (`HH:MM`), `title`, optional `subtitle`, `tag` (badge text) and `color` (`cyan`, `amber`, `emerald` or `indigo`)
- `reminders`: `text` and optional `done`

The file is fetched by the browser, so it must allow CORS — a [GitHub Gist](https://gist.github.com/) raw URL works. Edit the gist and the dashboard picks up changes within 5 minutes.

### Device setup

1. Jailbreak your Echo Show 8 (2nd gen) with saiyaku-athena
2. Flash LineageOS 18.1 for athena
3. Install Fully Kiosk Browser
4. Point it to your Vercel deployment URL with `?kiosk` appended (e.g. `https://your-app.vercel.app/?kiosk`) — this forces the fullscreen dashboard without the device mockup, even when the PWA is not installed
5. Enable kiosk mode, landscape lock, and fullscreen

### Design

The visual design follows the mockup in [`docs/screens/`](docs/screens/) (generated with Stitch): dark navy canvas, glass-like cards, cyan/amber accents, Space Grotesk for numbers and Plus Jakarta Sans for text.

### Roadmap

- **Home Assistant integration**: smart home toggles (lights, thermostat, TV) in a bottom dock, as in the mockup
- Device telemetry from the mockup (volume, brightness, SoC temperature, Wi-Fi) is not readable from a web page; it could come from Home Assistant or the Fully Kiosk JavaScript API

### License

MIT
