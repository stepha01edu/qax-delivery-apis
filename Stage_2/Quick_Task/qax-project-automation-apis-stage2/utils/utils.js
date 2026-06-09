function generateRandomEmail() {
    const timestamp = Date.now();
    return `stephates${timestamp}@test.test`;
}

function generateRandomName() {
    const timestamp = Date.now();
    return `stepha${timestamp}`;
}

module.exports = {
    generateRandomEmail, generateRandomName,
};