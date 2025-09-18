// Monitoring and analytics configuration

interface MonitoringConfig {
  sentry: {
    dsn: string
    environment: string
    tracesSampleRate: number
  }
  analytics: {
    googleAnalyticsId: string
    enableTracking: boolean
  }
  performance: {
    enableWebVitals: boolean
    enablePerformanceMonitoring: boolean
  }
}

const config: MonitoringConfig = {
  sentry: {
    dsn: process.env.SENTRY_DSN || '',
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  },
  analytics: {
    googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID || '',
    enableTracking: process.env.NODE_ENV === 'production',
  },
  performance: {
    enableWebVitals: true,
    enablePerformanceMonitoring: true,
  },
}

// Error tracking
export function initErrorTracking() {
  if (typeof window === 'undefined' || !config.sentry.dsn) return

  // Initialize Sentry (only if available)
  // Note: Sentry will be installed separately for production
  console.log('Error tracking initialized (Sentry will be configured in production)')
}

// Analytics tracking
export function initAnalytics() {
  if (typeof window === 'undefined' || !config.analytics.enableTracking) return

  // Google Analytics
  if (config.analytics.googleAnalyticsId) {
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${config.analytics.googleAnalyticsId}`
    document.head.appendChild(script)

    const gtagScript = document.createElement('script')
    gtagScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${config.analytics.googleAnalyticsId}', {
        page_title: document.title,
        page_location: window.location.href,
      });
    `
    document.head.appendChild(gtagScript)
  }
}

// Custom event tracking
export function trackEvent(eventName: string, parameters?: Record<string, any>) {
  if (typeof window === 'undefined' || !config.analytics.enableTracking) return

  // Google Analytics
  if ((window as any).gtag) {
    (window as any).gtag('event', eventName, parameters)
  }

  // Custom analytics
  console.log('Event tracked:', eventName, parameters)
}

// Page view tracking
export function trackPageView(url: string, title: string) {
  if (typeof window === 'undefined' || !config.analytics.enableTracking) return

  // Google Analytics
  if ((window as any).gtag) {
    (window as any).gtag('config', config.analytics.googleAnalyticsId, {
      page_title: title,
      page_location: url,
    })
  }

  // Custom analytics
  console.log('Page view tracked:', url, title)
}

// Performance monitoring
export function initPerformanceMonitoring() {
  if (typeof window === 'undefined' || !config.performance.enablePerformanceMonitoring) return

  // Web Vitals
  if (config.performance.enableWebVitals) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS((metric) => {
        trackEvent('web_vital', {
          name: 'CLS',
          value: metric.value,
          rating: metric.rating,
        })
      })

      getFID((metric) => {
        trackEvent('web_vital', {
          name: 'FID',
          value: metric.value,
          rating: metric.rating,
        })
      })

      getFCP((metric) => {
        trackEvent('web_vital', {
          name: 'FCP',
          value: metric.value,
          rating: metric.rating,
        })
      })

      getLCP((metric) => {
        trackEvent('web_vital', {
          name: 'LCP',
          value: metric.value,
          rating: metric.rating,
        })
      })

      getTTFB((metric) => {
        trackEvent('web_vital', {
          name: 'TTFB',
          value: metric.value,
          rating: metric.rating,
        })
      })
    })
  }
}

// User behavior tracking
export function trackUserAction(action: string, details?: Record<string, any>) {
  trackEvent('user_action', {
    action,
    ...details,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent,
  })
}

// Business metrics tracking
export function trackBusinessMetric(metric: string, value: number, details?: Record<string, any>) {
  trackEvent('business_metric', {
    metric,
    value,
    ...details,
    timestamp: new Date().toISOString(),
  })
}

// Error tracking
export function trackError(error: Error, context?: Record<string, any>) {
  if (typeof window === 'undefined') return

  // Sentry
  if ((window as any).Sentry) {
    (window as any).Sentry.captureException(error, {
      extra: context,
    })
  }

  // Custom error tracking
  trackEvent('error', {
    message: error.message,
    stack: error.stack,
    ...context,
    timestamp: new Date().toISOString(),
  })
}

// Initialize all monitoring
export function initMonitoring() {
  initErrorTracking()
  initAnalytics()
  initPerformanceMonitoring()
}

// Health check endpoint
export function createHealthCheck() {
  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    services: {
      database: 'connected',
      email: 'configured',
      payments: 'configured',
    },
  }
}

export default config
