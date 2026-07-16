import { faker } from '@faker-js/faker';
import { CreateIssueRequest } from '../types/issue.types';

// Builder para crear data de issues:-------------------------------------

export class IssueBuilder {

    // Crear body para nuevo issue:-------------------------------------

    static createIssue(): CreateIssueRequest {
        // 1. Generamos un título dinámico para evitar issues repetidos
        const issueTitle = `Issue automation ${faker.string.alphanumeric(8)}`;

        // 2. Retornamos el body que espera GitHub para crear issues
        return {
            title: issueTitle,
            body: 'This issue was created using GitHub REST API and Playwright with TypeScript.'
        };
    }
}