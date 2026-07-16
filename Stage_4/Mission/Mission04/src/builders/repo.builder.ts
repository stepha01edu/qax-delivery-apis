import { faker } from '@faker-js/faker';
import { CreateRepoRequest, UpdateRepoRequest } from '../types/repo.types';

// Builder para crear data de repositorios:-------------------------------------

export class RepoBuilder {

    // Crear body para nuevo repositorio:-------------------------------------

    static createRepo(): CreateRepoRequest {
        // 1. Generamos un nombre dinámico para evitar repos repetidos
        const repoName = `qax-api-${faker.string.alphanumeric(8).toLowerCase()}`;

        // 2. Retornamos el body que espera GitHub para crear repositorios
        return {
            name: repoName,
            description: 'Repository created from Playwright API automation',
            private: false,
            has_issues: true,
            auto_init: true
        };
    }

    // Crear body para actualizar repositorio:-------------------------------------

    static updateRepo(): UpdateRepoRequest {
        // 1. Retornamos la descripción nueva para actualizar el repo
        return {
            description: `Repository updated from automation ${faker.date.recent().toISOString()}`
        };
    }
}
