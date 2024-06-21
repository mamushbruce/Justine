const CACHE_NAME = "memory-game-cache-v2";
const dynamicCacheName = 'site-dynamic-v1';
const urlsToCache = [
  "/",
  "/index.html",
  "/reset.min.js",
  "/style.css",
  "/jquery.min.js",
  "/prefixfree.min.js",
  "/script.js",
  "/manifest.json",
  "/tr/IMG_20231029_121158.png",
  "/tr/Screenshot(51).png",
  "/icons/icon-96x96.png",
  "/icons/icon-512x512.png",
  "https://fonts.googleapis.com/css?family=Open+Sans",
  "https://s3-us-west-2.amazonaws.com/s.cdpn.io/60583/general_foundicons.eot",
  "https://s3-us-west-2.amazonaws.com/s.cdpn.io/60583/general_foundicons.eot?#iefix",
  "https://s3-us-west-2.amazonaws.com/s.cdpn.io/60583/general_foundicons.woff",
  "https://s3-us-west-2.amazonaws.com/s.cdpn.io/60583/general_foundicons.ttf",
  "https://s3-us-west-2.amazonaws.com/s.cdpn.io/60583/general_foundicons.svg#GeneralFoundicons",
];

// cache size limit function
const limitCacheSize = (name, size) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if(keys.length > size){
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    // caches
    //   .match(event.request)
    //   .then((response) => response || fetch(event.request))
    caches.match(event.request).then(cacheRes => {
        return cacheRes || fetch(event.request).then(fetchRes => {
          return caches.open(dynamicCacheName).then(cache => {
            cache.put(event.request.url, fetchRes.clone());
            // check cached items size
            limitCacheSize(dynamicCacheName, 15);
            return fetchRes;
          })
        });
      }).catch(() => {
        if(event.request.url.indexOf('.html') > -1){
          return caches.match('/pages/fallback.html');
        }
      })
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
