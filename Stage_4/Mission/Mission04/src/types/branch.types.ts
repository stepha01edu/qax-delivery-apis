// Interfaces para Branches de GitHub:-------------------------------------

export interface BranchCommit {
    sha: string;
}

export interface BranchResponse {
    name: string;
    commit: BranchCommit;
}

export interface CreateBranchRequest {
    ref: string;
    sha: string;
}

export interface CreateBranchResponse {
    ref: string;
    object: {
        sha: string;
    };
}