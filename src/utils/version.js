// 版本控制
export const APP_VERSION = '1.0.0';

// 检查更新
export const checkForUpdates = async () => {
  try {
    if (!navigator.onLine) {
      console.log('[Version] 离线状态，跳过更新检查');
      return false;
    }

    if (!navigator.serviceWorker || !navigator.serviceWorker.controller) {
      console.log('[Version] Service Worker 未激活，跳过更新检查');
      return false;
    }
    
    const registration = await navigator.serviceWorker.ready;
    
    // 强制更新 Service Worker
    await registration.update();
    
    return true;
  } catch (error) {
    console.error('[Version] 检查更新时出错:', error);
    return false;
  }
};

// 监听更新
export const listenForUpdates = (onUpdateFound) => {
  if (!('serviceWorker' in navigator)) {
    console.log('[Version] 浏览器不支持 Service Worker');
    return;
  }

  // 注册更新检查
  const CHECK_INTERVAL = 1000 * 60 * 60; // 每小时检查一次
  
  // 首次检查
  setTimeout(() => {
    checkForUpdates();
  }, 1000 * 10); // 页面加载 10 秒后进行首次检查
  
  // 定期检查
  setInterval(checkForUpdates, CHECK_INTERVAL);
  
  // 监听更新事件
  navigator.serviceWorker.ready.then(registration => {
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      
      newWorker.addEventListener('statechange', () => {
        // 当新的 Service Worker 安装完成且存在控制页面的旧 Service Worker 时
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          console.log('[Version] 发现新版本');
          onUpdateFound();
        }
      });
    });
  });
  
  // 监听在线状态变化
  window.addEventListener('online', () => {
    console.log('[Version] 网络已恢复，检查更新');
    checkForUpdates();
  });
};

// 获取缓存统计信息
export const getCacheStats = async () => {
  try {
    if (!('caches' in window)) {
      return null;
    }

    const cache = await caches.open('tino-tools-cache-v1');
    const keys = await cache.keys();
    
    const stats = {
      totalItems: keys.length,
      types: {
        html: 0,
        css: 0,
        js: 0,
        images: 0,
        other: 0
      }
    };

    keys.forEach(request => {
      const url = new URL(request.url);
      if (request.headers.get('accept')?.includes('text/html')) {
        stats.types.html++;
      } else if (url.pathname.endsWith('.css')) {
        stats.types.css++;
      } else if (url.pathname.endsWith('.js')) {
        stats.types.js++;
      } else if (url.pathname.match(/\.(png|jpg|jpeg|gif|svg|ico)$/)) {
        stats.types.images++;
      } else {
        stats.types.other++;
      }
    });

    return stats;
  } catch (error) {
    console.error('[Version] 获取缓存统计信息失败:', error);
    return null;
  }
}; 