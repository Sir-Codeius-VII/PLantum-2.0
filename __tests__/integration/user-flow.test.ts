import { test, expect } from '@playwright/test'

test.describe('User Authentication Flow', () => {
  test('should allow user to sign up and sign in', async ({ page }) => {
    // Navigate to signup page
    await page.goto('/auth/signup')
    
    // Fill out signup form
    await page.fill('[data-testid="email-input"]', 'test@example.com')
    await page.fill('[data-testid="password-input"]', 'password123')
    await page.fill('[data-testid="name-input"]', 'Test User')
    
    // Submit form
    await page.click('[data-testid="signup-button"]')
    
    // Should redirect to dashboard or show success message
    await expect(page).toHaveURL(/dashboard|success/)
  })

  test('should validate form inputs', async ({ page }) => {
    await page.goto('/auth/signup')
    
    // Try to submit empty form
    await page.click('[data-testid="signup-button"]')
    
    // Should show validation errors
    await expect(page.locator('[data-testid="email-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="password-error"]')).toBeVisible()
  })

  test('should handle sign in flow', async ({ page }) => {
    await page.goto('/auth/signin')
    
    // Fill out signin form
    await page.fill('[data-testid="email-input"]', 'test@example.com')
    await page.fill('[data-testid="password-input"]', 'password123')
    
    // Submit form
    await page.click('[data-testid="signin-button"]')
    
    // Should redirect to dashboard
    await expect(page).toHaveURL(/dashboard/)
  })
})

test.describe('Startup Discovery Flow', () => {
  test('should display startups list', async ({ page }) => {
    await page.goto('/startups')
    
    // Should show startups
    await expect(page.locator('[data-testid="startup-card"]')).toBeVisible()
    
    // Should have search functionality
    await expect(page.locator('[data-testid="search-input"]')).toBeVisible()
    
    // Should have filter options
    await expect(page.locator('[data-testid="filter-button"]')).toBeVisible()
  })

  test('should allow filtering startups', async ({ page }) => {
    await page.goto('/startups')
    
    // Click filter button
    await page.click('[data-testid="filter-button"]')
    
    // Select industry filter
    await page.selectOption('[data-testid="industry-filter"]', 'Technology')
    
    // Apply filter
    await page.click('[data-testid="apply-filter"]')
    
    // Should show filtered results
    await expect(page.locator('[data-testid="startup-card"]')).toBeVisible()
  })

  test('should allow searching startups', async ({ page }) => {
    await page.goto('/startups')
    
    // Type in search
    await page.fill('[data-testid="search-input"]', 'tech')
    
    // Should show search results
    await expect(page.locator('[data-testid="startup-card"]')).toBeVisible()
  })
})

test.describe('Investment Flow', () => {
  test('should allow user to view startup details', async ({ page }) => {
    await page.goto('/startups')
    
    // Click on first startup
    await page.click('[data-testid="startup-card"]:first-child')
    
    // Should navigate to startup detail page
    await expect(page).toHaveURL(/startup\/.+/)
    
    // Should show startup details
    await expect(page.locator('[data-testid="startup-details"]')).toBeVisible()
    await expect(page.locator('[data-testid="investment-button"]')).toBeVisible()
  })

  test('should allow user to initiate investment', async ({ page }) => {
    await page.goto('/startup/test-startup-id')
    
    // Click investment button
    await page.click('[data-testid="investment-button"]')
    
    // Should show investment modal or redirect to payment
    await expect(page.locator('[data-testid="investment-modal"]')).toBeVisible()
  })

  test('should handle payment flow', async ({ page }) => {
    await page.goto('/payments/test-payment-id')
    
    // Should show payment options
    await expect(page.locator('[data-testid="payfast-option"]')).toBeVisible()
    await expect(page.locator('[data-testid="bank-transfer-option"]')).toBeVisible()
    
    // Select PayFast
    await page.click('[data-testid="payfast-option"]')
    
    // Should redirect to PayFast or show payment form
    await expect(page.locator('[data-testid="payment-form"]')).toBeVisible()
  })
})

test.describe('Mobile Responsiveness', () => {
  test('should work on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    await page.goto('/')
    
    // Should show mobile navigation
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible()
    
    // Should hide desktop navigation
    await expect(page.locator('[data-testid="desktop-nav"]')).not.toBeVisible()
  })

  test('should show bottom navigation on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    
    await page.goto('/')
    
    // Should show bottom navigation
    await expect(page.locator('[data-testid="bottom-nav"]')).toBeVisible()
  })
})

test.describe('Performance', () => {
  test('should load page within performance budget', async ({ page }) => {
    const startTime = Date.now()
    
    await page.goto('/')
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle')
    
    const loadTime = Date.now() - startTime
    
    // Should load within 3 seconds
    expect(loadTime).toBeLessThan(3000)
  })

  test('should have good Core Web Vitals', async ({ page }) => {
    await page.goto('/')
    
    // Measure LCP
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          resolve(lastEntry.startTime)
        }).observe({ entryTypes: ['largest-contentful-paint'] })
      })
    })
    
    // LCP should be under 2.5 seconds
    expect(lcp).toBeLessThan(2500)
  })
})

test.describe('Accessibility', () => {
  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/')
    
    // Tab through navigation
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    
    // Should be able to navigate with keyboard
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName)
    expect(focusedElement).toBeTruthy()
  })

  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/')
    
    // Check for ARIA labels
    const elementsWithAria = await page.locator('[aria-label]').count()
    expect(elementsWithAria).toBeGreaterThan(0)
  })
})
