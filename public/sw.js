// Bump the version to drop all previously cached files
const CACHE = "echo-dashboard-v1";
const PRECACHE = ["/", "/manifest.json", "/icon-192.png", "/icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  );
});

// Caching strategy:
//   - Pages (navigation): network first, so new deploys show up right away;
//     falls back to the cached page when offline.
//   - Build assets (/_next/static, hashed and immutable), fonts and images
//     (including slideshow photos): cache first, fetched only once.
//   - Everything else, including the Open-Meteo API, goes straight to the
//     network. The last weather response is kept in localStorage by useWeather.
self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request));
    return;
  }

  const url = new URL(request.url);
  const isStaticAsset =
    url.origin === self.location.origin && url.pathname.startsWith("/_next/static/");

  if (isStaticAsset || request.destination === "image" || request.destination === "font") {
    event.respondWith(cacheFirst(request));
  }
});

async function networkFirst(request) {
  const cache = await caches.open(CACHE);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch (error) {
    // The page HTML is the same for every URL (mode is detected on the client),
    // so "/" is a valid fallback for e.g. "/?kiosk"
    return (await cache.match(request)) || (await cache.match("/")) || Promise.reject(error);
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  // Opaque responses come from cross-origin images (remote photos):
  // their status is unreadable, but they can still be cached and displayed
  if (response.ok || response.type === "opaque") cache.put(request, response.clone());
  return response;
}
