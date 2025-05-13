// Service Worker for Notes App
const CACHE_NAME = "notes-app-v1"
const urlsToCache = [
  "/",
  "/manifest.json",
  "/icon-192x192.png",
  "/icon-512x512.png",
  "/apple-touch-icon.png",
  "/favicon-32x32.png",
  "/favicon-16x16.png",
]

// Install event - cache assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache)
    }),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return cacheName !== CACHE_NAME
          })
          .map((cacheName) => {
            return caches.delete(cacheName)
          }),
      )
    }),
  )
})

// Fetch event - serve from cache if available, otherwise fetch from network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response
      }
      return fetch(event.request).then((response) => {
        // Don't cache responses that aren't successful
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response
        }

        // Clone the response since it can only be consumed once
        const responseToCache = response.clone()

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache)
        })

        return response
      })
    }),
  )
})
