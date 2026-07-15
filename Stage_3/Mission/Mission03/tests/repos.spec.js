const { test, expect } = require('@playwright/test');
const { GithubRepoService } = require('../src/services/githubRepoService');
const { createRepoModel, updateRepoModel } = require('../src/models/repoModel');

test.describe.serial('Mission 3 - GitHub Repositories API', () => {

    const githubUsername = process.env.GITHUB_USERNAME;

    let repoData;
    let repoName;

    // Repositorios - Crear repositorio:-------------------------------------

    test('CP01 - Crear repositorio correctamente @regression', async ({ request }) => {
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

    test('CP02 - Consultar repositorio creado @regression', async ({ request }) => {
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

    test('CP03 - Actualizar repositorio parcialmente @regression', async ({ request }) => {
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
});