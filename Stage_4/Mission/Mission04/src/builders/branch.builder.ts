import { faker } from '@faker-js/faker';
import { CreateBranchRequest } from '../types/branch.types';

// Builder para crear data de branches:-------------------------------------

export class BranchBuilder {

    // Crear nombre dinámico para rama:-------------------------------------

    static createBranchName(): string {
        // 1. Generamos un nombre dinámico para evitar ramas repetidas
        return `feature/qax-${faker.string.alphanumeric(6).toLowerCase()}`;
    }

    // Crear body para nueva rama vía API:-------------------------------------

    static createBranchRef(branchName: string, sha: string): CreateBranchRequest {
        // 1. GitHub espera el formato refs/heads/nombre-rama
        return {
            ref: `refs/heads/${branchName}`,
            sha
        };
    }
}