import { APIRequestContext, APIResponse } from '@playwright/test';
import { ApiHelper } from '../helpers/api.helper';
import { CreateRepoRequest, UpdateRepoRequest } from '../types/repo.types';

// Service para endpoints de Repositories:-------------------------------------

export class RepoService {
    private apiHelper: ApiHelper;

    // Constructor del service:-------------------------------------

    constructor(request: APIRequestContext) {
        // 1. Creamos una instancia del ApiHelper
        this.apiHelper = new ApiHelper(request);
    }

    // POST /user/repos:-------------------------------------

    async createRepo(repoData: CreateRepoRequest): Promise<APIResponse> {
        // 1. Creamos un repositorio usando la data recibida
        return await this.apiHelper.post('/user/repos', repoData);
    }

    // GET /repos/{owner}/{repo}:-------------------------------------

    async getRepo(owner: string, repoName: string): Promise<APIResponse> {
        // 1. Consultamos un repositorio por owner y nombre
        return await this.apiHelper.get(`/repos/${owner}/${repoName}`);
    }

    // PATCH /repos/{owner}/{repo}:-------------------------------------

    async updateRepo(owner: string, repoName: string, repoData: UpdateRepoRequest): Promise<APIResponse> {
        // 1. Actualizamos parcialmente un repositorio
        return await this.apiHelper.patch(`/repos/${owner}/${repoName}`, repoData);
    }
}