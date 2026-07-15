const { test, expect } = require('@playwright/test');


test.describe('Mission 1', () => {

    const baseURL = 'https://homebanking-demo.onrender.com';
    const userName = 'StephaTest212345';
    const name = 'Stepha';
    const userEmail = 'StephaTest212345@test.com';
    let userPassword = 'Qwerty12';
    let newUserPassword = 'Qwerty1234';
    let token;
    let recoveryToken;  //Pegar token de recuperacion de contraseña recibido en el mail.
    let recoveryPassword;

    // Registro del cliente:-------------------------------------

    test('CP01 - Registrar un cliente exitosamente', async ({ request }) => {
        // 1. Hacemos la petición POST para registrar un nuevo cliente
        const response = await request.post(`${baseURL}/auth/registro`, {
            data: {
                username: userName,
                name: name,
                email: userEmail,
                password: userPassword
            }
        });

        // 2. Validamos el Status Code esperado
        expect(response.status()).toBe(200);

        // 3. Leemos el JSON de la respuesta
        const responseBody = await response.json();

        // 4. Mostramos la respuesta para entender qué devuelve la API
        console.log('Respuesta del registro del cliente:', responseBody);

        // 5. Validamos que la respuesta exista
        expect(responseBody).toBeDefined();
    });

    // Inicio de sesión del cliente registrado:-------------------------------------

    test('CP02 - Iniciar sesión con credenciales válidas', async ({ request }) => {
        // 1. Hacemos la petición POST para iniciar sesión
        const response = await request.post(`${baseURL}/auth/login`, {
            data: {
                username: userName,
                password: userPassword
            }
        });

        // 2. Validamos que el login fue exitoso
        expect(response.status()).toBe(200);

        // 3. Leemos el JSON de la respuesta
        const responseBody = await response.json();

        // 4. Mostramos la respuesta para revisar el token
        console.log('Respuesta del login:', responseBody);

        // 5. Validamos que el token venga en la respuesta
        expect(responseBody.token).toBeDefined();

        // 6. Guardamos el token para usarlo en los siguientes endpoints protegidos
        token = responseBody.token;

        console.log('Token obtenido en el login:', token);
    });

    // Consulta del dashboard usando el token del login:-------------------------------------

    test('CP03 - Consultar dashboard del cliente con token válido', async ({ request }) => {
        // 1. Hacemos la petición GET enviando el token en Authorization Bearer
        const response = await request.get(`${baseURL}/cliente/dashboard`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        // 2. Validamos el Status Code esperado
        expect(response.status()).toBe(200);

        // 3. Leemos el JSON de la respuesta
        const responseBody = await response.json();

        // 4. Mostramos el dashboard del cliente
        console.log('Dashboard del cliente:', responseBody);

        // 5. Validamos que la respuesta exista
        expect(responseBody).toBeDefined();
    });

    // Consulta de cuentas asociadas al cliente usando el token del login:-------------------------------------

    test('CP04 - Consultar cuentas del cliente con token válido', async ({ request }) => {
        // 1. Hacemos la petición GET enviando el token en Authorization Bearer
        const response = await request.get(`${baseURL}/cuentas/`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        // 2. Validamos que la consulta fue exitosa
        expect(response.status()).toBe(200);

        // 3. Leemos la respuesta JSON
        const responseBody = await response.json();

        // 4. Mostramos las cuentas asociadas al cliente
        console.log('Cuentas del cliente:', responseBody);

        // 5. Validamos que la respuesta exista
        expect(responseBody).toBeDefined();
    });

    // Consulta de transferencias asociadas al cliente usando el token del login:-------------------------------------

    test('CP05 - Consultar transferencias del cliente con token válido', async ({ request }) => {
        // 1. Hacemos la petición GET enviando el token en Authorization Bearer
        const response = await request.get(`${baseURL}/transacciones/?limit=10`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        // 2. Validamos el Status Code esperado
        expect(response.status()).toBe(200);

        // 3. Leemos el JSON de la respuesta
        const responseBody = await response.json();

        // 4. Mostramos las transferencias del cliente
        console.log('Transferencias del cliente:', responseBody);

        // 5. Validamos que la respuesta exista
        expect(responseBody).toBeDefined();
    });

    // Consulta de tarjetas asociadas al cliente usando el token del login:-------------------------------------

    test('CP06 - Consultar tarjetas asociadas al cliente con token válido', async ({ request }) => {
        // 1. Hacemos la petición GET enviando el token en Authorization Bearer
        const response = await request.get(`${baseURL}/tarjetas/`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        // 2. Validamos el Status Code esperado
        expect(response.status()).toBe(200);

        // 3. Leemos el JSON de la respuesta
        const responseBody = await response.json();

        // 4. Mostramos las tarjetas asociadas al cliente
        console.log('Tarjetas del cliente:', responseBody);

        // 5. Validamos que la respuesta exista
        expect(responseBody).toBeDefined();
    });

    // Consulta de préstamos asociados al cliente usando el token del login:-------------------------------------

    test('CP07 - Consultar préstamos asociados al cliente con token válido', async ({ request }) => {
        // 1. Hacemos la petición GET enviando el token en Authorization Bearer
        const response = await request.get(`${baseURL}/prestamos/`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        // 2. Validamos el Status Code esperado
        expect(response.status()).toBe(200);

        // 3. Leemos el JSON de la respuesta
        const responseBody = await response.json();

        // 4. Mostramos los préstamos asociados al cliente
        console.log('Préstamos del cliente:', responseBody);

        // 5. Validamos que la respuesta exista
        expect(responseBody).toBeDefined();
    });

});