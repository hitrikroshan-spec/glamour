const CACHE_NAME = 'glamour-market-v1';

// Liste de toutes les ressources pour les 3 applications
const ASSETS = [
  'admin.html',
  'client.html',
  'livreur.html',
  'manifest.json',
  'manifest_client.json',
  'manifest_livreur.json',
  'logo.png',
  'logo2.png',
  'logo3.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap'
];

// Installation du Service Worker et mise en cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(ASSETS);
      })
      .then(() => self.skipWaiting()) // Force l'activation immédiate
  );
});

// Stratégie : Réseau d'abord (pour avoir les stocks à jour), sinon Cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});

// Nettoyage des anciens caches lors de la mise à jour
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim()) // Prend le contrôle des pages immédiatement
  );
});
