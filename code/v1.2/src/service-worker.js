/* eslint-disable no-restricted-globals */
import { precacheAndRoute } from 'workbox-precaching';
import { clientsClaim } from 'workbox-core';
import { registerRoute } from 'workbox-routing'
import { ExpirationPlugin } from 'workbox-expiration'
import { CacheFirst } from 'workbox-strategies';
import { NetworkFirst } from 'workbox-strategies';
import { StaleWhileRevalidate } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response'

//This clientsClaim should be on top level of the service worker
//not inside of e.g. an event handler
clientsClaim();

//Not wrapping it in a 'message' event as per the new update
self.skipWaiting();

precacheAndRoute(self.__WB_MANIFEST);

//-------------------------- Strategies -------------------------------------------

// Register a route to cache requests for Google Fonts URLs using CacheFirst strategy
registerRoute(
    ({ url }) => url.origin === 'https://fonts.googleapis.com',
    new CacheFirst({
        cacheName: 'propdial-google-fonts-stylesheet',
        plugins: [
            // Optionally, you can configure additional plugins here
            // Ensure that only requests that result in a 200 status are cached...
            new CacheableResponsePlugin({
                statuses: [200]
            }),
            new ExpirationPlugin({
                maxEntries: 30,
                maxAgeSeconds: 365 * 24 * 60 * 60 // 365 Days
            }),
        ],
    })
);

// Register a route to cache requests for Google Fonts URLs using CacheFirst strategy
registerRoute(
    ({ url }) => url.origin === 'https://fonts.gstatic.com',
    new CacheFirst({
        cacheName: 'propdial-google-fonts-webfonts',
        plugins: [
            // Optionally, you can configure additional plugins here
            // Ensure that only requests that result in a 200 status are cached...
            new CacheableResponsePlugin({
                statuses: [200]
            }),
            new ExpirationPlugin({
                maxEntries: 30,
                maxAgeSeconds: 365 * 24 * 60 * 60 // 365 Days
            }),
        ],
    })
);

// Cache First for static images (e.g., logos, icons)
registerRoute(
    ({ request }) => request.destination === 'image',
    new CacheFirst({
        cacheName: 'propdial-static-images-cache',
        plugins: [
            // You can add additional plugins here if needed
            new ExpirationPlugin({
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 Days
            }),
        ],
    })
);

// Stale While Revalidate for dynamic images (e.g., user avatars)
registerRoute(
    ({ request }) => request.destination === 'image',
    new StaleWhileRevalidate({
        cacheName: 'propdial-dynamic-images-cache',
        plugins: [
            // You can add additional plugins here if needed
        ],
    })
);

// Cache First for core stylesheets and scripts
registerRoute(
    ({ request }) => request.destination === 'style' || request.destination === 'script',
    new CacheFirst({
        cacheName: 'propdial-core-assets-cache',
        plugins: [
            // You can add additional plugins here if needed
        ],
    })
);

// Stale While Revalidate for dynamic stylesheets and scripts
registerRoute(
    ({ request }) => request.destination === 'style' || request.destination === 'script',
    new StaleWhileRevalidate({
        cacheName: 'propdial-dynamic-assets-cache',
        plugins: [
            // You can add additional plugins here if needed
        ],
    })
);

// Network First for real-time API requests
registerRoute(
    ({ url }) => url.origin === 'https://firestore.googleapis.com',
    new NetworkFirst({
        cacheName: 'propdial-firestore-real-time-data-cache',
        plugins: [
            // You can add additional plugins here if needed
        ],
    })
);

// Stale While Revalidate for non-critical API requests
registerRoute(
    ({ url }) => url.origin === 'https://firebasestorage.googleapis.com',
    new StaleWhileRevalidate({
        cacheName: 'propdial-fbstorage-data-cache',
        plugins: [
            // You can add additional plugins here if needed
        ],
    })
);

// Stale While Revalidate for non-critical API requests
// registerRoute(
//     ({ url }) => url.origin === 'https://api.example.com',
//     new StaleWhileRevalidate({
//         cacheName: 'non-critical-data-cache',
//         plugins: [
//             // You can add additional plugins here if needed
//         ],
//     })
// );

// Network First for real-time API requests
// registerRoute(
//     ({ url }) => url.origin === 'https://api.example.com/real-time-endpoint',
//     new NetworkFirst({
//         cacheName: 'real-time-data-cache',
//         plugins: [
//             // You can add additional plugins here if needed
//         ],
//     })
// );

// // Cache routes...
// registerRoute(
//     // Check to see if the request is a navigation to a new page...
//     ({ request }) => request.mode === 'navigate',
//     // Use a Network First caching strategy...
//     new NetworkFirst({
//         // Put all cached files in a cache named 'pages'...
//         cacheName: 'pages',
//         plugins: [
//             // Ensure that only requests that result in a 200 status are cached...
//             new CacheableResponsePlugin({
//                 statuses: [200]
//             }),
//             new ExpirationPlugin({
//                 maxEntries: 20,
//                 maxAgeSeconds: 1 * 24 * 60 * 60 // 1 Day
//             }),
//         ],
//     })
// );

