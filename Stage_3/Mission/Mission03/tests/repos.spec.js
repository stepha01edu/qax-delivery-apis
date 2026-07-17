const { test, expect, request: playwrightRequest } = require('@playwright/test');
const { GithubRepoService } = require('../src/services/githubRepoService');
const { createRepoModel, updateRepoModel } = require('../src/models/repoModel');

test.describe.serial('Mission 3 - GitHub Repositories API', () => {

    const githubUsername = process.env.GITHUB_USERNAME;

    let repoData;
    let repoName;

    // Repositorios - Crear repositorio:-------------------------------------

    test('CP01 - Crear repositorio correctamente @e2e @regression', async ({ request }) => {
        // 1. Creamos el service de repositorios
        const repoService = new GithubRepoService(request);

        // 2. Creamos el body usando el modelo
        repoData = createRepoModel();

        // 3. Hacemos la petición POST para crear el repositorio
        const response = await repoService.createRepo(repoData);

        // 4. Validamos el Status Code esperado
        expect(response.status()).toBe(201);

        // 5. Leemos el JSON de la respuesta
        const responseBody = await response.json();

        // 6. Mostramos la respuesta para debug
        console.log('Repositorio creado:', responseBody);

        // 7. Validamos los datos principales del repositorio
        expect(responseBody.id).toBeGreaterThan(0);
        expect(responseBody.name).toBe(repoData.name);
        expect(responseBody.description).toBe(repoData.description);
        expect(responseBody.private).toBe(repoData.private);

        // 8. Guardamos el nombre del repo para usarlo en los siguientes tests
        repoName = responseBody.name;

        console.log('Nombre del repositorio creado:', repoName);
    });

    // Repositorios - Consultar repositorio creado:-------------------------------------

    test('CP02 - Consultar repositorio creado @e2e @regression', async ({ request }) => {
        // 1. Creamos el service de repositorios
        const repoService = new GithubRepoService(request);

        // 2. Consultamos el repositorio usando owner y repoName
        const response = await repoService.getRepo(githubUsername, repoName);

        // 3. Validamos el Status Code
        expect(response.status()).toBe(200);

        // 4. Leemos el JSON de la respuesta
        const responseBody = await response.json();

        // 5. Mostramos la respuesta para revisar la data
        console.log('Repositorio consultado:', responseBody);

        // 6. Validamos que sea el repositorio creado
        expect(responseBody.name).toBe(repoName);
        expect(responseBody.owner.login.toLowerCase()).toBe(githubUsername.toLowerCase());
    });

    // Repositorios - Actualizar repositorio:-------------------------------------

    test('CP03 - Actualizar repositorio parcialmente @e2e @regression', async ({ request }) => {
        // 1. Creamos el service de repositorios
        const repoService = new GithubRepoService(request);

        // 2. Creamos el body para actualizar el repo
        const updateData = updateRepoModel();

        // 3. Hacemos PATCH para actualizar parcialmente el repositorio
        const response = await repoService.updateRepo(githubUsername, repoName, updateData);

        // 4. Validamos el Status Code
        expect(response.status()).toBe(200);

        // 5. Leemos el JSON de la respuesta
        const responseBody = await response.json();

        // 6. Mostramos la respuesta actualizada
        console.log('Repositorio actualizado:', responseBody);

        // 7. Validamos que la descripción haya cambiado
        expect(responseBody.name).toBe(repoName);
        expect(responseBody.description).toBe(updateData.description);
    });

    // Negative Testing - Crear repo con nombre inválido:-------------------------------------

    test('CP04 - Crear repositorio con nombre inválido debe retornar error @regression', async ({ request }) => {
        // 1. Creamos el service de repositorios
        const repoService = new GithubRepoService(request);

        // 2. Creamos un body inválido con name vacío
        const invalidRepoData = {
            name: '',
            description: 'Invalid repo created for negative testing',
            private: false,
            has_issues: true
        };

        // 3. Intentamos crear el repositorio
        const response = await repoService.createRepo(invalidRepoData);

        // 4. Validamos que GitHub rechace la petición
        expect(response.status()).toBe(422);

        // 5. Leemos la respuesta de error
        const responseBody = await response.json();

        // 6. Mostramos el error
        console.log('Respuesta repo inválido:', responseBody);

        // 7. Validamos que exista mensaje de error
        expect(responseBody.message).toBeDefined();
    });

    // Negative Testing - Consultar repo inexistente:-------------------------------------

    test('CP05 - Consultar repositorio inexistente debe retornar 404 @regression', async ({ request }) => {
        // 1. Creamos el service de repositorios
        const repoService = new GithubRepoService(request);

        // 2. Consultamos un repositorio que no existe
        const response = await repoService.getRepo(githubUsername, 'repo-inexistente-qax-123456789');

        // 3. Validamos que GitHub responda 404
        expect(response.status()).toBe(404);

        // 4. Leemos la respuesta de error
        const responseBody = await response.json();

        // 5. Mostramos el error
        console.log('Respuesta repo inexistente:', responseBody);

        // 6. Validamos que exista mensaje de error
        expect(responseBody.message).toBeDefined();
    });

    // Negative Testing - Crear repo sin token:-------------------------------------

    test('CP06 - Crear repositorio sin token debe retornar 401 @regression', async () => {
        // 1. Creamos un contexto nuevo sin Authorization Bearer
        const requestWithoutToken = await playwrightRequest.newContext({
            baseURL: process.env.BASE_URL,
            extraHTTPHeaders: {
                Accept: 'application/vnd.github+json',
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });

        // 2. Creamos un body válido para aislar la validación de autenticación
        const repoDataWithoutToken = createRepoModel();

        // 3. Intentamos crear el repositorio sin token
        const response = await requestWithoutToken.post('/user/repos', {
            data: repoDataWithoutToken
        });

        // 4. Validamos que GitHub rechace la petición por falta de autenticación
        expect(response.status()).toBe(401);

        // 5. Leemos la respuesta de error
        const responseBody = await response.json();

        // 6. Mostramos el error
        console.log('Respuesta crear repo sin token:', responseBody);

        // 7. Validamos que exista mensaje de error
        expect(responseBody.message).toBeDefined();

        // 8. Cerramos el contexto creado manualmente
        await requestWithoutToken.dispose();
    });

    // Escenario no implementado:-------------------------------------

    test.fixme('CP07 - Eliminar repositorio creado @regression', async () => {
        // Este escenario queda marcado como fixme porque DELETE repo es destructivo.
        // Para esta misión no se implementa para evitar borrar información por error.
    });
});
