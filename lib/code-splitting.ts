import React, { ComponentType } from 'react'

// Dynamic imports for code splitting
export function dynamicImport<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
) {
  return importFn().then(module => module.default)
}

// Lazy load components with loading fallback
export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: ComponentType
) {
  const LazyComponent = React.lazy(importFn)
  
  return function WrappedLazyComponent(props: any) {
    return (
      <React.Suspense fallback={fallback ? <fallback /> : <div>Loading...</div>}>
        <LazyComponent {...props} />
      </React.Suspense>
    )
  }
}

// Route-based code splitting
export const LazyPages = {
  AdminDashboard: React.lazy(() => import('@/components/admin/admin-dashboard')),
  PaymentAnalytics: React.lazy(() => import('@/components/payment/payment-analytics')),
  UserProfile: React.lazy(() => import('@/components/user-profile-card')),
  // Add more lazy-loaded components as needed
}

// Bundle analysis utilities
export function analyzeBundleSize() {
  if (typeof window === 'undefined') return

  const scripts = Array.from(document.querySelectorAll('script[src]'))
  const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
  
  const bundleInfo = {
    scripts: scripts.map(script => ({
      src: script.getAttribute('src'),
      size: 'unknown' // Would need to fetch and measure
    })),
    stylesheets: stylesheets.map(link => ({
      href: link.getAttribute('href'),
      size: 'unknown'
    }))
  }

  console.log('Bundle analysis:', bundleInfo)
  return bundleInfo
}

// Preload critical routes
export function preloadCriticalRoutes() {
  if (typeof window === 'undefined') return

  const criticalRoutes = [
    '/dashboard',
    '/startups',
    '/investors',
    '/auth/signin',
    '/auth/signup'
  ]

  criticalRoutes.forEach(route => {
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = route
    document.head.appendChild(link)
  })
}

// Resource hints
export function addResourceHints() {
  if (typeof window === 'undefined') return

  // DNS prefetch for external domains
  const externalDomains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://www.google-analytics.com',
    'https://www.googletagmanager.com'
  ]

  externalDomains.forEach(domain => {
    const link = document.createElement('link')
    link.rel = 'dns-prefetch'
    link.href = domain
    document.head.appendChild(link)
  })

  // Preconnect to critical origins
  const criticalOrigins = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  ]

  criticalOrigins.forEach(origin => {
    const link = document.createElement('link')
    link.rel = 'preconnect'
    link.href = origin
    link.crossOrigin = 'anonymous'
    document.head.appendChild(link)
  })
}

// Memory management
export function optimizeMemoryUsage() {
  if (typeof window === 'undefined') return

  // Clear unused event listeners
  const cleanup = () => {
    // Remove any global event listeners that might be accumulating
    window.removeEventListener('scroll', () => {})
    window.removeEventListener('resize', () => {})
  }

  // Run cleanup periodically
  setInterval(cleanup, 30000) // Every 30 seconds

  // Cleanup on page unload
  window.addEventListener('beforeunload', cleanup)
}

// Performance optimization for large lists
export function createVirtualizedList<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  renderItem: (item: T, index: number) => React.ReactNode
) {
  const [scrollTop, setScrollTop] = React.useState(0)
  
  const visibleStart = Math.floor(scrollTop / itemHeight)
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  )
  
  const visibleItems = items.slice(visibleStart, visibleEnd)
  
  return {
    visibleItems,
    totalHeight: items.length * itemHeight,
    offsetY: visibleStart * itemHeight,
    onScroll: (e: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(e.currentTarget.scrollTop)
    }
  }
}

// Image optimization
export function optimizeImageLoading() {
  if (typeof window === 'undefined') return

  // Lazy load images
  const images = document.querySelectorAll('img[data-src]')
  
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement
        img.src = img.dataset.src || ''
        img.removeAttribute('data-src')
        imageObserver.unobserve(img)
      }
    })
  })

  images.forEach(img => imageObserver.observe(img))
}

// Critical CSS inlining
export function inlineCriticalCSS() {
  if (typeof window === 'undefined') return

  // This would typically be done at build time
  // Here we're just ensuring critical styles are loaded first
  const criticalStyles = document.querySelectorAll('style[data-critical]')
  criticalStyles.forEach(style => {
    style.setAttribute('media', 'all')
  })
}

// Service Worker registration for caching
export function registerServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration)
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError)
      })
  })
}
