const { test, expect, request: playwrightRequest } = require('@playwright/test');
const { GithubRepoService } = require('../src/services/githubRepoService');
const { GithubIssueService } = require('../src/services/githubIssueService');
const { createRepoModel } = require('../src/models/repoModel');
const { createIssueModel } = require('../src/models/issueModel');

test.describe.serial('Mission 3 - GitHub Issues API', () => {

    const githubUsername = process.env.GITHUB_USERNAME;

    let repoName;
    let issueData;

    // Precondición - Crear repositorio para probar issues:-------------------------------------

    test('CP01 - Crear repositorio para pruebas de issues @e2e @regression', async ({ request }) => {
        // 1. Creamos el service de repositorios
        const repoService = new GithubRepoService(request);

        // 2. Creamos un repositorio porque los issues necesitan un repo existente
        const repoData = createRepoModel();

        // 3. Hacemos la petición POST para crear el repo
        const response = await repoService.createRepo(repoData);

        // 4. Validamos que el repo fue creado
        expect(response.status()).toBe(201);

        // 5. Leemos la respuesta
        const responseBody = await response.json();

        // 6. Guardamos el nombre del repo para usarlo en issues
        repoName = responseBody.name;

        console.log('Repositorio creado para issues:', repoName);
    });

    // Issues - Listar issues:-------------------------------------

    test('CP02 - Listar issues del repositorio @e2e @regression', async ({ request }) => {
        // 1. Creamos el service de issues
        const issueService = new GithubIssueService(request);

        // 2. Consultamos los issues del repositorio creado
        const response = await issueService.listIssues(githubUsername, repoName);

        // 3. Validamos el Status Code
        expect(response.status()).toBe(200);

        // 4. Leemos la respuesta
        const responseBody = await response.json();

        // 5. Mostramos la lista de issues
        console.log('Issues del repositorio:', responseBody);

        // 6. Validamos que la respuesta sea una lista
        expect(Array.isArray(responseBody)).toBeTruthy();
    });

    // Issues - Crear issue:-------------------------------------

    test('CP03 - Crear issue en el repositorio @e2e @regression', async ({ request }) => {
        // 1. Creamos el service de issues
        const issueService = new GithubIssueService(request);

        // 2. Creamos el body del issue usando el modelo
        issueData = createIssueModel();

        // 3. Hacemos la petición POST para crear el issue
        const response = await issueService.createIssue(githubUsername, repoName, issueData);

        // 4. Validamos el Status Code
        expect(response.status()).toBe(201);

        // 5. Leemos el JSON de la respuesta
        const responseBody = await response.json();

        // 6. Mostramos el issue creado
        console.log('Issue creado:', responseBody);

        // 7. Validamos los datos principales del issue
        expect(responseBody.id).toBeGreaterThan(0);
        expect(responseBody.number).toBeGreaterThan(0);
        expect(responseBody.title).toBe(issueData.title);
        expect(responseBody.body).toBe(issueData.body);
        expect(responseBody.state).toBe('open');
    });

    // Negative Testing - Crear issue sin token:-------------------------------------

    test('CP04 - Crear issue sin token debe retornar 401 @regression', async () => {
        // 1. Creamos un contexto nuevo sin Authorization Bearer
        const requestWithoutToken = await playwrightRequest.newContext({
            baseURL: process.env.BASE_URL,
            extraHTTPHeaders: {
                Accept: 'application/vnd.github+json',
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });

        // 2. Creamos data para el issue
        const issueDataWithoutToken = createIssueModel();

        // 3. Intentamos crear un issue sin token
        const response = await requestWithoutToken.post(`/repos/${githubUsername}/${repoName}/issues`, {
            data: issueDataWithoutToken
        });

        // 4. Validamos que GitHub rechace la petición
        expect(response.status()).toBe(401);

        // 5. Leemos la respuesta de error
        const responseBody = await response.json();

        // 6. Mostramos el error
        console.log('Respuesta crear issue sin token:', responseBody);

        // 7. Validamos que exista mensaje de error
        expect(responseBody.message).toBeDefined();

        // 8. Cerramos el contexto creado manualmente
        await requestWithoutToken.dispose();
    });
});
