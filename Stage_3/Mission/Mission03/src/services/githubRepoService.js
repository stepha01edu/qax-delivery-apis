class GithubRepoService {
    constructor(request) {
        this.request = request;
    }

    async createRepo(repoData) {
        return await this.request.post('/user/repos', {
            data: repoData
        });
    }

    async getRepo(owner, repoName) {
        return await this.request.get(`/repos/${owner}/${repoName}`);
    }

    async updateRepo(owner, repoName, repoData) {
        return await this.request.patch(`/repos/${owner}/${repoName}`, {
            data: repoData
        });
    }
}

module.exports = {
    GithubRepoService
};