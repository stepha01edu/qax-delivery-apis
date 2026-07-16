const { test, expect } = require('@playwright/test');
const {
    generateUserData,
    generateProductData,
    generateCategoryData
} = require('../utils/dataGenerator');

test.describe.serial('Mission 2 - E2E API Testing Platzi Fake Store', () => {

    let userData;
    let userId;

    let accessToken;
    let refreshToken;

    let categoryData;
    let categoryId;

    let productWithCategoryData;
    let productWithCategoryId;

    // Users - Crear usuario con data dinámica:-------------------------------------

    test('CP01 - Crear usuario con datos dinámicos @E2E', async ({ request }) => {
        // 1. Generamos la data dinámica del usuario
        userData = generateUserData();

        // 2. Hacemos la petición POST para crear el usuario
        const response = await request.post('users', {
            data: userData
        });

        // 3. Validamos el Status Code
        expect(response.status()).toBe(201);

        // 4. Leemos el JSON de la respuesta
        const responseBody = await response.json();

        // 5. Mostramos la respuesta para entender qué devuelve la API
        console.log('Usuario creado:', responseBody);

        // 6. Validamos que el usuario tenga ID
        expect(responseBody.id).toBeDefined();
        expect(responseBody.email).toBe(userData.email);
        expect(responseBody.name).toBe(userData.name);

        // 7. Guardamos el ID para usarlo en los siguientes tests
        userId = responseBody.id;

        console.log('ID del usuario creado:', userId);
    });

    // Users - Consultar usuario creado:-------------------------------------

    test('CP02 - Consultar usuario creado por ID', async ({ request }) => {
        // 1. Consultamos el usuario usando el ID guardado
        const response = await request.get(`users/${userId}`);

        // 2. Validamos el Status Code
        expect(response.status()).toBe(200);

        // 3. Leemos el JSON de la respuesta
        const responseBody = await response.json();

        // 4. Mostramos el usuario consultado
        console.log('Usuario consultado:', responseBody);

        // 5. Validamos que los datos coincidan con los enviados
        expect(responseBody.id).toBe(userId);
        expect(responseBody.email).toBe(userData.email);
        expect(responseBody.name).toBe(userData.name);
    });

    // Users - Consultar lista de usuarios:-------------------------------------

    test('CP03 - Verificar que el usuario creado está en la lista de usuarios', async ({ request }) => {
        // 1. Consultamos la lista de usuarios
        const response = await request.get('users/');

        // 2. Validamos el Status Code
        expect(response.status()).toBe(200);

        // 3. Leemos el JSON de la respuesta
        const responseBody = await response.json();

        // 4. Buscamos el usuario creado dentro de la lista
        const userFound = responseBody.find((user) => user.id === userId);

        console.log('Usuario encontrado en lista:', userFound);

        // 5. Validamos que el usuario exista en la lista
        expect(userFound).toBeDefined();
        expect(userFound.email).toBe(userData.email);
    });

    // Auth - Login con el usuario creado:-------------------------------------

    test('CP04 - Login con el usuario creado y obtener token', async ({ request }) => {
        // 1. Hacemos login usando el email y password del usuario creado
        const response = await request.post('auth/login', {
            data: {
                email: userData.email,
                password: userData.password
            }
        });

        // 2. Validamos el Status Code
        expect(response.status()).toBe(201);

        // 3. Leemos el JSON de la respuesta
        const responseBody = await response.json();

        // 4. Mostramos la respuesta del login
        console.log('Respuesta del login:', responseBody);

        // 5. Validamos que vengan los tokens
        expect(responseBody.access_token).toBeDefined();
        expect(responseBody.refresh_token).toBeDefined();

        // 6. Guardamos los tokens para usarlos después
        accessToken = responseBody.access_token;
        refreshToken = responseBody.refresh_token;

        console.log('Access token obtenido:', accessToken);
    });

    // Auth - Consultar perfil con token:-------------------------------------

    test('CP05 - Consultar profile usando el token creado', async ({ request }) => {
        // 1. Consultamos el profile enviando el token en Authorization Bearer
        const response = await request.get('auth/profile', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        // 2. Validamos el Status Code
        expect(response.status()).toBe(200);

        // 3. Leemos el JSON de la respuesta
        const responseBody = await response.json();

        // 4. Mostramos el profile
        console.log('Profile del usuario:', responseBody);

        // 5. Validamos que el profile corresponde al usuario creado
        expect(responseBody.id).toBe(userId);
        expect(responseBody.email).toBe(userData.email);
    });

    // Auth - Refresh token:-------------------------------------

    test('CP06 - Obtener nuevo token usando refresh token', async ({ request }) => {
        // 1. Enviamos el refresh token para obtener un nuevo access token
        const response = await request.post('auth/refresh-token', {
            data: {
                refreshToken: refreshToken
            }
        });

        // 2. Validamos el Status Code
        expect(response.status()).toBe(201);

        // 3. Leemos el JSON de la respuesta
        const responseBody = await response.json();

        // 4. Mostramos la respuesta del refresh token
        console.log('Respuesta del refresh token:', responseBody);

        // 5. Validamos que venga un nuevo access token
        expect(responseBody.access_token).toBeDefined();

        // 6. Guardamos el nuevo access token
        accessToken = responseBody.access_token;

        console.log('Nuevo access token:', accessToken);
    });

    // Categories - Crear categoría:-------------------------------------

    test('CP07 - Crear categoría con datos dinámicos @E2E', async ({ request }) => {
        // 1. Generamos data dinámica para la categoría
        categoryData = generateCategoryData();

        // 2. Creamos la categoría
        const response = await request.post('categories/', {
            data: categoryData
        });

        // 3. Validamos el Status Code
        expect(response.status()).toBe(201);

        // 4. Leemos el JSON de la respuesta
        const responseBody = await response.json();

        // 5. Mostramos la categoría creada
        console.log('Categoría creada:', responseBody);

        // 6. Validamos datos principales
        expect(responseBody.id).toBeDefined();
        expect(responseBody.name).toBe(categoryData.name);

        // 7. Guardamos el ID de la categoría
        categoryId = responseBody.id;

        console.log('ID de la categoría creada:', categoryId);
    });

    // Categories - Consultar categoría creada:-------------------------------------

    test('CP08 - Consultar categoría creada por ID', async ({ request }) => {
        // 1. Consultamos la categoría por ID
        const response = await request.get(`categories/${categoryId}`);

        // 2. Validamos el Status Code
        expect(response.status()).toBe(200);

        // 3. Leemos el JSON de la respuesta
        const responseBody = await response.json();

        // 4. Mostramos la categoría consultada
        console.log('Categoría consultada:', responseBody);

        // 5. Validamos que sea la categoría creada
        expect(responseBody.id).toBe(categoryId);
        expect(responseBody.name).toBe(categoryData.name);
    });

    // Products - Crear producto asociado a la categoría:-------------------------------------

    test('CP09 - Crear producto asociado a la categoría creada @E2E', async ({ request }) => {
        // 1. Generamos data dinámica para el producto usando el categoryId
        productWithCategoryData = generateProductData(categoryId);

        // 2. Creamos el producto asociado a la categoría
        const response = await request.post('products/', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            data: productWithCategoryData
        });

        // 3. Validamos el Status Code
        expect(response.status()).toBe(201);

        // 4. Leemos el JSON de la respuesta
        const responseBody = await response.json();

        // 5. Mostramos el producto creado con categoría
        console.log('Producto asociado a categoría:', responseBody);

        // 6. Validamos que el producto tenga la categoría asociada
        expect(responseBody.id).toBeDefined();
        expect(responseBody.title).toBe(productWithCategoryData.title);
        expect(responseBody.category.id).toBe(categoryId);

        // 7. Guardamos el ID del producto creado
        productWithCategoryId = responseBody.id;
    });

    // Products - Consultar producto asociado:-------------------------------------

    test('CP10 - Verificar que el producto tiene la categoría asociada @E2E', async ({ request }) => {
        // 1. Consultamos el producto asociado a la categoría
        const response = await request.get(`products/${productWithCategoryId}`);

        // 2. Validamos el Status Code
        expect(response.status()).toBe(200);

        // 3. Leemos el JSON de la respuesta
        const responseBody = await response.json();

        // 4. Mostramos el producto consultado
        console.log('Producto con categoría consultado:', responseBody);

        // 5. Validamos que la categoría del producto sea la categoría creada
        expect(responseBody.id).toBe(productWithCategoryId);
        expect(responseBody.category.id).toBe(categoryId);
        expect(responseBody.category.name).toBe(categoryData.name);
    });

    // Categories - Consultar productos de la categoría:-------------------------------------

    test('CP11 - Verificar que el producto aparece en la lista de productos de la categoría', async ({ request }) => {
        // 1. Consultamos los productos de la categoría
        const response = await request.get(`categories/${categoryId}/products`);

        // 2. Validamos el Status Code
        expect(response.status()).toBe(200);

        // 3. Leemos el JSON de la respuesta
        const responseBody = await response.json();

        // 4. Buscamos el producto dentro de la categoría
        const productFound = responseBody.find((product) => product.id === productWithCategoryId);

        console.log('Producto encontrado dentro de la categoría:', productFound);

        // 5. Validamos que el producto aparezca dentro de la categoría
        expect(productFound).toBeDefined();
        expect(productFound.title).toBe(productWithCategoryData.title);
    });

    // Categories - Consultar lista de categorías:-------------------------------------

    test('CP12 - Verificar que la categoría creada está en la lista de categorías', async ({ request }) => {
        // 1. Consultamos la lista de categorías
        const response = await request.get('categories/');

        // 2. Validamos el Status Code
        expect(response.status()).toBe(200);

        // 3. Leemos el JSON de la respuesta
        const responseBody = await response.json();

        // 4. Buscamos la categoría creada
        const categoryFound = responseBody.find((category) => category.id === categoryId);

        console.log('Categoría encontrada en lista:', categoryFound);

        // 5. Validamos que la categoría exista en la lista
        expect(categoryFound).toBeDefined();
        expect(categoryFound.name).toBe(categoryData.name);
    });

    // Products - Consultar lista de productos y validar categoría asociada:-------------------------------------

    test('CP13 - Verificar que el producto creado está en la lista y tiene la categoría asociada', async ({ request }) => {
        // 1. Consultamos la lista de productos
        const response = await request.get('products/');

        // 2. Validamos el Status Code
        expect(response.status()).toBe(200);

        // 3. Leemos el JSON de la respuesta
        const responseBody = await response.json();

        // 4. Buscamos el producto asociado a la categoría
        const productFound = responseBody.find((product) => product.id === productWithCategoryId);

        console.log('Producto encontrado en lista con categoría:', productFound);

        // 5. Validamos que el producto exista y tenga la categoría correcta
        expect(productFound).toBeDefined();
        expect(productFound.title).toBe(productWithCategoryData.title);
        expect(productFound.category.id).toBe(categoryId);
    });

    // Files - Upload de archivo:-------------------------------------

    test('CP14 - Subir archivo correctamente @E2E', async ({ request }) => {
        // 1. Creamos un archivo simple en memoria para probar el upload
        const fileContent = Buffer.from('Archivo de prueba para Mission 2');
        const fileName = `practica-${Date.now()}.txt`;

        // 2. Hacemos la petición POST usando multipart/form-data
        const response = await request.post('files/upload', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            multipart: {
                file: {
                    name: fileName,
                    mimeType: 'text/plain',
                    buffer: fileContent
                }
            }
        });

        // 3. Validamos el Status Code
        expect(response.status()).toBe(201);

        // 4. Leemos el JSON de la respuesta
        const responseBody = await response.json();

        // 5. Mostramos la respuesta del upload
        console.log('Archivo subido:', responseBody);

        // 6. Validamos que la API devuelva información del archivo
        expect(responseBody.originalname).toBe(fileName);
        expect(responseBody.filename).toBeDefined();
        expect(responseBody.location).toBeDefined();
    });

});
