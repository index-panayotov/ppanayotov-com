/**
 * Playwright Configuration for Performance Testing
 *
 * Optimized configuration for running performance tests:
 * - Multiple browser contexts for comprehensive testing
 * - Network throttling for realistic conditions
 * - Performance tracing enabled
 * - Custom viewport sizes for responsive testing
 */

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './__tests__',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/performance-results.json' }],
    ['junit', { outputFile: 'test-results/performance-results.xml' }]
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'performance-desktop',
      use: {
        ...devices['Desktop Chrome'],
        // Simulate realistic network conditions
        launchOptions: {
          args: [
            '--enable-features=VaapiVideoDecoder',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-renderer-backgrounding'
          ]
        }
      },
      testMatch: '**/*performance*.test.ts'
    },

    {
      name: 'performance-mobile',
      use: {
        ...devices['Pixel 5'],
        // Mobile network simulation
        launchOptions: {
          args: [
            '--enable-features=VaapiVideoDecoder',
            '--disable-background-timer-throttling'
          ]
        }
      },
      testMatch: '**/*performance*.test.ts'
    },

    {
      name: 'performance-slow-network',
      use: {
        ...devices['Desktop Chrome'],
        // Simulate slow 3G network
        contextOptions: {
          // This will be handled in test setup
        }
      },
      testMatch: '**/*performance*.test.ts'
    }
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // 2 minutes
  },
});

// Network condition presets
export const NETWORK_CONDITIONS = {
  'slow-3g': {
    downloadThroughput: 500 * 1024 / 8, // 500 kbps
    uploadThroughput: 500 * 1024 / 8,
    latency: 400 // 400ms
  },
  'fast-3g': {
    downloadThroughput: 1.6 * 1024 * 1024 / 8, // 1.6 Mbps
    uploadThroughput: 750 * 1024 / 8,
    latency: 150
  },
  'wifi': {
    downloadThroughput: 30 * 1024 * 1024 / 8, // 30 Mbps
    uploadThroughput: 15 * 1024 * 1024 / 8,
    latency: 28
  }
};