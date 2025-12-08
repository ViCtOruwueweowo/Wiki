const CACHE_NAME = 'uwu-pwa-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/global.css',
  '/main.js',
  '/assets/icons/icon-192x192.png',
  '/assets/icons/icon-512x512.png'
];

// Instalación: cacheamos archivos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('✅ Cache abierto');
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Activación: eliminamos caches antiguos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('🗑 Eliminando cache antiguo:', key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch: servimos desde cache o de la red
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
