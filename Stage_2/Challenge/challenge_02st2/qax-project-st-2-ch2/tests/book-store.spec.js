import { test, expect } from '@playwright/test';
import { generarUsuario } from '../utils/dataGenerator';

/**
 * test.describe.serial permite ejecutar el flujo en orden.
 * Esto es importante porque varios pasos dependen de datos creados previamente:
 * - userId
 * - token JWT
 * - ISBN del primer libro
 */
test.describe.serial('Book Store API - Flujo completo con Token', () => {

    let usuarioDinamico;
    let userId;
    let tokenAuth;
    let primerIsbn;

    /**
     * beforeAll se ejecuta una sola vez antes de todos los tests.
     * En este reto lo usamos para generar la data dinámica del usuario.
     */
    test.beforeAll(async () => {
        try {
            usuarioDinamico = generarUsuario(); // llamo la funcion para generar el user dinamico

            console.log('Usuario dinámico generado es:');
            console.log('UserName:', usuarioDinamico.userName);
            console.log('Password:', usuarioDinamico.userPassword);
        } catch (error) {
            console.log('No se pudo generar el usuario dinámico');
            throw error;
        }
    });

    test('CP01 - Registrar usuario válido', async ({ request }) => {
        console.log('El user que se va a registrar es ', usuarioDinamico.userName, ' y su password sera ', usuarioDinamico.userPassword);
        const response = await request.post('Account/v1/User', {
            data: {
                userName: usuarioDinamico.userName,
                password: usuarioDinamico.userPassword
            }
        });

        const body = await response.json();

        console.log('Status del registro:', response.status());
        console.log('Usuario registrado:', body);

        expect(response.status()).toBe(201);
        expect(body.username).toBe(usuarioDinamico.userName);
        expect(body.userID).toBeTruthy();

        userId = body.userID;  // almaceno el userid de la repsuesta del postman para usarlo en test

        console.log('Usuario registrado correctamente con userId:', userId);
    });

    test('CP02 - Generar token JWT con credenciales válidas', async ({ request }) => {
        const response = await request.post('Account/v1/GenerateToken', {
            data: {
                userName: usuarioDinamico.userName,
                password: usuarioDinamico.userPassword
            }
        });

        const body = await response.json();

        console.log('Status generación token:', response.status());
        console.log('Generacion del token:', body);

        expect(response.status()).toBe(200);
        expect(body.status).toBe('Success');
        expect(body.token).toBeTruthy();

        tokenAuth = body.token;  //guardo el token de autenticacion

        console.log('El token JWT ha sido obtenido correctamente');
    });

    test('CP03 - Consultar información del usuario con token', async ({ request }) => {
        const response = await request.get(`Account/v1/User/${userId}`, {
            headers: {
                Authorization: `Bearer ${tokenAuth}`
            }
        });

        const body = await response.json();

        console.log('Status consulta usuario:', response.status());
        console.log('Usuario consultado:', body);

        expect(response.status()).toBe(200);
        expect(body.userId).toBe(userId);
        expect(body.username).toBe(usuarioDinamico.userName);
    });

    test('CP04 - Obtener lista de libros y extraer el primer ISBN', async ({ request }) => {
        const response = await request.get('BookStore/v1/Books');

        const body = await response.json();

        console.log('Status lista libros:', response.status());
        console.log('Lista de libros:', body);

        expect(response.status()).toBe(200);
        expect(body.books).toBeTruthy();
        expect(body.books.length).toBeGreaterThan(0);

        primerIsbn = body.books[0].isbn; // guardo la lista de libros en un arreglo y guardo la primera posicion 0, que pasaria si el enpoint retorna 200 ok pero no tiene datos?

        expect(primerIsbn).toBeTruthy(); // valido que la primera posicion del arreglo relamente tenga informacion y no este vacia, como debe fallar si retorna que si esta vacio?

        console.log('Primer ISBN obtenido:', primerIsbn);
    });

    test('CP05 - Agregar el primer libro al usuario usando token', async ({ request }) => {
        const response = await request.post('BookStore/v1/Books', {
            headers: {
                Authorization: `Bearer ${tokenAuth}`
            },
            data: {
                userId: userId,
                collectionOfIsbns: [
                    {
                        isbn: primerIsbn
                    }
                ]
            }
        });

        const body = await response.json();

        console.log('Status agregar libro:', response.status());
        console.log('Body agregar libro:', body);

        expect(response.status()).toBe(201);
        expect(body.books).toBeTruthy();
        expect(body.books[0].isbn).toBe(primerIsbn);

        console.log('Libro con codigo ', primerIsbn, ' agregado correctamente al usuario ', usuarioDinamico.userName);
    });

});