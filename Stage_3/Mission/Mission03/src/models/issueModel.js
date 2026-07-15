function createIssueModel() {
    const randomNumber = Date.now();

    return {
        title: `Issue created from automation ${randomNumber}`,
        body: 'This issue was created using GitHub REST API and Playwright.'
    };
}

module.exports = {
    createIssueModel
};