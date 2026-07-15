// qax_apis_playwright_st4_exe2/src/helpers/apiHelper.ts

import { APIRequestContext, APIResponse } from '@playwright/test';
import { Logger } from './logger';

export class ApiHelper {

    // herramienta que permite consumir la API desde Playwright
    private request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    // convierte la respuesta a JSON.
    // si la API responde texto, lo devuelve como message.
    private async parseResponseBody(response: APIResponse): Promise<any> {
        const responseText = await response.text();

        try {
            return JSON.parse(responseText);
        } catch {
            console.log('La respuesta no vino en formato JSON. El texto recibido fue:', responseText);

            return {
                message: responseText
            };
        }
    }

    // metodo generico para POST
    async post(url: string, data: any, headers?: Record<string, string>) {
        return await Logger.step(`POST ${url}`, async () => {
            Logger.request('POST', url, data);

            const response = await this.request.post(url, {
                headers,
                data
            });

            const body = await this.parseResponseBody(response);

            Logger.response(response.status(), body);

            return {
                status: response.status(),
                body
            };
        });
    }

    // metodo generico para GET
    async get(url: string, headers?: Record<string, string>) {
        return await Logger.step(`GET ${url}`, async () => {
            Logger.request('GET', url);

            const response = await this.request.get(url, {
                headers
            });

            const body = await this.parseResponseBody(response);

            Logger.response(response.status(), body);

            return {
                status: response.status(),
                body
            };
        });
    }
}