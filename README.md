## Echo Dashboard

A progressive web app designed as a standalone dashboard for jailbroken Amazon Echo Show 8 devices running LineageOS + Fully Kiosk Browser — or any landscape tablet.

### Features

- **24h clock** with live seconds, weekday and full date
- **Current weather** with temperature, humidity and feels-like, powered by [Open-Meteo](https://open-meteo.com/) (free, no API key required)
- **Hourly forecast** — next 8 hours at a glance
- **Daily forecast** — next 4 days with high/low temperatures
- **Photo slideshow** screensaver after 5 minutes of inactivity, with a subtle clock overlay
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
| `NEXT_PUBLIC_PHOTOS_URL` | — | Optional JSON endpoint returning an array of photo URLs for the slideshow |

### Device setup

1. Jailbreak your Echo Show 8 (2nd gen) with saiyaku-athena
2. Flash LineageOS 18.1 for athena
3. Install Fully Kiosk Browser
4. Point it to your Vercel deployment URL
5. Enable kiosk mode, landscape lock, and fullscreen

### License

MIT
