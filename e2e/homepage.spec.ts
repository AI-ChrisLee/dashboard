import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should display the homepage correctly', async ({ page }) => {
    await page.goto('/')

    // Check page title
    await expect(page).toHaveTitle(/YouTube Viral Video Dashboard/)

    // Check main heading
    const heading = page.locator('h1')
    await expect(heading).toContainText('Discover Viral YouTube Videos')

    // Check hero section elements
    await expect(page.locator('text=Get Started')).toBeVisible()
    await expect(page.locator('text=Learn More')).toBeVisible()

    // Check features section
    await expect(page.locator('text=Features')).toBeVisible()
    await expect(page.locator('text=Smart Search')).toBeVisible()
    await expect(page.locator('text=Viral Score')).toBeVisible()
    await expect(page.locator('text=Analytics')).toBeVisible()
    await expect(page.locator('text=Real-time Updates')).toBeVisible()
  })

  test('should navigate to dashboard when clicking Get Started', async ({ page }) => {
    await page.goto('/')
    
    await page.click('text=Get Started')
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard')
  })

  test('should scroll to features section when clicking Learn More', async ({ page }) => {
    await page.goto('/')
    
    await page.click('text=Learn More')
    
    // Features section should be visible
    const featuresSection = page.locator('#features')
    await expect(featuresSection).toBeInViewport()
  })

  test('should have working theme toggle', async ({ page }) => {
    await page.goto('/')
    
    // Get initial theme
    const htmlElement = page.locator('html')
    const initialTheme = await htmlElement.getAttribute('class')
    
    // Click theme toggle
    await page.click('[aria-label*="theme"]')
    
    // Theme should change
    await expect(htmlElement).not.toHaveClass(initialTheme || '')
  })

  test('should be responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    // Mobile menu should be visible
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible()
    
    // Desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 })
    
    // Mobile menu should be hidden
    await expect(page.locator('[data-testid="mobile-menu"]')).not.toBeVisible()
  })
})