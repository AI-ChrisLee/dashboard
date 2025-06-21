import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/auth/login')
    
    // Check page elements
    await expect(page.locator('h1')).toContainText('Sign In')
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.locator('button:has-text("Sign In")')).toBeVisible()
    
    // Check social login buttons
    await expect(page.locator('button:has-text("Continue with Google")')).toBeVisible()
    await expect(page.locator('button:has-text("Continue with GitHub")')).toBeVisible()
    await expect(page.locator('button:has-text("Continue with Discord")')).toBeVisible()
    
    // Check sign up link
    await expect(page.locator('text=Don\'t have an account?')).toBeVisible()
  })

  test('should display signup page', async ({ page }) => {
    await page.goto('/auth/signup')
    
    // Check page elements
    await expect(page.locator('h1')).toContainText('Create an account')
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.locator('button:has-text("Sign Up")')).toBeVisible()
    
    // Check login link
    await expect(page.locator('text=Already have an account?')).toBeVisible()
  })

  test('should navigate between login and signup', async ({ page }) => {
    await page.goto('/auth/login')
    
    // Click sign up link
    await page.click('text=Sign up')
    await expect(page).toHaveURL('/auth/signup')
    
    // Click login link
    await page.click('text=Sign in')
    await expect(page).toHaveURL('/auth/login')
  })

  test('should show validation errors', async ({ page }) => {
    await page.goto('/auth/login')
    
    // Try to submit empty form
    await page.click('button:has-text("Sign In")')
    
    // Check for validation messages
    await expect(page.locator('text=required')).toBeVisible()
  })

  test('should handle login errors', async ({ page }) => {
    await page.goto('/auth/login')
    
    // Fill in invalid credentials
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'wrongpassword')
    
    // Mock API to return error
    await page.route('**/auth/v1/token*', route => {
      route.fulfill({
        status: 400,
        body: JSON.stringify({ error: 'Invalid credentials' })
      })
    })
    
    // Submit form
    await page.click('button:has-text("Sign In")')
    
    // Check for error message
    await expect(page.locator('text=Invalid credentials')).toBeVisible()
  })

  test('should redirect to dashboard after successful login', async ({ page }) => {
    await page.goto('/auth/login')
    
    // Fill in credentials
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'password123')
    
    // Mock successful login
    await page.route('**/auth/v1/token*', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          access_token: 'mock-token',
          user: { id: 'user-123', email: 'test@example.com' }
        })
      })
    })
    
    // Submit form
    await page.click('button:has-text("Sign In")')
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard')
  })

  test('should protect authenticated routes', async ({ page }) => {
    // Try to access protected route without auth
    await page.goto('/saved')
    
    // Should redirect to login
    await expect(page).toHaveURL(/\/auth\/login/)
  })

  test('should show user menu when authenticated', async ({ page }) => {
    // Mock authentication
    await page.addInitScript(() => {
      window.localStorage.setItem('sb-auth-token', JSON.stringify({
        access_token: 'mock-token',
        user: { id: 'user-123', email: 'test@example.com' }
      }))
    })
    
    await page.goto('/dashboard')
    
    // User avatar should be visible
    await expect(page.locator('[data-testid="user-menu-button"]')).toBeVisible()
    
    // Click to open menu
    await page.click('[data-testid="user-menu-button"]')
    
    // Check menu items
    await expect(page.locator('text=Profile')).toBeVisible()
    await expect(page.locator('text=Saved Videos')).toBeVisible()
    await expect(page.locator('text=Settings')).toBeVisible()
    await expect(page.locator('text=Sign Out')).toBeVisible()
  })

  test('should handle logout', async ({ page }) => {
    // Mock authentication
    await page.addInitScript(() => {
      window.localStorage.setItem('sb-auth-token', JSON.stringify({
        access_token: 'mock-token',
        user: { id: 'user-123', email: 'test@example.com' }
      }))
    })
    
    await page.goto('/dashboard')
    
    // Open user menu
    await page.click('[data-testid="user-menu-button"]')
    
    // Click logout
    await page.click('text=Sign Out')
    
    // Should redirect to home
    await expect(page).toHaveURL('/')
    
    // User menu should not be visible
    await expect(page.locator('[data-testid="user-menu-button"]')).not.toBeVisible()
  })
})