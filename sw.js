const CACHE_NAME = "memory-game-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/reset.min.js",
  "/style.css",
  "/jquery.min.js",
  "/prefixfree.min.js",
  "/script.js",
  "/manifest.json",
  "/icons/icon-96x96.png",
  "/icons/icon-512x512.png",
  "https://fonts.googleapis.com/css?family=Open+Sans",
  "https://s3-us-west-2.amazonaws.com/s.cdpn.io/60583/general_foundicons.eot",
  "https://s3-us-west-2.amazonaws.com/s.cdpn.io/60583/general_foundicons.eot?#iefix",
  "https://s3-us-west-2.amazonaws.com/s.cdpn.io/60583/general_foundicons.woff",
  "https://s3-us-west-2.amazonaws.com/s.cdpn.io/60583/general_foundicons.ttf",
  "https://s3-us-west-2.amazonaws.com/s.cdpn.io/60583/general_foundicons.svg#GeneralFoundicons",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request))
  );
});

self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
