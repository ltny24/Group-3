/* Basic PWA Service Worker */
const CACHE_NAME = 'safety-pwa-v1';
const PRECACHE = [
  '/', '/index.html', '/manifest.webmanifest',
  '/icons/icon-192.png', '/icons/icon-512.png', '/icons/icon-maskable.png',
  '/mocks/data-001.json', '/mocks/data-002.json', '/mocks/data-003.json',
  '/offline.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
    ))
  );
  self.clients.claim();
});

// Simple network-first for navigation, cache-first for static assets
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Only handle GET
  if (req.method !== 'GET') return;

  // Navigation requests -> network-first with offline fallback
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(CACHE_NAME);
        cache.put(req, fresh.clone());
        return fresh;
      } catch (e) {
        const cached = await caches.match(req);
        return cached || caches.match('/offline.html') || caches.match('/index.html');
      }
    })());
    return;
  }

  // Cross-origin: don't cache by default to avoid opaque bloat
  if (url.origin !== self.location.origin) {
    return; // Let the request pass through
  }

  // Static assets & same-origin requests -> cache-first
  event.respondWith((async () => {
    const cached = await caches.match(req);
    if (cached) return cached;
    try {
      const fresh = await fetch(req);
      // Optional: only cache successful, basic/cors responses
      if (fresh && fresh.ok && (fresh.type === 'basic' || fresh.type === 'cors')) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(req, fresh.clone());
      }
      return fresh;
    } catch (e) {
      // Fallback for same-origin GET (e.g., JSON/mocks)
      const offline = await caches.match('/offline.html');
      return offline || new Response('You are offline.', { status: 503, statusText: 'Offline' });
    }
  })());
});
