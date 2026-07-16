import { APIRequestContext, APIResponse } from '@playwright/test';
import { ApiHelper } from '../helpers/api.helper';

// Service para endpoints de Users:-------------------------------------

export class UserService {
    private apiHelper: ApiHelper;

    // Constructor del service:-------------------------------------

    constructor(request: APIRequestContext) {
        // 1. Creamos una instancia del ApiHelper
        this.apiHelper = new ApiHelper(request);
    }

    // GET /users/{username}:-------------------------------------

    async getUser(username: string): Promise<APIResponse> {
        // 1. Consultamos la información de un usuario de GitHub
        return await this.apiHelper.get(`/users/${username}`);
    }
}