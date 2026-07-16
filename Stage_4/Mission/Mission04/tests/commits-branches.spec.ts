import { test, expect } from '@playwright/test';
import { RepoService } from '../src/services/repo.service';
import { CommitService } from '../src/services/commit.service';
import { BranchService } from '../src/services/branch.service';
import { ContributorService } from '../src/services/contributor.service';
import { EnvHelper } from '../src/helpers/env.helper';
import { Logger } from '../src/helpers/logger.helper';
import { RepoBuilder } from '../src/builders/repo.builder';
import { BranchBuilder } from '../src/builders/branch.builder';
import { BranchResponse, CreateBranchResponse } from '../src/types/branch.types';
import { CommitResponse } from '../src/types/commit.types';
import { ContributorResponse } from '../src/types/contributor.types';

test.describe.serial('GitHub API - Commits and Branches', () => {

    const env = EnvHelper.getConfig();

    let repoName: string;
    let mainBranchSha = '';
    let newBranchName = '';

    // Precondición - Crear repositorio para commits y ramas:-------------------------------------

    test('CP01 - Crear repositorio para commits y ramas @e2e @regression', async ({ request }) => {
        const repoService = new RepoService(request);

        await test.step('Crear repositorio para probar commits y ramas', async () => {
            Logger.step('Crear repositorio para commits y ramas');

            // 1. Creamos data dinámica para el repositorio
            const repoData = RepoBuilder.createRepo();

            // 2. Creamos el repositorio
            const response = await repoService.createRepo(repoData);

            // 3. Validamos el Status Code
            expect(response.status()).toBe(201);

            // 4. Leemos la respuesta
            const responseBody = await response.json();

            // 5. Guardamos el nombre del repo
            repoName = responseBody.name;

            console.log('Repositorio para commits y ramas:', repoName);
        });
    });

    // Nuevo módulo - Branches:-------------------------------------

    test('CP02 - Listar ramas del repositorio @e2e @regression', async ({ request }) => {
        const branchService = new BranchService(request);

        let responseBody: BranchResponse[] = [];

        await test.step('Consultar ramas del repositorio', async () => {
            Logger.step('Listar ramas');

            // 1. Esperamos un momento porque GitHub puede tardar en publicar la rama inicial
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // 2. Consultamos las ramas del repo
            const response = await branchService.listBranches(env.githubUsername, repoName);

            // 3. Validamos el Status Code
            expect(response.status()).toBe(200);

            // 4. Leemos la respuesta
            responseBody = await response.json();

            // 5. Mostramos las ramas
            console.log('Ramas del repositorio:', responseBody);

            // 6. Validamos que la respuesta sea una lista
            expect(Array.isArray(responseBody)).toBeTruthy();
        });

        await test.step('Guardar SHA de la rama principal', async () => {
            // 1. Validamos que exista al menos una rama
            expect(responseBody.length).toBeGreaterThan(0);

            // 2. Guardamos el SHA de la primera rama para crear una nueva rama
            mainBranchSha = responseBody[0].commit.sha;

            expect(mainBranchSha).toBeTruthy();

            console.log('SHA base para nueva rama:', mainBranchSha);
        });
    });

    // Nuevo módulo - Crear rama vía API:-------------------------------------

    test('CP03 - Crear rama vía API usando git refs @e2e @regression', async ({ request }) => {
        const branchService = new BranchService(request);

        let responseBody = {} as CreateBranchResponse;

        await test.step('Crear data para nueva rama', async () => {
            Logger.step('Crear data para rama nueva');

            // 1. Creamos nombre dinámico para la nueva rama
            newBranchName = BranchBuilder.createBranchName();

            console.log('Nombre nueva rama:', newBranchName);
        });

        await test.step('Crear rama usando endpoint git refs', async () => {
            Logger.step('Crear rama vía API');

            // 1. Armamos el body con el nombre de la rama y el SHA base
            const branchData = BranchBuilder.createBranchRef(newBranchName, mainBranchSha);

            // 2. Creamos la rama vía API
            const response = await branchService.createBranch(env.githubUsername, repoName, branchData);

            // 3. Validamos el Status Code
            expect(response.status()).toBe(201);

            // 4. Leemos la respuesta
            responseBody = await response.json();

            // 5. Mostramos la rama creada
            console.log('Rama creada:', responseBody);
        });

        await test.step('Validar rama creada', async () => {
            // 1. Validamos que la referencia contenga el nombre de la rama
            expect(responseBody.ref).toContain(newBranchName);

            // 2. Validamos que el SHA sea el mismo usado como base
            expect(responseBody.object.sha).toBe(mainBranchSha);
        });
    });

    // Nuevo módulo - Commits:-------------------------------------

    test('CP04 - Consultar commits del repositorio @e2e @regression', async ({ request }) => {
        const commitService = new CommitService(request);

        await test.step('Consultar commits del repositorio', async () => {
            Logger.step('Consultar commits');

            // 1. Consultamos los commits del repo
            const response = await commitService.listCommits(env.githubUsername, repoName);

            // 2. Validamos el Status Code
            expect(response.status()).toBe(200);

            // 3. Leemos la respuesta
            const responseBody: CommitResponse[] = await response.json();

            // 4. Mostramos los commits
            console.log('Commits del repositorio:', responseBody);

            // 5. Validamos que la respuesta sea una lista
            expect(Array.isArray(responseBody)).toBeTruthy();
            expect(responseBody.length).toBeGreaterThan(0);
        });
    });

    // Nuevo módulo - Contributors:-------------------------------------

    test('CP05 - Consultar contribuidores del repositorio @e2e @regression', async ({ request }) => {
        const contributorService = new ContributorService(request);

        await test.step('Consultar contribuidores del repositorio', async () => {
            Logger.step('Consultar contribuidores');

            // 1. Consultamos los contribuidores del repo
            const response = await contributorService.listContributors(env.githubUsername, repoName);

            // 2. Validamos el Status Code
            expect(response.status()).toBe(200);

            // 3. Leemos la respuesta
            const responseBody: ContributorResponse[] = await response.json();

            // 4. Mostramos los contribuidores
            console.log('Contribuidores del repositorio:', responseBody);

            // 5. Validamos que la respuesta sea una lista
            expect(Array.isArray(responseBody)).toBeTruthy();
        });
    });
});
