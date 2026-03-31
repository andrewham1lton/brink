import { defineConfig } from '@playwright/test'

export default defineConfig({
  reporter: [['html', { open: 'never' }]],
  testDir: './tests',
  timeout: 30_000,
  use: {
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
  },
})
