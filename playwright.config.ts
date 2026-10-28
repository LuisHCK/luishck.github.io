import { defineConfig, devices } from '@playwright/test'

const baseURL = process.env.BASE_URL ?? 'http://127.0.0.1:8080'
const useExternalServer = Boolean(process.env.BASE_URL)

export default defineConfig({
    testDir: './tests/e2e',
    fullyParallel: true,
    forbidOnly: Boolean(process.env.CI),
    retries: process.env.CI ? 2 : 0,
    reporter: process.env.CI ? [['github'], ['list']] : 'list',
    globalTeardown: './tests/e2e/global-teardown.ts',
    use: {
        baseURL,
        trace: 'on-first-retry',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
    webServer: useExternalServer
        ? undefined
        : {
              command: 'sh scripts/e2e-server.sh',
              url: baseURL,
              reuseExistingServer: false,
              gracefulShutdown: { signal: 'SIGTERM', timeout: 10_000 },
              timeout: 180_000,
          },
})
