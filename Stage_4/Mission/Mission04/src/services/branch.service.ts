import { APIRequestContext, APIResponse } from '@playwright/test';
import { ApiHelper } from '../helpers/api.helper';
import { CreateBranchRequest } from '../types/branch.types';

// Service para endpoints de Branches:-------------------------------------

export class BranchService {
    private apiHelper: ApiHelper;

    // Constructor del service:-------------------------------------

    constructor(request: APIRequestContext) {
        // 1. Creamos una instancia del ApiHelper
        this.apiHelper = new ApiHelper(request);
    }

    // GET /repos/{owner}/{repo}/branches:-------------------------------------

    async listBranches(owner: string, repoName: string): Promise<APIResponse> {
        // 1. Consultamos las ramas de un repositorio
        return await this.apiHelper.get(`/repos/${owner}/${repoName}/branches`);
    }

    // POST /repos/{owner}/{repo}/git/refs:-------------------------------------

    async createBranch(owner: string, repoName: string, branchData: CreateBranchRequest): Promise<APIResponse> {
        // 1. Creamos una rama vía API usando git refs
        return await this.apiHelper.post(`/repos/${owner}/${repoName}/git/refs`, branchData);
    }
}