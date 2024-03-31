// serviceworker.js

const cacheName = 'propdial-cache';

const urlsToCache = [
  '/',
  '/index.html',
  '/static/js/main.js',
  '/static/css/main.css',
  // Add more URLs to cache as needed
];

self.addEventListener('install', function (event) {
  console.log('serviceworker - install')
  // Perform install steps
  event.waitUntil(
    caches.open(cacheName)
      .then(function (cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', event => {
  console.log('serviceworker - activate')
  // Delete old caches
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== cacheName) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});


self.addEventListener('fetch', event => {
  console.log('serviceworker - fetch')
  const requestUrl = new URL(event.request.url);

  // Check if the requested resource is an image
  if (requestUrl.pathname.match(/\.(jpg|jpeg|png|gif|svg|webp)$/)) {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          // Cache hit - return response
          if (response) {
            return response;
          }

          // Clone the request to use it twice: once for fetching and once for caching
          const fetchRequest = event.request.clone();

          return fetch(fetchRequest).then(response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response to use it for caching
            const responseToCache = response.clone();

            caches.open(cacheName)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          });
        })
    );
  } else {
    // For non-image requests, use default caching strategy
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          // Cache hit - return response
          if (response) {
            return response;
          }

          // Clone the request to use it twice: once for fetching and once for caching
          const fetchRequest = event.request.clone();

          return fetch(fetchRequest).then(response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response to use it for caching
            const responseToCache = response.clone();

            caches.open(cacheName)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          });
        })
    );
  }
});


// service-worker.js