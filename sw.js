/**
 * ALANVERSO - SERVICE WORKER (PWA)
 * Estratégia: Cache-First para assets estáticos locais e Stale-While-Revalidate para navegação.
 */
'use strict';

const CACHE_NAME = 'alanverso-cache-v3.0.0';
const STATIC_ASSETS = [
  './',
  './index.html',
  './style.css',
  './main.js',
  './i18n.js',
  './manifest.json',
  './favicon.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(key => key !== CACHE_NAME)
            .map(oldKey => caches.delete(oldKey))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Estratégia Stale-While-Revalidate para recursos do mesmo domínio
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        const networkFetch = fetch(request)
          .then(networkResponse => {
            if (networkResponse && networkResponse.status === 200) {
              const cloned = networkResponse.clone();
              caches.open(CACHE_NAME).then(cache => cache.put(request, cloned));
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || networkFetch;
      })
    );
  }
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
