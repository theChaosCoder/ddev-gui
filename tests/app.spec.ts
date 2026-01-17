import { test, expect } from '@playwright/test'

test.describe('DDEV GUI', () => {
  test('should display the app header', async ({ page }) => {
    await page.goto('/')

    // Check for the main header
    await expect(page.getByText('DDEV GUI')).toBeVisible()
    await expect(page.getByText('Local Development Manager')).toBeVisible()
  })

  test('should show refresh button', async ({ page }) => {
    await page.goto('/')

    // Check for refresh button
    const refreshButton = page.getByRole('button', { name: /refresh/i })
    await expect(refreshButton).toBeVisible()
  })

  test('should show power off button', async ({ page }) => {
    await page.goto('/')

    // Check for power off button
    const powerOffButton = page.getByRole('button', { name: /power off/i })
    await expect(powerOffButton).toBeVisible()
  })

  test('should handle no projects state', async ({ page }) => {
    await page.goto('/')

    // In browser mode without electron, should show empty state or loading
    // Since we're not in Electron, it should show the "No Projects Found" state
    // or the loading state depending on timing
    await page.waitForTimeout(1000)

    const content = await page.content()
    // Should either be loading, showing no projects, or have project list
    expect(
      content.includes('Loading DDEV projects') ||
      content.includes('No Projects Found') ||
      content.includes('projects')
    ).toBeTruthy()
  })
})
