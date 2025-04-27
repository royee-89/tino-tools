// 统计服务配置
const config = {
  enabled: false, // 默认关闭统计功能
  debug: process.env.NODE_ENV === 'development',
  provider: 'tencent', // 'tencent' | 'baidu' | 'google'
}

// 初始化统计服务
export const initAnalytics = () => {
  if (!config.enabled) return

  switch (config.config.provider) {
    case 'tencent':
      initTencentAnalytics()
      break
    case 'baidu':
      initBaiduAnalytics()
      break
    // 预留其他统计服务的初始化
    default:
      break
  }
}

// 页面访问统计
export const trackPageView = (url) => {
  if (!config.enabled) return

  try {
    if (config.provider === 'tencent' && window.MtaH5) {
      window.MtaH5.pgv()
    }
    
    if (config.debug) {
      console.log('[Analytics] Page View:', url)
    }
  } catch (error) {
    console.error('[Analytics] Track page view error:', error)
  }
}

// 事件统计
export const trackEvent = (category, action, label = '', value = '') => {
  if (!config.enabled) return

  try {
    if (config.provider === 'tencent' && window.MtaH5) {
      window.MtaH5.clickStat(action, { 
        category,
        label,
        value
      })
    }
    
    if (config.debug) {
      console.log('[Analytics] Event:', { category, action, label, value })
    }
  } catch (error) {
    console.error('[Analytics] Track event error:', error)
  }
}

// 用户行为统计
export const trackBehavior = (behavior, data = {}) => {
  if (!config.enabled) return

  try {
    if (config.provider === 'tencent' && window.MtaH5) {
      window.MtaH5.clickStat('behavior', {
        type: behavior,
        ...data
      })
    }
    
    if (config.debug) {
      console.log('[Analytics] Behavior:', { behavior, data })
    }
  } catch (error) {
    console.error('[Analytics] Track behavior error:', error)
  }
}

// 性能统计
export const trackPerformance = (metric, value) => {
  if (!config.enabled) return

  try {
    if (config.provider === 'tencent' && window.MtaH5) {
      window.MtaH5.clickStat('performance', {
        metric,
        value
      })
    }
    
    if (config.debug) {
      console.log('[Analytics] Performance:', { metric, value })
    }
  } catch (error) {
    console.error('[Analytics] Track performance error:', error)
  }
}

// 错误统计
export const trackError = (error, context = {}) => {
  if (!config.enabled) return

  try {
    if (config.provider === 'tencent' && window.MtaH5) {
      window.MtaH5.clickStat('error', {
        message: error.message,
        stack: error.stack,
        ...context
      })
    }
    
    if (config.debug) {
      console.log('[Analytics] Error:', { error, context })
    }
  } catch (err) {
    console.error('[Analytics] Track error failed:', err)
  }
}

// 初始化腾讯统计
const initTencentAnalytics = () => {
  const script = document.createElement('script')
  script.src = '//pingjs.qq.com/h5/stats.js?v2.0.4'
  script.setAttribute('name', 'MTAH5')
  script.setAttribute('sid', process.env.NEXT_PUBLIC_TENCENT_STAT_ID || '')
  script.setAttribute('cid', process.env.NEXT_PUBLIC_TENCENT_STAT_CID || '')
  document.head.appendChild(script)
}

// 初始化百度统计（预留）
const initBaiduAnalytics = () => {
  // 实现百度统计初始化
}

export default {
  init: initAnalytics,
  pageView: trackPageView,
  event: trackEvent,
  behavior: trackBehavior,
  performance: trackPerformance,
  error: trackError,
  config
} 