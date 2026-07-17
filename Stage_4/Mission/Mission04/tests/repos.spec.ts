import { test, expect } from '@playwright/test';
import { RepoService } from '../src/services/repo.service';
import { EnvHelper } from '../src/helpers/env.helper';
import { Logger } from '../src/helpers/logger.helper';
import { RepoBuilder } from '../src/builders/repo.builder';
import { CreateRepoRequest, RepoResponse, UpdateRepoRequest } from '../src/types/repo.types';

test.describe.serial('GitHub API - Repositories', () => {

    const env = EnvHelper.getConfig();

    let repoService: RepoService;
    let repoData: CreateRepoRequest;
    let updateData: UpdateRepoRequest;
    let repoName: string;

    // Historia de Usuario 2 - Crear repositorio:-------------------------------------

    test('CP01 - Crear repositorio @smoke @e2e @regression', async ({ request }) => {
        repoService = new RepoService(request);

        let responseBody = {} as RepoResponse;

        await test.step('Crear data dinámica para el repositorio', async () => {
            Logger.step('Crear data dinámica para repositorio');

            // 1. Creamos el body usando el builder
            repoData = RepoBuilder.createRepo();

            console.log('Data del repo:', repoData);
        });

        await test.step('Crear repositorio usando GitHub API', async () => {
            Logger.step('Crear repositorio');

            // 1. Hacemos la petición POST para crear el repositorio
            const response = await repoService.createRepo(repoData);

            // 2. Validamos el Status Code
            expect(response.status()).toBe(201);

            // 3. Leemos el JSON de la respuesta
            responseBody = await response.json();

            // 4. Mostramos el repositorio creado
            console.log('Repositorio creado:', responseBody);

            // 5. Guardamos el nombre para usarlo en los siguientes tests
            repoName = responseBody.name;
        });

        await test.step('Validar datos principales del repositorio creado', async () => {
            // 1. Validamos datos principales
            expect(responseBody.id).toBeGreaterThan(0);
            expect(responseBody.name).toBe(repoData.name);
            expect(responseBody.description).toBe(repoData.description);
            expect(responseBody.private).toBe(repoData.private);
        });
    });

    // Historia de Usuario 2 - Consultar repositorio:-------------------------------------

    test('CP02 - Consultar repositorio creado @e2e @regression', async ({ request }) => {
        repoService = new RepoService(request);

        let responseBody = {} as RepoResponse;

        await test.step('Consultar repositorio creado por owner y repo name', async () => {
            Logger.step('Consultar repositorio creado');

            // 1. Consultamos el repositorio creado
            const response = await repoService.getRepo(env.githubUsername, repoName);

            // 2. Validamos el Status Code
            expect(response.status()).toBe(200);

            // 3. Leemos el JSON de la respuesta
            responseBody = await response.json();

            // 4. Mostramos el repositorio consultado
            console.log('Repositorio consultado:', responseBody);
        });

        await test.step('Validar que el repositorio consultado sea el repositorio creado', async () => {
            // 1. Validamos que el nombre coincida
            expect(responseBody.name).toBe(repoName);

            // 2. Validamos que el owner coincida con el usuario configurado
            expect(responseBody.owner.login.toLowerCase()).toBe(env.githubUsername.toLowerCase());
        });
    });

    // Historia de Usuario 2 - Actualizar repositorio:-------------------------------------

    test('CP03 - Actualizar repositorio parcialmente @e2e @regression', async ({ request }) => {
        repoService = new RepoService(request);

        let responseBody = {} as RepoResponse;

        await test.step('Crear data para actualizar el repositorio', async () => {
            Logger.step('Crear data para actualizar repositorio');

            // 1. Creamos el body usando el builder
            updateData = RepoBuilder.updateRepo();

            console.log('Data para actualizar repo:', updateData);
        });

        await test.step('Actualizar repositorio con PATCH', async () => {
            Logger.step('Actualizar repositorio parcialmente');

            // 1. Actualizamos el repositorio
            const response = await repoService.updateRepo(env.githubUsername, repoName, updateData);

            // 2. Validamos el Status Code
            expect(response.status()).toBe(200);

            // 3. Leemos el JSON de la respuesta
            responseBody = await response.json();

            // 4. Mostramos el repositorio actualizado
            console.log('Repositorio actualizado:', responseBody);
        });

        await test.step('Validar que la descripción fue actualizada', async () => {
            // 1. Validamos que el nombre siga siendo el mismo
            expect(responseBody.name).toBe(repoName);

            // 2. Validamos que la descripción haya cambiado
            expect(responseBody.description).toBe(updateData.description);
        });
    });

    // Negative Testing - Crear repo con nombre inválido:-------------------------------------

    test('CP04 - Crear repositorio con nombre inválido debe retornar 422 @regression', async ({ request }) => {
        repoService = new RepoService(request);

        await test.step('Intentar crear repo con name vacío', async () => {
            Logger.step('Crear repositorio con datos inválidos');

            // 1. Creamos un body inválido con name vacío
            const invalidRepoData: CreateRepoRequest = {
                name: '',
                description: 'Invalid repo created for negative testing',
                private: false,
                has_issues: true,
                auto_init: true
            };

            // 2. Intentamos crear el repositorio
            const response = await repoService.createRepo(invalidRepoData);

            // 3. Validamos que GitHub rechace la petición
            expect(response.status()).toBe(422);

            // 4. Leemos la respuesta de error
            const responseBody = await response.json() as { message: string };

            // 5. Mostramos el error
            console.log('Respuesta repo inválido:', responseBody);

            // 6. Validamos que exista mensaje de error
            expect(responseBody.message).toBeDefined();
        });
    });

    // Negative Testing - Consultar repo inexistente:-------------------------------------

    test('CP05 - Consultar repositorio inexistente debe retornar 404 @regression', async ({ request }) => {
        repoService = new RepoService(request);

        await test.step('Consultar repo inexistente', async () => {
            Logger.step('Consultar repositorio inexistente');

            // 1. Consultamos un repositorio que no existe
            const response = await repoService.getRepo(env.githubUsername, 'repo-inexistente-qax-123456789');

            // 2. Validamos que GitHub responda 404
            expect(response.status()).toBe(404);

            // 3. Leemos la respuesta de error
            const responseBody = await response.json() as { message: string };

            // 4. Mostramos el error
            console.log('Respuesta repo inexistente:', responseBody);

            // 5. Validamos que exista mensaje de error
            expect(responseBody.message).toBeDefined();
        });
    });

    // Escenario no implementado:-------------------------------------

    test.fixme('CP06 - Eliminar repositorio creado @regression', async () => {
        // Este escenario queda marcado como fixme porque DELETE repo es destructivo.
        // Para esta misión no se implementa para evitar borrar información por error.
    });
});
