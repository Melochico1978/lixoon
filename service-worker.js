self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('lixoon-cache-v1').then(function(cache) {
      return cache.addAll([
        './',
        './index.html',
        './tcc.js',
        './apiService.js',
        './tcc.html',
        './manifest.json',
        'https://cdn.jsdelivr.net/npm/chart.js',
        'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
        'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
