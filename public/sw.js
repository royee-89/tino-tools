const CACHE_NAME = 'tino-tools-cache-v1';

// 需要预缓存的资源列表
const PRECACHE_RESOURCES = [
  '/assets/brand/logo/logo.png',
  '/favicon.svg',
  '/_next/static/css/app.css',
  '/_next/static/js/main.js'
];

// 安装事件 - 预缓存核心资源
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Pre-caching resources');
        return cache.addAll(PRECACHE_RESOURCES);
      })
  );
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 请求拦截 - 实现不同的缓存策略
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  // 根据请求类型选择缓存策略
  if (request.method !== 'GET') {
    // 非 GET 请求直接发送到网络
    return;
  }

  // HTML 文件 - Network First
  if (request.mode === 'navigate' || request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // 将响应的副本存入缓存
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // 网络请求失败时使用缓存
          return caches.match(request);
        })
    );
    return;
  }

  // API 请求 - Network Only
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(fetch(request));
    return;
  }

  // 静态资源 - Cache First
  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/assets/') ||
    url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico)$/)
  ) {
    event.respondWith(
      caches.match(request)
        .then(response => {
          // 返回缓存的响应，如果没有则从网络获取
          return response || fetch(request).then(response => {
            // 将从网络获取的响应存入缓存
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, responseClone);
            });
            return response;
          });
        })
    );
    return;
  }

  // 其他资源 - Stale While Revalidate
  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        const fetchPromise = fetch(request).then(response => {
          // 更新缓存
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, responseClone);
          });
          return response;
        });
        // 立即返回缓存的响应（如果有），同时在后台更新缓存
        return cachedResponse || fetchPromise;
      })
  );
}); 