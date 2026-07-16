// Interfaces para Commits de GitHub:-------------------------------------

export interface CommitAuthor {
    name: string;
    email: string;
    date: string;
}

export interface CommitInfo {
    message: string;
    author: CommitAuthor;
}

export interface CommitResponse {
    sha: string;
    commit: CommitInfo;
}