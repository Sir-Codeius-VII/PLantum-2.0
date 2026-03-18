"use client"

import * as React from "react"
import { PerformanceMonitor, checkPerformanceBudget } from "@/lib/performance"

interface PerformanceMonitorProps {
  enabled?: boolean
  onMetrics?: (metrics: any) => void
  onBudgetViolation?: (violations: string[]) => void
}

export function PerformanceMonitorComponent({ 
  enabled = process.env.NODE_ENV === 'production',
  onMetrics,
  onBudgetViolation 
}: PerformanceMonitorProps) {
  const [metrics, setMetrics] = React.useState<any>(null)
  const [violations, setViolations] = React.useState<string[]>([])

  React.useEffect(() => {
    if (!enabled || typeof window === 'undefined') return

    const monitor = PerformanceMonitor.getInstance()
    
    const measurePerformance = async () => {
      try {
        const performanceMetrics = await monitor.measurePageLoad()
        setMetrics(performanceMetrics)
        onMetrics?.(performanceMetrics)

        // Check performance budget
        const budgetCheck = checkPerformanceBudget(performanceMetrics)
        if (!budgetCheck.passed) {
          setViolations(budgetCheck.violations)
          onBudgetViolation?.(budgetCheck.violations)
          
          // Log violations in development
          if (process.env.NODE_ENV === 'development') {
            console.warn('Performance budget violations:', budgetCheck.violations)
          }
        }

        // Send metrics to analytics
        await monitor.sendMetrics(performanceMetrics)
      } catch (error) {
        console.error('Failed to measure performance:', error)
      }
    }

    // Measure performance after page load
    if (document.readyState === 'complete') {
      measurePerformance()
    } else {
      window.addEventListener('load', measurePerformance)
    }

    return () => {
      window.removeEventListener('load', measurePerformance)
    }
  }, [enabled, onMetrics, onBudgetViolation])

  // Don't render anything in production
  if (process.env.NODE_ENV === 'production') {
    return null
  }

  // Development performance dashboard
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-background border rounded-lg p-4 shadow-lg max-w-sm">
      <h3 className="font-semibold text-sm mb-2">Performance Monitor</h3>
      
      {metrics ? (
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span>Load Time:</span>
            <span className={metrics.loadTime > 3000 ? 'text-red-500' : 'text-green-500'}>
              {metrics.loadTime.toFixed(0)}ms
            </span>
          </div>
          <div className="flex justify-between">
            <span>FCP:</span>
            <span className={metrics.firstContentfulPaint > 1500 ? 'text-red-500' : 'text-green-500'}>
              {metrics.firstContentfulPaint.toFixed(0)}ms
            </span>
          </div>
          <div className="flex justify-between">
            <span>LCP:</span>
            <span className={metrics.largestContentfulPaint > 2500 ? 'text-red-500' : 'text-green-500'}>
              {metrics.largestContentfulPaint.toFixed(0)}ms
            </span>
          </div>
          <div className="flex justify-between">
            <span>FID:</span>
            <span className={metrics.firstInputDelay > 100 ? 'text-red-500' : 'text-green-500'}>
              {metrics.firstInputDelay.toFixed(0)}ms
            </span>
          </div>
          <div className="flex justify-between">
            <span>CLS:</span>
            <span className={metrics.cumulativeLayoutShift > 0.1 ? 'text-red-500' : 'text-green-500'}>
              {metrics.cumulativeLayoutShift.toFixed(3)}
            </span>
          </div>
        </div>
      ) : (
        <div className="text-xs text-muted-foreground">Measuring performance...</div>
      )}

      {violations.length > 0 && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs">
          <div className="font-semibold text-red-800 mb-1">Budget Violations:</div>
          {violations.map((violation, index) => (
            <div key={index} className="text-red-700">{violation}</div>
          ))}
        </div>
      )}
    </div>
  )
}

// Web Vitals component for Next.js
export function WebVitals() {
  React.useEffect(() => {
    if (typeof window === 'undefined') return

    import('web-vitals').then((mod) => {
      const { onCLS, onFCP, onLCP, onTTFB, onINP, onFID } = mod as any
      if (typeof onCLS === 'function') onCLS(console.log)
      if (typeof onFCP === 'function') onFCP(console.log)
      if (typeof onLCP === 'function') onLCP(console.log)
      if (typeof onTTFB === 'function') onTTFB(console.log)
      if (typeof onINP === 'function') onINP(console.log)
      else if (typeof onFID === 'function') onFID(console.log)
    })
  }, [])

  return null
}
