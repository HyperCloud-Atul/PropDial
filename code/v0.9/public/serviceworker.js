// serviceworker.js

const cacheName = "my-cache";

const urlsToCache = [
  "/",
  "/index.html",
  // Add more URLs to cache as needed
];

self.addEventListener("install", function (event) {
  // Perform install steps
  event.waitUntil(
    caches.open(cacheName).then(function (cache) {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

// self.addEventListener("fetch", function (event) {
//   event.respondWith(
//     caches.match(event.request).then(function (response) {
//       // Cache hit - return response
//       if (response) {
//         return response;
//       }
//       return fetch(event.request);
//     })
//   );
// });

self.addEventListener("fetch", function (event) {
  console.log("serviceworker - fetch");
  // Intercept fetch requests for image resources
  if (
    event.request.url.includes(".jpg") ||
    event.request.url.includes(".jpeg") ||
    event.request.url.includes(".png") ||
    event.request.url.includes(".svg") ||
    event.request.url.includes(".webp") ||
    event.request.url.includes(".gif") ||
    event.request.url.includes(".mp4") ||
    event.request.url.includes(".mpeg3") ||
    event.request.url.includes(".mpeg4") ||
    event.request.url.includes(".mp3")
  ) {
    event.respondWith(
      caches.match(event.request).then(function (response) {
        // Check if the image is already cached
        if (response) {
          // If the image is cached, return the cached response
          return response;
        }

        // If the image is not cached, fetch and cache it
        return fetch(event.request).then(function (response) {
          // Open a cache named 'images-cache'
          return caches.open("images-cache").then(function (cache) {
            // Cache the fetched image response
            cache.put(event.request.url, response.clone());
            // Return the original image response
            return response;
          });
        });
      })
    );
  }
});
