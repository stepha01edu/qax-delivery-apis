import { APIRequestContext, APIResponse } from '@playwright/test';
import { ApiHelper } from '../helpers/api.helper';

// Service para endpoints de Contributors:-------------------------------------

export class ContributorService {
    private apiHelper: ApiHelper;

    // Constructor del service:-------------------------------------

    constructor(request: APIRequestContext) {
        // 1. Creamos una instancia del ApiHelper
        this.apiHelper = new ApiHelper(request);
    }

    // GET /repos/{owner}/{repo}/contributors:-------------------------------------

    async listContributors(owner: string, repoName: string): Promise<APIResponse> {
        // 1. Consultamos los contribuidores de un repositorio
        return await this.apiHelper.get(`/repos/${owner}/${repoName}/contributors`);
    }
}