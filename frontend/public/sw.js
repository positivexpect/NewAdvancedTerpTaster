// TerpTaster Service Worker
const CACHE_NAME = "terptaster-v1";
const urlsToCache = [
  "/",
  "/static/js/bundle.js",
  "/static/css/main.css",
  "/manifest.json",
  "/logo192.png",
  "/logo512.png",
];

// Install event - cache essential resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("TerpTaster cache opened");
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.log("Cache install failed:", error);
      }),
  );
});

// Fetch event - serve from cache when offline
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
      .catch(() => {
        // If both fail, return offline page for navigation requests
        if (event.request.destination === "document") {
          return caches.match("/");
        }
      }),
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});

// Push notification event (for future use)
self.addEventListener("push", (event) => {
  if (event.data) {
    const options = {
      body: event.data.text(),
      icon: "/logo192.png",
      badge: "/logo192.png",
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1,
      },
    };

    event.waitUntil(self.registration.showNotification("TerpTaster", options));
  }
});
