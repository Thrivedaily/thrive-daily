/* Thrive Daily — lightweight offline shell */
const CACHE = "thrive-daily-v2";
// Only cache static assets — never precache HTML (breaks auth hydration).
const PRECACHE = ["/manifest.webmanifest", "/icons/icon-192.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Never cache navigations / RSC payloads — always network-first.
  const isDocument =
    request.mode === "navigate" ||
    request.destination === "document" ||
    request.headers.get("RSC") === "1" ||
    request.headers.get("Next-Router-Prefetch") === "1" ||
    request.headers.get("Next-Router-State-Tree") != null;

  if (isDocument || url.pathname.startsWith("/sign-in") || url.pathname.startsWith("/sign-up")) {
    event.respondWith(fetch(request));
    return;
  }

  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/__clerk")) {
    event.respondWith(fetch(request).catch(() => caches.match(request)));
    return;
  }

  // Cache-first only for static assets
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetched = fetch(request)
        .then((response) => {
          if (response && response.status === 200 && response.type === "basic") {
            const clone = response.clone();
            const dest = request.destination;
            if (dest === "script" || dest === "style" || dest === "image" || dest === "font") {
              caches.open(CACHE).then((cache) => cache.put(request, clone));
            }
          }
          return response;
        })
        .catch(() => cached);
      return cached || fetched;
    })
  );
});
