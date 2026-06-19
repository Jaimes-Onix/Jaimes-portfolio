import { defineConfig, devices } from '@playwright/test'

const PORT = 4173
const useDeployed = !!process.env.PORTFOLIO_URL

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  reporter: [['list']],
  timeout: 90_000,
  use: {
    baseURL: process.env.PORTFOLIO_URL || `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },
  // When testing the local build, start the preview server automatically.
  webServer: useDeployed
    ? undefined
    : {
        command: 'npm run preview',
        url: `http://localhost:${PORT}`,
        reuseExistingServer: true,
        timeout: 60_000,
      },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
})
