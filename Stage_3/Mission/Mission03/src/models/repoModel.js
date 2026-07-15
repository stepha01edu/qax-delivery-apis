function createRepoModel() {
    const randomNumber = Date.now();

    return {
        name: `qa-api-repo-${randomNumber}`,
        description: 'Repository created from Playwright API automation',
        private: false,
        has_issues: true
    };
}

function updateRepoModel() {
    return {
        description: 'Repository updated from Playwright API automation'
    };
}

module.exports = {
    createRepoModel,
    updateRepoModel
};