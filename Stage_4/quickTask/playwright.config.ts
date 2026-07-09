// auto_api_testing_stage4/playwright.config.ts

import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Aquí cargo las variables de entorno desde el archivo .env.
// Esto permite que la BASE_URL no quede quemada directamente dentro del código.
dotenv.config({
    path: path.resolve(__dirname, '.env')
});

const baseURL = process.env.BASE_URL;

console.log('BASE_URL cargada desde el archivo .env:', baseURL);

// Esta validación sirve para detectar rápido si el archivo .env no está configurado.
// Si BASE_URL no existe, el proyecto se detiene con un mensaje claro.
if (!baseURL) {
    throw new Error('No se encontró la variable BASE_URL. Revisa que el archivo .env exista y tenga la URL configurada.');
}

export default defineConfig({
    // Aquí le indico a Playwright dónde están ubicados los tests.
    testDir: './tests',

    // Aquí configuro el reporte HTML para revisar la ejecución de las pruebas.
    reporter: 'html',

    use: {
        // Esta baseURL viene desde el archivo .env.
        // En este proyecto debe ser: https://jsonplaceholder.typicode.com
        baseURL,

        // El trace se activa cuando un test falla y Playwright intenta reintentarlo.
        trace: 'on-first-retry',

        // Estos headers indican que las peticiones y respuestas se manejan como JSON.
        extraHTTPHeaders: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    }
});