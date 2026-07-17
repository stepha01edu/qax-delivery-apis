// Interfaces para Issues de GitHub:-------------------------------------

export interface CreateIssueRequest {
    title: string;
    body: string;
}

export interface IssueResponse {
    id: number;
    number: number;
    title: string;
    body: string | null;
    state: string;
}

export interface SearchIssuesResponse {
    total_count: number;
    incomplete_results: boolean;
    items: IssueResponse[];
}