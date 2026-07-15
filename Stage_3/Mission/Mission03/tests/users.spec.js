const { test, expect } = require('@playwright/test');
const { GithubUserService } = require('../src/services/githubUserService');

test.describe('Mission 3 - GitHub Users API', () => {

    const githubUsername = process.env.GITHUB_USERNAME;

    // Historia 1 - Consultar información de usuario:-------------------------------------

    test('CP01 - Consultar información de usuario @smoke', async ({ request }) => {
        // 1. Creamos el service que se encarga de llamar a la API
        const userService = new GithubUserService(request);

        // 2. Consultamos el usuario configurado en el archivo .env
        const response = await userService.getUser(githubUsername);

        // 3. Validamos el Status Code
        expect(response.status()).toBe(200);

        // 4. Leemos el JSON de la respuesta
        const responseBody = await response.json();

        // 5. Mostramos la respuesta para entender qué devuelve la API
        console.log('Usuario consultado:', responseBody);

        // 6. Validamos las reglas pedidas en la misión
        expect(responseBody.login).toBeTruthy();
        expect(typeof responseBody.login).toBe('string');

        expect(responseBody.id).toBeGreaterThan(0);
        expect(typeof responseBody.id).toBe('number');

        expect(responseBody.avatar_url).toContain('https://');
        expect(responseBody.repos_url).toContain('https://');

        expect(responseBody.type).toBeDefined();
        expect(typeof responseBody.type).toBe('string');
    });
});