self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {

  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) =>
            caches.delete(key)
          )
        )
      )
      .then(() =>
        self.clients.claim()
      )
  );

});

/*
  V1-la offline caching disable.

  Later proper PWA version-la
  safe caching add pannuvom.
*/
self.addEventListener('fetch', () => {});