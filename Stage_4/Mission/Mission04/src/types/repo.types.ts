// Interfaces para Repositories de GitHub:-------------------------------------

export interface CreateRepoRequest {
    name: string;
    description: string;
    private: boolean;
    has_issues: boolean;
    auto_init: boolean;
}

export interface UpdateRepoRequest {
    description: string;
}

export interface RepoOwner {
    login: string;
}

export interface RepoResponse {
    id: number;
    name: string;
    full_name: string;
    description: string | null;
    private: boolean;
    owner: RepoOwner;
    default_branch: string;
}
