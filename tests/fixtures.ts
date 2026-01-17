import { test as base } from '@playwright/test'

type ElectronAPIFixtures = {
  mockElectronAPI: () => void
}

export const test = base.extend<ElectronAPIFixtures>({
  mockElectronAPI: async ({ page }, use) => {
    await page.addInitScript(() => {
      ;(window as any).electronAPI = {
        ddev: {
          list: async () => ({
            success: true,
            data: [
              {
                name: 'test-project-1',
                type: 'drupal',
                status: 'running',
                approot: '/home/user/test-project-1',
                docroot: 'web',
                httpurl: 'http://test-project-1.ddev.site',
                httpsurl: 'https://test-project-1.ddev.site',
                mutagen_enabled: false,
                router_status: 'healthy',
              },
              {
                name: 'test-project-2',
                type: 'wordpress',
                status: 'stopped',
                approot: '/home/user/test-project-2',
                docroot: 'wp',
                httpurl: 'http://test-project-2.ddev.site',
                httpsurl: 'https://test-project-2.ddev.site',
                mutagen_enabled: true,
                router_status: 'healthy',
              },
              {
                name: 'test-project-3',
                type: 'laravel',
                status: 'running',
                approot: '/home/user/test-project-3',
                docroot: 'public',
                httpurl: 'http://test-project-3.ddev.site',
                httpsurl: 'https://test-project-3.ddev.site',
                mutagen_enabled: false,
                router_status: 'healthy',
              },
            ],
          }),
          describe: async () => ({
            success: true,
            data: {
              docroot: 'web',
              webserver_type: 'nginx-fpm',
              router_status: 'healthy',
              mutagen_enabled: false,
              php_version: '8.2',
              nodejs_version: '18.0',
              database: { type: 'mysql', version: '8.0' },
              urls: [],
            },
          }),
          start: async () => ({ success: true }),
          stop: async () => ({ success: true }),
          restart: async () => ({ success: true }),
          poweroff: async () => ({ success: true }),
        },
        terminal: {
          getOutput: async () => ({
            success: true,
            data: [
              {
                timestamp: new Date().toISOString(),
                output: 'Starting services...',
                type: 'info',
              },
              {
                timestamp: new Date().toISOString(),
                output: 'Services started successfully.',
                type: 'success',
              },
            ],
          }),
          clearOutput: async () => ({ success: true }),
        },
        shell: {
          openExternal: async () => {},
        },
      }
    })
    await use(() => {})
  },
})

export const expect = base.expect
