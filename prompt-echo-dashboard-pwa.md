# Prompt: Echo Show Dashboard PWA

Crie um app PWA com Next.js 14+ (App Router), TypeScript, TailwindCSS e deploy na Vercel.

## Conceito

O app tem **dois modos de exibição**:

### 1. Modo Web (desktop/mobile browser)
- Mostra uma **foto realista do Echo Show 8** centralizada na página
- A tela do dispositivo na foto é substituída pela **dashboard real do app** rodando dentro do espaço da tela (como um mockup interativo)
- O frame do Echo Show 8 é uma imagem PNG com a área da tela transparente (ou usa CSS clip-path para posicionar a dashboard sobre a foto)
- Dimensões da tela real do Echo Show 8: **1280x800 pixels, proporção 8:5**
- Abaixo da foto, um botão "Instalar no dispositivo" que aciona o prompt de instalação do PWA
- Fundo escuro para destacar o dispositivo

### 2. Modo PWA instalado (no Echo Show 8 com LineageOS + Fully Kiosk Browser)
- Roda em **fullscreen**, sem barra de navegação
- **Sempre na horizontal (landscape)**
- Ocupa 100% da tela: 1280x800
- A dashboard renderiza diretamente, sem o frame do Echo Show

## Dashboard (conteúdo da tela)

Layout em landscape 1280x800, fundo escuro (#0a0a0a), fonte clara:

### Metade superior (altura ~50%)
- **Esquerda**: relógio digital grande, formato 24h (HH:MM), com segundos menores ao lado. Abaixo, dia da semana e data completa em português (ex: "Segunda-feira, 9 de novembro")
- **Direita**: clima atual — ícone do tempo (usar ícones SVG inline), temperatura atual grande (ex: 31°), cidade. Abaixo, umidade e sensação térmica

### Metade inferior — dividida em duas linhas:

#### Linha 1: Previsão horária (próximas 8 horas)
- 8 colunas iguais
- Cada coluna: hora (ex: 14h), ícone do tempo, temperatura
- Scroll horizontal se não couber

#### Linha 2: Previsão diária (próximos 4 dias)
- 4 colunas iguais, proporcionalmente maiores que as horárias
- Cada coluna: nome do dia (Seg, Ter...), ícone do tempo, temperatura máxima / mínima

### Screensaver (slideshow de fotos)
- Após 5 minutos sem interação, entra no modo slideshow
- Fotos em fullscreen com transição fade (3s de transição, 10s cada foto)
- Relógio menor no canto inferior esquerdo, semi-transparente, sobre a foto
- Toque na tela volta ao dashboard
- As fotos são carregadas de uma pasta `/public/photos/` no projeto (estáticas) ou de uma URL configurável via env var `NEXT_PUBLIC_PHOTOS_URL` (JSON com array de URLs)

## API de clima

- Usar **Open-Meteo API** (gratuita, sem API key): `https://api.open-meteo.com/v1/forecast`
- Localização via env vars: `NEXT_PUBLIC_LAT` e `NEXT_PUBLIC_LON`
- Padrão: Hernandarias, Paraguay (lat: -25.41, lon: -54.63)
- Buscar: temperatura atual, umidade, sensação térmica, ícone (weathercode), previsão horária (24h) e diária (7 dias)
- Atualizar a cada 15 minutos
- Funcionar **client-side** (fetch no browser, sem API route) para não precisar de serverless

## PWA

### manifest.json
```json
{
  "name": "Echo Dashboard",
  "short_name": "Dashboard",
  "display": "fullscreen",
  "orientation": "landscape",
  "background_color": "#0a0a0a",
  "theme_color": "#0a0a0a",
  "start_url": "/",
  "icons": [...]
}
```

### Service Worker
- Cache dos assets estáticos e das fotos do slideshow
- A dashboard funciona offline com os últimos dados de clima cacheados

## Estrutura do projeto

```
src/
  app/
    layout.tsx          # metadata, manifest link, viewport
    page.tsx            # detecta standalone mode e renderiza
    globals.css
  components/
    DeviceFrame.tsx     # modo web: foto do Echo Show com dashboard dentro
    Dashboard.tsx       # a dashboard completa
    Clock.tsx           # relógio 24h com segundos e data
    WeatherCurrent.tsx  # clima atual
    HourlyForecast.tsx  # previsão 8h
    DailyForecast.tsx   # previsão 4 dias
    Slideshow.tsx       # screensaver com fotos
    InstallButton.tsx   # botão de instalação PWA
    WeatherIcon.tsx     # mapeamento weathercode → SVG
  hooks/
    useWeather.ts       # fetch Open-Meteo + cache + interval 15min
    useClock.ts         # relógio atualizado a cada segundo
    useStandalone.ts    # detecta se está rodando como PWA instalado
    useIdleTimer.ts     # detecta inatividade para ativar slideshow
  lib/
    weather.ts          # tipos e fetch da Open-Meteo API
    photos.ts           # carregamento das fotos
  types/
    weather.d.ts
public/
  manifest.json
  sw.js
  photos/              # fotos para o slideshow
  echo-show-frame.png  # frame do dispositivo (modo web)
```

## Detecção de modo

```typescript
// useStandalone.ts
// Detecta se o app está rodando como PWA instalado
// window.matchMedia('(display-mode: fullscreen)').matches
// ou navigator.standalone no iOS
// Se standalone: renderiza só Dashboard + Slideshow
// Se não: renderiza DeviceFrame com Dashboard dentro
```

## Requisitos técnicos

- **Sem SSR nos componentes de clima e relógio** — tudo client-side com "use client"
- Comentários descritivos em trechos de lógica complicada (ex: mapeamento de weathercode, cálculo de idle timer, lógica de cache do service worker)
- Design responsivo: no browser funciona em qualquer tamanho, mas otimizado para 1280x800 no modo PWA
- Fonte: Inter (Google Fonts) ou system-ui
- Ícones de clima: SVG inline, estilo minimalista, cores claras sobre fundo escuro
- Animações suaves: transições CSS para slideshow, update de temperatura sem flash
- Acessibilidade mínima: contraste adequado, alt text nos ícones

## Deploy

- Vercel, sem configuração extra
- Env vars no Vercel: `NEXT_PUBLIC_LAT`, `NEXT_PUBLIC_LON`, `NEXT_PUBLIC_PHOTOS_URL` (opcional)
