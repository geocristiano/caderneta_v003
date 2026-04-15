const CACHE_NAME = 'anm-survey-v2';
const ASSETS = [
  './',
  'index.html',
  'manifest.json',
  'logo.jpg'
];

// Instalação: Salva os arquivos no cache imediatamente
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto, salvando arquivos...');
        return cache.addAll(ASSETS);
      })
      .then(() => self.skipWaiting()) // Força a ativação imediata
  );
});

// Ativação: Limpa caches antigos e assume o controle das abas abertas
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Limpando cache antigo:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim()) // Assume o controle imediatamente
  );
});

// Estratégia de busca: Tenta o Cache primeiro, se não tiver, vai para a Rede
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retorna o arquivo do cache se encontrar
        if (response) {
          return response;
        }
        // Caso contrário, busca na rede
        return fetch(event.request);
      })
  );
});
