import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard')
  })

  test('should display dashboard elements', async ({ page }) => {
    // Check page title
    await expect(page.locator('h1')).toContainText('YouTube Viral Video Dashboard')

    // Check search input
    const searchInput = page.locator('input[placeholder*="Search"]')
    await expect(searchInput).toBeVisible()

    // Check search button
    await expect(page.locator('button:has-text("Search")')).toBeVisible()

    // Check filter button
    await expect(page.locator('button[aria-label*="filter"]')).toBeVisible()

    // Check statistics cards
    await expect(page.locator('text=Videos Found')).toBeVisible()
    await expect(page.locator('text=Avg Viral Score')).toBeVisible()
    await expect(page.locator('text=Total Views')).toBeVisible()
  })

  test('should perform a search', async ({ page }) => {
    // Enter search query
    const searchInput = page.locator('input[placeholder*="Search"]')
    await searchInput.fill('coding tutorials')
    
    // Click search button
    await page.click('button:has-text("Search")')
    
    // Wait for loading state
    await expect(page.locator('text=Searching')).toBeVisible()
    
    // Wait for results
    await page.waitForSelector('[data-testid="video-result"]', { 
      timeout: 30000,
      state: 'visible' 
    })
    
    // Check that results are displayed
    const results = page.locator('[data-testid="video-result"]')
    await expect(results).toHaveCount(await results.count())
  })

  test('should display video cards with correct information', async ({ page }) => {
    // Perform a search first
    await page.fill('input[placeholder*="Search"]', 'javascript')
    await page.click('button:has-text("Search")')
    
    // Wait for results
    await page.waitForSelector('[data-testid="video-result"]', { timeout: 30000 })
    
    const firstVideo = page.locator('[data-testid="video-result"]').first()
    
    // Check video card elements
    await expect(firstVideo.locator('img')).toBeVisible() // Thumbnail
    await expect(firstVideo.locator('h3')).toBeVisible() // Title
    await expect(firstVideo.locator('text=/subscribers/')).toBeVisible() // Channel info
    await expect(firstVideo.locator('[data-testid="viral-score"]')).toBeVisible() // Viral score
  })

  test('should open filters panel', async ({ page }) => {
    // Click filter button
    await page.click('button[aria-label*="filter"]')
    
    // Check filter options are visible
    await expect(page.locator('text=Sort by')).toBeVisible()
    await expect(page.locator('text=Date Range')).toBeVisible()
    await expect(page.locator('text=Subscriber Count')).toBeVisible()
    await expect(page.locator('text=View Count')).toBeVisible()
  })

  test('should save a video when logged in', async ({ page }) => {
    // Mock authentication
    await page.evaluate(() => {
      window.localStorage.setItem('auth-token', 'mock-token')
    })
    
    // Perform search
    await page.fill('input[placeholder*="Search"]', 'react')
    await page.click('button:has-text("Search")')
    
    // Wait for results
    await page.waitForSelector('[data-testid="video-result"]')
    
    // Click save button on first video
    const saveButton = page.locator('[data-testid="save-video-button"]').first()
    await saveButton.click()
    
    // Check for success message or saved state
    await expect(page.locator('text=Saved')).toBeVisible({ timeout: 5000 })
  })

  test('should load more results', async ({ page }) => {
    // Perform search
    await page.fill('input[placeholder*="Search"]', 'programming')
    await page.click('button:has-text("Search")')
    
    // Wait for initial results
    await page.waitForSelector('[data-testid="video-result"]')
    
    // Count initial results
    const initialCount = await page.locator('[data-testid="video-result"]').count()
    
    // Scroll to bottom and click load more
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.click('button:has-text("Load More")')
    
    // Wait for more results
    await page.waitForTimeout(2000)
    
    // Check that more results were loaded
    const newCount = await page.locator('[data-testid="video-result"]').count()
    expect(newCount).toBeGreaterThan(initialCount)
  })

  test('should handle no results gracefully', async ({ page }) => {
    // Search for something unlikely to return results
    await page.fill('input[placeholder*="Search"]', 'xyzabcdef123456789')
    await page.click('button:has-text("Search")')
    
    // Wait for loading to finish
    await page.waitForSelector('text=No videos found', { timeout: 30000 })
    
    // Check empty state is displayed
    await expect(page.locator('text=No videos found')).toBeVisible()
    await expect(page.locator('text=Try adjusting your search')).toBeVisible()
  })

  test('should display error message on API failure', async ({ page }) => {
    // Intercept API call and make it fail
    await page.route('**/api/youtube/search*', route => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Internal server error' })
      })
    })
    
    // Perform search
    await page.fill('input[placeholder*="Search"]', 'test')
    await page.click('button:has-text("Search")')
    
    // Check for error message
    await expect(page.locator('text=Failed to search videos')).toBeVisible({ timeout: 10000 })
  })
})