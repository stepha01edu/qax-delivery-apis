import { APIRequestContext, APIResponse } from '@playwright/test';
import { ApiHelper } from '../helpers/api.helper';

// Service para endpoints de Commits:-------------------------------------

export class CommitService {
    private apiHelper: ApiHelper;

    // Constructor del service:-------------------------------------

    constructor(request: APIRequestContext) {
        // 1. Creamos una instancia del ApiHelper
        this.apiHelper = new ApiHelper(request);
    }

    // GET /repos/{owner}/{repo}/commits:-------------------------------------

    async listCommits(owner: string, repoName: string): Promise<APIResponse> {
        // 1. Consultamos los commits de un repositorio
        return await this.apiHelper.get(`/repos/${owner}/${repoName}/commits`);
    }
}