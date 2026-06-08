const { test, expect } = require('@playwright/test');
const { generateRandomEmail } = require('../utils/utils');
const { generateRandomName } = require('../utils/utils');


test.describe('Estado del Sistema y Autenticación', () => {

    const userEmail = generateRandomEmail();
    const userName = generateRandomName();
    let userPassword = 'Qwerty123!';
    let token;

    /*   // Sanity check del sistema:-------------------------------------
   
       test('CP01 - Verificar la salud de la API (Health Check)', async ({ request }) => {
           // Hacemos la petición, el base URL global esta configurado en el archivo config.js 
           const response = await request.get('health-check');
           // Miro la url que armo
           console.log('URL final:', response.url());
           // Miro el status que me retorna
           console.log('Status:', response.status());
   
           // Validamos el Status Code
           expect(response.status()).toBe(200);
   
           // Leemos el JSON de la respuesta y validamos el mensaje
           const responseBody = await response.json();
           expect(responseBody.message).toBe('Notes API is Running');
       });
   */
    // Registro del user:-------------------------------------

    test('CP02 - Registrar un usuario exitosamente', async ({ request }) => {

        // Hacemos la petición, el base URL global esta configurado en el archivo config.js 
        const response = await request.post('users/register', {
            data: {
                name: userName,
                email: userEmail,
                password: userPassword
            }
        });

        // Miro la url que armo
        console.log('URL final:', response.url());
        // Miro el status que me retorna
        console.log('Status:', response.status());

        expect(response.status()).toBe(201);

        const responseBody = await response.json();
        expect(responseBody.message).toBe('User account created successfully');
        console.log('El user creado es', userEmail)
    });

    // Inicio de sesion del user registrado:-------------------------------------

    test('CP03 - Iniciar sesión con credenciales válidas', async ({ request }) => {
        const response = await request.post('users/login', {
            data: {
                email: userEmail,
                password: userPassword
            }
        });

        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        expect(responseBody.message).toBe('Login successful');
        // Validamos que el token realmente venga en la respuesta, lo almacenamos y lo mostramos para debug
        expect(responseBody.data.token).toBeDefined();
        token = responseBody.data.token;
        //console.log("La data del user es",)
        console.log("el token de inicio de sesion es", token);
    });


    // Visualizacion del profile del user registrado:-------------------------------------

    test('CP02 - Consultar perfil correctamente', async ({ request }) => {
        const response = await request.get('users/profile', {
            headers: {
                'x-auth-token': token
            }
        });

        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        expect(responseBody.message).toBe('Profile successful');

        // muestro la informacion del user que retornal el endpoint y el token usado

        console.log("Se ejecutó bien usando el token de inicio se sesion", token);
        //console.log("Respuesta completa:", responseBody);
        console.log("Data del perfil:", responseBody.data);
    });

});