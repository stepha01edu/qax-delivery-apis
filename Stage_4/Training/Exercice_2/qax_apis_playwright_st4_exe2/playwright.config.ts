// auto_api_testing_stage4/playwright.config.ts

import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// cargo las variables de entorno desde el archivo .env
dotenv.config({
    path: path.resolve(__dirname, '.env')
});

const baseURL = process.env.BASE_URL;
const apiKey = process.env.API_KEY;

console.log('BASE_URL cargada desde el archivo .env:', baseURL);
console.log('API_KEY cargada desde el archivo .env:', apiKey ? 'API key encontrada' : 'API key no encontrada');

if (!baseURL) {
    throw new Error('No se encontro la variable BASE_URL. Revisa que el archivo .env tenga la URL configurada.');
}

if (!apiKey) {
    throw new Error('No se encontro la variable API_KEY. Revisa que el archivo .env tenga el API key configurado.');
}

export default defineConfig({
    testDir: './tests',

    reporter: 'html',

    use: {
        baseURL,

        trace: 'on-first-retry',

        extraHTTPHeaders: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    }
});