function createRepoModel() {
    const randomNumber = Math.floor(Math.random() * 100000);

    return {
        name: `qa-api-repo-${Date.now()}-${randomNumber}`,
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
