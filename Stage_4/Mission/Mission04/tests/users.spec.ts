import { test, expect } from '@playwright/test';
import { UserService } from '../src/services/user.service';
import { EnvHelper } from '../src/helpers/env.helper';
import { Logger } from '../src/helpers/logger.helper';
import { GitHubUserResponse } from '../src/types/user.types';

test.describe('GitHub API - Users', () => {

    const env = EnvHelper.getConfig();

    // Historia de Usuario 1 - Consultar información de usuario:-------------------------------------

    test('CP01 - Consultar información de usuario @smoke @regression', async ({ request }) => {
        const userService = new UserService(request);

        let responseBody = {} as GitHubUserResponse;

        await test.step('Consultar usuario configurado en el archivo .env', async () => {
            Logger.step('Consultar usuario configurado');

            // 1. Consultamos el usuario de GitHub
            const response = await userService.getUser(env.githubUsername);

            // 2. Validamos el Status Code
            expect(response.status()).toBe(200);

            // 3. Leemos el JSON de la respuesta
            responseBody = await response.json();

            // 4. Mostramos la respuesta para debug
            console.log('Usuario consultado:', responseBody);
        });

        await test.step('Validar estructura y reglas básicas del usuario', async () => {
            // 1. Validamos que login sea string y no venga vacío
            expect(responseBody.login).toBeTruthy();
            expect(typeof responseBody.login).toBe('string');

            // 2. Validamos que id sea number y mayor a 0
            expect(responseBody.id).toBeGreaterThan(0);
            expect(typeof responseBody.id).toBe('number');

            // 3. Validamos URLs principales
            expect(responseBody.avatar_url).toContain('https://');
            expect(responseBody.repos_url).toContain('https://');

            // 4. Validamos que type exista
            expect(responseBody.type).toBeDefined();
            expect(typeof responseBody.type).toBe('string');
        });
    });

    // Negative Testing - Usuario inexistente:-------------------------------------

    test('CP02 - Consultar usuario inexistente debe retornar 404 @regression', async ({ request }) => {
        const userService = new UserService(request);

        await test.step('Consultar un usuario que no existe', async () => {
            Logger.step('Consultar usuario inexistente');

            // 1. Consultamos un usuario que no debería existir
            const response = await userService.getUser('usuario-inexistente-qax-123456789');

            // 2. Validamos que GitHub responda 404
            expect(response.status()).toBe(404);

            // 3. Leemos el JSON de la respuesta
            const responseBody = await response.json() as { message: string };

            // 4. Mostramos la respuesta para revisar el mensaje de error
            console.log('Respuesta usuario inexistente:', responseBody);

            // 5. Validamos que venga mensaje de error
            expect(responseBody.message).toBeDefined();
        });
    });
});
