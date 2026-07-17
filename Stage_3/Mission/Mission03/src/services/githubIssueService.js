class GithubIssueService {
    constructor(request) {
        this.request = request;
    }

    async listIssues(owner, repoName) {
        return await this.request.get(`/repos/${owner}/${repoName}/issues`);
    }

    async createIssue(owner, repoName, issueData) {
        return await this.request.post(`/repos/${owner}/${repoName}/issues`, {
            data: issueData
        });
    }
}

module.exports = {
    GithubIssueService
};