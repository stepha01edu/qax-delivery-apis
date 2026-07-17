import { APIRequestContext, APIResponse } from '@playwright/test';
import { ApiHelper } from '../helpers/api.helper';
import { CreateIssueRequest } from '../types/issue.types';

// Service para endpoints de Issues:-------------------------------------

export class IssueService {
    private apiHelper: ApiHelper;

    // Constructor del service:-------------------------------------

    constructor(request: APIRequestContext) {
        // 1. Creamos una instancia del ApiHelper
        this.apiHelper = new ApiHelper(request);
    }

    // GET /repos/{owner}/{repo}/issues:-------------------------------------

    async listIssues(owner: string, repoName: string): Promise<APIResponse> {
        // 1. Consultamos los issues de un repositorio
        return await this.apiHelper.get(`/repos/${owner}/${repoName}/issues`);
    }

    // POST /repos/{owner}/{repo}/issues:-------------------------------------

    async createIssue(owner: string, repoName: string, issueData: CreateIssueRequest): Promise<APIResponse> {
        // 1. Creamos un issue dentro de un repositorio
        return await this.apiHelper.post(`/repos/${owner}/${repoName}/issues`, issueData);
    }

    // GET /search/issues?q=...:-------------------------------------

    async searchIssues(query: string): Promise<APIResponse> {
        // 1. Buscamos issues usando query params
        return await this.apiHelper.get(`/search/issues?q=${query}`);
    }
}