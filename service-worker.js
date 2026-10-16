'use strict';

const CACHE_NAME = 'cube-x-v2';

const CORE_FILES = [
  './',
  './index.html',
  './styles.css',
  './main.js',
  './cube-engine.js',
  './cube-state.js',
  './cube-tests.js',
  './manifest.json',
  './favicon.svg',
  './favicon.ico',
  './apple-touch-icon.png'
];

// Install: cache hanya file yang berhasil dimuat.
// Satu file opsional yang gagal tidak akan menggagalkan seluruh instalasi.
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      await Promise.all(
        CORE_FILES.map(async (file) => {
          try {
            const response = await fetch(file, {
              cache: 'reload'
            });

            if (response.ok) {
              await cache.put(file, response);
            } else {
              console.warn(
                '[CUBE X] File tidak tersedia:',
                file,
                response.status
              );
            }
          } catch (error) {
            console.warn(
              '[CUBE X] Gagal menyimpan cache:',
              file,
              error
            );
          }
        })
      );

      await self.skipWaiting();
    })()
  );
});

// Activate: hapus cache versi lama.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();

      await Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );

      await self.clients.claim();
    })()
  );
});

// Fetch: gunakan cache jika tersedia, selain itu ambil dari jaringan.
self.addEventListener('fetch', (event) => {
  const request = event.request;

  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);

  // Jangan meng-cache permintaan lintas origin, seperti CDN Three.js.
  if (url.origin !== self.location.origin) {
    return;
  }

  // Jangan meng-intervensi navigasi browser dengan fallback HTML
  // untuk permintaan file CSS, JavaScript, gambar, atau aset lain.
  event.respondWith(
    (async () => {
      try {
        const cachedResponse = await caches.match(request);

        if (cachedResponse) {
          return cachedResponse;
        }

        const response = await fetch(request);

        if (response.ok) {
          const cache = await caches.open(CACHE_NAME);

          await cache.put(request, response.clone());
        }

        return response;
      } catch (error) {
        // Offline fallback hanya untuk halaman navigasi.
        if (request.mode === 'navigate') {
          const cachedPage = await caches.match('./index.html');

          if (cachedPage) {
            return cachedPage;
          }
        }

        return new Response(
          'Resource unavailable. Please check your connection.',
          {
            status: 503,
            statusText: 'Service Unavailable',
            headers: {
              'Content-Type': 'text/plain; charset=utf-8'
            }
          }
        );
      }
    })()
  );
});
