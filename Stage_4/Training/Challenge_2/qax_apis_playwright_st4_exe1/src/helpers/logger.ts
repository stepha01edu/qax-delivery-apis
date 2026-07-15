// qax_apis_playwright_st4_exe1/src/helpers/logger.ts

import { test } from '@playwright/test';

export class Logger {

    // este metodo crea un paso visible en el reporte HTML de Playwright
    // static permite usarlo como Logger.step() sin crear un objeto Logger
    static async step<T>(name: string, callback: () => Promise<T>): Promise<T> {
        return await test.step(name, async () => {
            console.log(`\n[PASO] >>> ${name}`);

            return await callback();
        });
    }

    // este metodo imprime la informacion del request antes de enviarlo
    static request(method: string, url: string, body?: any): void {
        console.log(`\nREQUEST [${method}]`);
        console.log(`URL: ${url}`);

        if (body) {
            console.log('Body enviado:');
            console.log(JSON.stringify(body, null, 2));
        }
    }

    // este metodo imprime la informacion del response recibido desde la API
    static response(status: number, body: any): void {
        console.log('\nRESPONSE');
        console.log(`Status: ${status}`);
        console.log('Body recibido:');

        const bodyAsText = JSON.stringify(body, null, 2);

        console.log(bodyAsText.length > 1000 ? bodyAsText.substring(0, 1000) + '...' : bodyAsText);
        console.log('--------------------------------------------------');
    }
}