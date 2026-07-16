import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

const environment = process.env.ENV || 'dev';

// Carga primero .env.dev y luego .env como respaldo.
dotenv.config({ path: path.resolve(__dirname, `.env.${environment}`), quiet: true });
dotenv.config({ path: path.resolve(__dirname, '.env'), quiet: true });

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: process.env.BASE_URL,
    extraHTTPHeaders: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      'X-GitHub-Api-Version': '2022-11-28'
    },
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'api'
    }
  ]
});
