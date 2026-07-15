// @ts-check
const { defineConfig } = require('@playwright/test');
require('dotenv').config({ path: `.env.${process.env.ENV || 'dev'}` });

module.exports = defineConfig({
  testDir: './tests',
  reporter: 'html',
  use: {
    baseURL: process.env.BASE_URL,
    extraHTTPHeaders: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      'X-GitHub-Api-Version': '2022-11-28'
    }
  }
});