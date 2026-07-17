class GithubUserService {
    constructor(request) {
        this.request = request;
    }

    async getUser(username) {
        return await this.request.get(`/users/${username}`);
    }
}

module.exports = {
    GithubUserService
};