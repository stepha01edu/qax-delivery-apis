// @ts-check
import { defineConfig, devices } from '@playwright/test';
const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '.env')
});

console.log('BASE_URL cargada:', process.env.BASE_URL);

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });



module.exports = {
  testDir: './tests',

  reporter: 'html',

  use: {
    baseURL: process.env.BASE_URL,
    trace: 'on-first-retry',
    extraHTTPHeaders: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  }
};

