// Performance monitoring and optimization utilities

export interface PerformanceMetrics {
  loadTime: number
  firstContentfulPaint: number
  largestContentfulPaint: number
  firstInputDelay: number
  cumulativeLayoutShift: number
  timeToInteractive: number
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: PerformanceMetrics | null = null

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  async measurePageLoad(): Promise<PerformanceMetrics> {
    if (typeof window === 'undefined') {
      return this.getDefaultMetrics()
    }

    return new Promise((resolve) => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const metrics = this.calculateMetrics(entries)
        this.metrics = metrics
        resolve(metrics)
      })

      observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] })

      // Fallback timeout
      setTimeout(() => {
        if (!this.metrics) {
          resolve(this.getDefaultMetrics())
        }
      }, 5000)
    })
  }

  private calculateMetrics(entries: PerformanceEntry[]): PerformanceMetrics {
    const navigation = entries.find(entry => entry.entryType === 'navigation') as PerformanceNavigationTiming
    const paint = entries.filter(entry => entry.entryType === 'paint')
    const lcp = entries.find(entry => entry.entryType === 'largest-contentful-paint') as PerformanceEntry
    const fid = entries.find(entry => entry.entryType === 'first-input') as PerformanceEntry
    const cls = entries.filter(entry => entry.entryType === 'layout-shift')

    return {
      loadTime: navigation ? navigation.loadEventEnd - navigation.fetchStart : 0,
      firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
      largestContentfulPaint: lcp?.startTime || 0,
      firstInputDelay: fid ? (fid as any).processingStart - fid.startTime : 0,
      cumulativeLayoutShift: cls.reduce((sum, entry) => sum + (entry as any).value, 0),
      timeToInteractive: navigation ? navigation.domInteractive - navigation.fetchStart : 0,
    }
  }

  private getDefaultMetrics(): PerformanceMetrics {
    return {
      loadTime: 0,
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      firstInputDelay: 0,
      cumulativeLayoutShift: 0,
      timeToInteractive: 0,
    }
  }

  getMetrics(): PerformanceMetrics | null {
    return this.metrics
  }

  // Send metrics to analytics
  async sendMetrics(metrics: PerformanceMetrics): Promise<void> {
    try {
      // Send to your analytics service
      console.log('Performance metrics:', metrics)
      
      // Example: Send to Google Analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'performance_metrics', {
          load_time: metrics.loadTime,
          first_contentful_paint: metrics.firstContentfulPaint,
          largest_contentful_paint: metrics.largestContentfulPaint,
          first_input_delay: metrics.firstInputDelay,
          cumulative_layout_shift: metrics.cumulativeLayoutShift,
          time_to_interactive: metrics.timeToInteractive,
        })
      }
    } catch (error) {
      console.error('Failed to send performance metrics:', error)
    }
  }
}

// Image optimization utilities
export function getOptimizedImageUrl(
  src: string,
  width: number,
  height?: number,
  quality: number = 75
): string {
  // If using Next.js Image component, this would be handled automatically
  // This is for custom image optimization
  const params = new URLSearchParams({
    w: width.toString(),
    q: quality.toString(),
  })
  
  if (height) {
    params.set('h', height.toString())
  }
  
  return `${src}?${params.toString()}`
}

// Bundle size optimization
export function preloadCriticalResources(): void {
  if (typeof window === 'undefined') return

  // Preload critical fonts
  const fontLink = document.createElement('link')
  fontLink.rel = 'preload'
  fontLink.href = '/fonts/inter.woff2'
  fontLink.as = 'font'
  fontLink.type = 'font/woff2'
  fontLink.crossOrigin = 'anonymous'
  document.head.appendChild(fontLink)

  // Preload critical images
  const criticalImages = ['/og-image.png', '/logo.png']
  criticalImages.forEach(src => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = src
    link.as = 'image'
    document.head.appendChild(link)
  })
}

// Lazy loading utilities
export function createIntersectionObserver(
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit = {}
): IntersectionObserver | null {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null
  }

  return new IntersectionObserver(callback, {
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  })
}

// Code splitting utilities
export function loadComponent<T>(
  importFn: () => Promise<{ default: T }>
): Promise<T> {
  return importFn().then(module => module.default)
}

// Memory management
export function cleanupResources(): void {
  // Clear any timers
  if (typeof window !== 'undefined') {
    // Clear all timeouts and intervals
    const highestTimeoutId = setTimeout(() => {}, 0)
    for (let i = 0; i < highestTimeoutId; i++) {
      clearTimeout(i)
    }
  }
}

// Performance budget monitoring
export const PERFORMANCE_BUDGETS = {
  loadTime: 3000, // 3 seconds
  firstContentfulPaint: 1500, // 1.5 seconds
  largestContentfulPaint: 2500, // 2.5 seconds
  firstInputDelay: 100, // 100ms
  cumulativeLayoutShift: 0.1, // 0.1
  timeToInteractive: 4000, // 4 seconds
}

export function checkPerformanceBudget(metrics: PerformanceMetrics): {
  passed: boolean
  violations: string[]
} {
  const violations: string[] = []

  if (metrics.loadTime > PERFORMANCE_BUDGETS.loadTime) {
    violations.push(`Load time exceeded budget: ${metrics.loadTime}ms > ${PERFORMANCE_BUDGETS.loadTime}ms`)
  }

  if (metrics.firstContentfulPaint > PERFORMANCE_BUDGETS.firstContentfulPaint) {
    violations.push(`FCP exceeded budget: ${metrics.firstContentfulPaint}ms > ${PERFORMANCE_BUDGETS.firstContentfulPaint}ms`)
  }

  if (metrics.largestContentfulPaint > PERFORMANCE_BUDGETS.largestContentfulPaint) {
    violations.push(`LCP exceeded budget: ${metrics.largestContentfulPaint}ms > ${PERFORMANCE_BUDGETS.largestContentfulPaint}ms`)
  }

  if (metrics.firstInputDelay > PERFORMANCE_BUDGETS.firstInputDelay) {
    violations.push(`FID exceeded budget: ${metrics.firstInputDelay}ms > ${PERFORMANCE_BUDGETS.firstInputDelay}ms`)
  }

  if (metrics.cumulativeLayoutShift > PERFORMANCE_BUDGETS.cumulativeLayoutShift) {
    violations.push(`CLS exceeded budget: ${metrics.cumulativeLayoutShift} > ${PERFORMANCE_BUDGETS.cumulativeLayoutShift}`)
  }

  if (metrics.timeToInteractive > PERFORMANCE_BUDGETS.timeToInteractive) {
    violations.push(`TTI exceeded budget: ${metrics.timeToInteractive}ms > ${PERFORMANCE_BUDGETS.timeToInteractive}ms`)
  }

  return {
    passed: violations.length === 0,
    violations,
  }
}
