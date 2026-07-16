// Interfaces para Users de GitHub:-------------------------------------

export interface GitHubUserResponse {
    login: string;
    id: number;
    avatar_url: string;
    repos_url: string;
    type: string;
}