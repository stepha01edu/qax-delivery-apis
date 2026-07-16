import { APIRequestContext, APIResponse } from '@playwright/test';
import { Logger } from './logger.helper';

// Helper para centralizar los requests HTTP:-------------------------------------

export class ApiHelper {
    private request: APIRequestContext;

    // Constructor del helper:-------------------------------------

    constructor(request: APIRequestContext) {
        // 1. Guardamos el request de Playwright para usarlo en los métodos
        this.request = request;
    }

    // Método GET:-------------------------------------

    async get(endpoint: string): Promise<APIResponse> {
        // 1. Mostramos en consola el request que se va a ejecutar
        Logger.request('GET', endpoint);

        // 2. Ejecutamos la petición GET
        const response = await this.request.get(endpoint);

        // 3. Mostramos el status code de la respuesta
        Logger.response(response.status());

        // 4. Retornamos la respuesta para que el test la valide
        return response;
    }

    // Método POST:-------------------------------------

    async post(endpoint: string, data?: unknown): Promise<APIResponse> {
        // 1. Mostramos en consola el request que se va a ejecutar
        Logger.request('POST', endpoint, data);

        // 2. Ejecutamos la petición POST enviando el body
        const response = await this.request.post(endpoint, {
            data
        });

        // 3. Mostramos el status code de la respuesta
        Logger.response(response.status());

        // 4. Retornamos la respuesta para que el test la valide
        return response;
    }

    // Método PATCH:-------------------------------------

    async patch(endpoint: string, data?: unknown): Promise<APIResponse> {
        // 1. Mostramos en consola el request que se va a ejecutar
        Logger.request('PATCH', endpoint, data);

        // 2. Ejecutamos la petición PATCH enviando el body
        const response = await this.request.patch(endpoint, {
            data
        });

        // 3. Mostramos el status code de la respuesta
        Logger.response(response.status());

        // 4. Retornamos la respuesta para que el test la valide
        return response;
    }
}