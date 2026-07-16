import { test, expect, request as playwrightRequest } from '@playwright/test';
import { RepoService } from '../src/services/repo.service';
import { IssueService } from '../src/services/issue.service';
import { EnvHelper } from '../src/helpers/env.helper';
import { Logger } from '../src/helpers/logger.helper';
import { RepoBuilder } from '../src/builders/repo.builder';
import { IssueBuilder } from '../src/builders/issue.builder';
import { CreateRepoRequest } from '../src/types/repo.types';
import { CreateIssueRequest, IssueResponse, SearchIssuesResponse } from '../src/types/issue.types';

test.describe.serial('GitHub API - Issues', () => {

    const env = EnvHelper.getConfig();

    let repoName: string;
    let issueData: CreateIssueRequest;

    // Precondición - Crear repositorio para issues:-------------------------------------

    test('CP01 - Crear repositorio para pruebas de issues @e2e @regression', async ({ request }) => {
        const repoService = new RepoService(request);

        let repoData = {} as CreateRepoRequest;

        await test.step('Crear data dinámica para el repositorio', async () => {
            Logger.step('Crear data dinámica para repo de issues');

            // 1. Creamos data para el repositorio
            repoData = RepoBuilder.createRepo();

            console.log('Data repo para issues:', repoData);
        });

        await test.step('Crear repositorio donde se probarán los issues', async () => {
            Logger.step('Crear repositorio para issues');

            // 1. Creamos un repo porque los issues necesitan un repo existente
            const response = await repoService.createRepo(repoData);

            // 2. Validamos que se creó correctamente
            expect(response.status()).toBe(201);

            // 3. Leemos la respuesta
            const responseBody = await response.json();

            // 4. Guardamos el nombre del repo
            repoName = responseBody.name;

            console.log('Repositorio para issues:', repoName);
        });
    });

    // Historia de Usuario 3 - Listar issues:-------------------------------------

    test('CP02 - Listar issues del repositorio @e2e @regression', async ({ request }) => {
        const issueService = new IssueService(request);

        await test.step('Consultar issues del repositorio creado', async () => {
            Logger.step('Listar issues del repositorio');

            // 1. Consultamos los issues del repositorio
            const response = await issueService.listIssues(env.githubUsername, repoName);

            // 2. Validamos el Status Code
            expect(response.status()).toBe(200);

            // 3. Leemos el JSON de la respuesta
            const responseBody: IssueResponse[] = await response.json();

            // 4. Mostramos la lista de issues
            console.log('Issues del repositorio:', responseBody);

            // 5. Validamos que la respuesta sea una lista
            expect(Array.isArray(responseBody)).toBeTruthy();
        });
    });

    // Historia de Usuario 3 - Crear issue:-------------------------------------

    test('CP03 - Crear issue en el repositorio @e2e @regression', async ({ request }) => {
        const issueService = new IssueService(request);

        let responseBody = {} as IssueResponse;

        await test.step('Crear data dinámica para el issue', async () => {
            Logger.step('Crear data dinámica para issue');

            // 1. Creamos el body usando el builder
            issueData = IssueBuilder.createIssue();

            console.log('Data issue:', issueData);
        });

        await test.step('Crear issue usando GitHub API', async () => {
            Logger.step('Crear issue');

            // 1. Creamos el issue dentro del repo
            const response = await issueService.createIssue(env.githubUsername, repoName, issueData);

            // 2. Validamos el Status Code
            expect(response.status()).toBe(201);

            // 3. Leemos el JSON de la respuesta
            responseBody = await response.json();

            // 4. Mostramos el issue creado
            console.log('Issue creado:', responseBody);
        });

        await test.step('Validar datos principales del issue creado', async () => {
            // 1. Validamos datos principales
            expect(responseBody.id).toBeGreaterThan(0);
            expect(responseBody.number).toBeGreaterThan(0);
            expect(responseBody.title).toBe(issueData.title);
            expect(responseBody.body).toBe(issueData.body);
            expect(responseBody.state).toBe('open');
        });
    });

    // Nuevo módulo - Search issues:-------------------------------------

    test('CP04 - Buscar issues por query @e2e @regression', async ({ request }) => {
        const issueService = new IssueService(request);

        await test.step('Buscar issues usando endpoint search/issues', async () => {
            Logger.step('Buscar issues por query');

            // 1. Armamos el query para buscar issues del repositorio
            const query = `repo:${env.githubUsername}/${repoName}`;

            // 2. Ejecutamos la búsqueda
            const response = await issueService.searchIssues(query);

            // 3. Validamos el Status Code
            expect(response.status()).toBe(200);

            // 4. Leemos la respuesta
            const responseBody: SearchIssuesResponse = await response.json();

            // 5. Mostramos la respuesta
            console.log('Resultado búsqueda issues:', responseBody);

            // 6. Validamos que la búsqueda responda correctamente
            expect(responseBody.total_count).toBeGreaterThanOrEqual(0);
            expect(Array.isArray(responseBody.items)).toBeTruthy();
        });
    });

    // Negative Testing - Crear issue sin token:-------------------------------------

    test('CP05 - Crear issue sin token debe retornar 401 @regression', async () => {
        await test.step('Intentar crear issue sin Authorization Bearer', async () => {
            Logger.step('Crear issue sin token');

            // 1. Creamos un contexto nuevo sin Authorization Bearer
            const requestWithoutToken = await playwrightRequest.newContext({
                baseURL: env.baseUrl,
                extraHTTPHeaders: {
                    Accept: 'application/vnd.github+json',
                    'X-GitHub-Api-Version': '2022-11-28'
                }
            });

            // 2. Creamos data para el issue
            const issueDataWithoutToken = IssueBuilder.createIssue();

            // 3. Intentamos crear un issue sin token
            const response = await requestWithoutToken.post(`/repos/${env.githubUsername}/${repoName}/issues`, {
                data: issueDataWithoutToken
            });

            // 4. Validamos que GitHub rechace la petición
            expect(response.status()).toBe(401);

            // 5. Leemos la respuesta de error
            const responseBody = await response.json() as { message: string };

            // 6. Mostramos el error
            console.log('Respuesta crear issue sin token:', responseBody);

            // 7. Validamos que exista mensaje de error
            expect(responseBody.message).toBeDefined();

            // 8. Cerramos el contexto creado manualmente
            await requestWithoutToken.dispose();
        });
    });
});
