function generateUserData() {
    const randomNumber = Date.now();

    return {
        name: `Stepha Mission 2 ${randomNumber}`,
        email: `StephaMission2.${randomNumber}@mail.com`,
        password: 'Qwerty123',
        avatar: 'https://Mission1.test'
    };
}

function generateCategoryData() {
    const randomNumber = Date.now();

    return {
        name: `Category Test ${randomNumber}`,
        image: 'https://Mission1.test'
    };
}

function generateProductData(categoryId) {
    const randomNumber = Date.now();

    return {
        title: `Product Mission ${randomNumber}`,
        price: 100,
        description: 'Product created for Mission',
        categoryId: categoryId,
        images: [
            'https://Mission1.test'
        ]
    };
}

module.exports = {
    generateUserData,
    generateCategoryData,
    generateProductData
};