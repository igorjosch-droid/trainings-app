// Offline-Speicher: legt Zugangsseite und verschlüsselten Inhalt beim ersten Öffnen ab.
var STAND = 'training-3';
var DATEIEN = ['./', 'index.html', 'inhalt.bin', 'manifest.webmanifest', 'symbol-180.png', 'symbol-192.png', 'symbol-512.png', 'symbol-maskable-512.png'];
self.addEventListener('install', function(e){
  e.waitUntil(caches.open(STAND).then(function(c){ return c.addAll(DATEIEN.map(function(u){ return new Request(u, {cache: 'reload'}); })); }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(k){ return Promise.all(k.filter(function(n){ return n !== STAND; }).map(function(n){ return caches.delete(n); })); })
    .then(function(){ return self.clients.claim(); }));
});
self.addEventListener('fetch', function(e){
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== self.location.origin) return;
  e.respondWith(caches.match(e.request, {ignoreSearch: true}).then(function(r){
    return r || fetch(e.request).then(function(n){
      if (n && n.ok) { var k = n.clone(); caches.open(STAND).then(function(c){ c.put(e.request, k); }); }
      return n;
    }).catch(function(){ return caches.match('index.html'); });
  }));
});
