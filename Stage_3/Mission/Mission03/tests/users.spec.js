const { test, expect } = require('@playwright/test');
const { GithubUserService } = require('../src/services/githubUserService');

test.describe('Mission 3 - GitHub Users API', () => {

    const githubUsername = process.env.GITHUB_USERNAME;

    // Historia 1 - Consultar información de usuario:-------------------------------------

    test('CP01 - Consultar información de usuario @smoke @regression', async ({ request }) => {
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

        // 6. Validamos que login exista, sea string y no venga vacío
        expect(responseBody.login).toBeDefined();
        expect(typeof responseBody.login).toBe('string');
        expect(responseBody.login.length).toBeGreaterThan(0);

        // 7. Validamos que id sea number y mayor a 0
        expect(responseBody.id).toBeDefined();
        expect(typeof responseBody.id).toBe('number');
        expect(responseBody.id).toBeGreaterThan(0);

        // 8. Validamos avatar_url
        expect(responseBody.avatar_url).toBeDefined();
        expect(typeof responseBody.avatar_url).toBe('string');
        expect(responseBody.avatar_url.startsWith('https://')).toBeTruthy();

        // 9. Validamos repos_url
        expect(responseBody.repos_url).toBeDefined();
        expect(typeof responseBody.repos_url).toBe('string');
        expect(responseBody.repos_url.startsWith('https://')).toBeTruthy();

        // 10. Validamos type
        expect(responseBody.type).toBeDefined();
        expect(typeof responseBody.type).toBe('string');
    });

    // Negative Testing - Usuario inexistente:-------------------------------------

    test('CP02 - Consultar usuario inexistente debe retornar 404 @regression', async ({ request }) => {
        // 1. Creamos el service de usuarios
        const userService = new GithubUserService(request);

        // 2. Consultamos un usuario que no debería existir
        const response = await userService.getUser('usuario-inexistente-qax-123456789');

        // 3. Validamos que GitHub responda 404
        expect(response.status()).toBe(404);

        // 4. Leemos el JSON de la respuesta
        const responseBody = await response.json();

        // 5. Mostramos la respuesta para revisar el mensaje de error
        console.log('Respuesta usuario inexistente:', responseBody);

        // 6. Validamos que venga mensaje de error
        expect(responseBody.message).toBeDefined();
    });
});
