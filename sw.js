/**
 * ALANVERSO v5.0.0 - SERVICE WORKER (PWA OFFLINE-FIRST)
 * Estratégia: Cache-First para shell/módulos estáticos locais e Stale-While-Revalidate para atualização em segundo plano.
 */
'use strict';

const CACHE_NAME = 'alanverso-cache-v5.0.0';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './assets/icons/favicon.svg',
  './styles/tokens.css',
  './styles/base.css',
  './styles/components.css',
  './styles/sections/hero-showcase.css',
  './styles/sections/soundboard-clips.css',
  './styles/sections/interactive-labs.css',
  './styles/sections/lore-footer.css',
  './styles/responsive.css',
  './src/main.js',
  './src/core/dom.js',
  './src/core/format.js',
  './src/core/storage.js',
  './src/core/a11y.js',
  './src/core/backup.js',
  './src/data/achievements.js',
  './src/data/quiz.js',
  './src/data/sounds.js',
  './src/data/i18n-dict.js',
  './src/features/i18n.js',
  './src/features/achievements.js',
  './src/features/soundboard.js',
  './src/features/clips.js',
  './src/features/meme-generator.js',
  './src/features/quiz.js',
  './src/features/navigation.js',
  './src/features/modals.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => Promise.allSettled(STATIC_ASSETS.map((asset) => cache.add(asset))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key !== CACHE_NAME).map((oldKey) => caches.delete(oldKey)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Stale-While-Revalidate para recursos do mesmo domínio
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const networkFetch = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const cloned = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, cloned));
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || networkFetch;
      }),
    );
  }
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
