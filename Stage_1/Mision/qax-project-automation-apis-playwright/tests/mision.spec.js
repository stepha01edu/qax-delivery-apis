const { test, expect } = require('@playwright/test');

test.describe.serial('Mission 1 - Homebanking Smoke E2E', () => {

    const baseURL = 'https://homebanking-demo.onrender.com';

    const randomNumber = Date.now();
    const userName = `StephaTest${randomNumber}`;
    const name = 'Stepha';
    const userEmail = `StephaTest${randomNumber}@test.com`;
    const userPassword = 'Qwerty12';

    let token;
    let cuentaOrigen;
    let cuentaDestino;
    let saldoInicial;
    let tarjetaDebito;
    let idTransferencia;
    const montoTransferencia = 100;
    const motivoTransferencia = 'Transferencia smoke test';

    const obtenerCuentas = (responseBody) => (
        Array.isArray(responseBody)
            ? responseBody
            : responseBody.accounts || responseBody.cuentas || responseBody.data?.accounts || responseBody.data?.cuentas || responseBody.data
    );

    const obtenerTransacciones = (responseBody) => (
        Array.isArray(responseBody)
            ? responseBody
            : responseBody.transactions || responseBody.transacciones || responseBody.data?.transactions || responseBody.data?.transacciones || responseBody.data
    );

    const obtenerSaldo = (cuenta) => Number(cuenta.balance ?? cuenta.saldo);

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

    test('CP04 - Consultar cuentas del cliente y guardar saldo inicial', async ({ request }) => {
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

        // 6. Guardamos las cuentas para usarlas en la transferencia
        const cuentas = obtenerCuentas(responseBody);

        expect(Array.isArray(cuentas)).toBeTruthy();
        expect(cuentas.length).toBeGreaterThan(1);

        cuentaOrigen = cuentas[0].id;
        cuentaDestino = cuentas[1].id;
        saldoInicial = obtenerSaldo(cuentas[0]);

        // 7. Validamos que los datos necesarios existan
        expect(cuentaOrigen).toBeDefined();
        expect(cuentaDestino).toBeDefined();
        expect(saldoInicial).toBeGreaterThan(0);

        console.log('Cuenta origen:', cuentaOrigen);
        console.log('Cuenta destino:', cuentaDestino);
        console.log('Saldo inicial:', saldoInicial);
    });

    // Creación de tarjeta de débito para habilitar transferencias:-------------------------------------

    test('CP05 - Crear tarjeta de débito para la cuenta origen', async ({ request }) => {
        // 1. Hacemos la petición POST para crear una tarjeta de débito asociada a la cuenta origen
        const response = await request.post(`${baseURL}/tarjetas/`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: {
                id_cuenta_asociada: cuentaOrigen,
                tipo: 'Débito',
                marca: 'Visa'
            }
        });

        // 2. Validamos que la tarjeta fue creada correctamente
        expect(response.status()).toBe(200);

        // 3. Leemos el JSON de la respuesta
        const responseBody = await response.json();

        // 4. Mostramos la tarjeta generada
        console.log('Tarjeta de débito creada:', responseBody);

        // 5. Validamos que la respuesta tenga los datos esperados
        expect(responseBody.exito).toBeTruthy();
        expect(responseBody.mensaje).toBeDefined();
        expect(responseBody.tarjeta).toBeDefined();
        expect(responseBody.tarjeta.id).toBeDefined();
        expect(responseBody.tarjeta.linkedAccount).toBe(cuentaOrigen);

        tarjetaDebito = responseBody.tarjeta.id;
    });

    // Consulta de transacciones antes de transferir:-------------------------------------

    test('CP06 - Consultar transacciones del cliente con token válido', async ({ request }) => {
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

        // 4. Mostramos las transacciones del cliente
        console.log('Transacciones antes de transferencia:', responseBody);

        // 5. Validamos que la respuesta exista
        expect(responseBody).toBeDefined();
    });

    // Transferencia de dinero usando cuentas del cliente:-------------------------------------

    test('CP07 - Realizar transferencia con saldo suficiente', async ({ request }) => {
        // 1. Hacemos la petición POST para realizar una transferencia
        const response = await request.post(`${baseURL}/transferencias/`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: {
                cuenta_origen: cuentaOrigen,
                cuenta_destino: cuentaDestino,
                monto: montoTransferencia,
                motivo: motivoTransferencia,
                tipo: 'propia'
            }
        });

        // 2. Validamos que la transferencia fue exitosa
        expect(response.status()).toBe(200);

        // 3. Leemos el JSON de la respuesta
        const responseBody = await response.json();

        // 4. Mostramos la respuesta de la transferencia
        console.log('Respuesta de transferencia:', responseBody);

        // 5. Validamos que la respuesta exista
        expect(responseBody).toBeDefined();
        expect(responseBody.exito ?? responseBody.success).toBeTruthy();
        expect(responseBody.mensaje ?? responseBody.message).toBeDefined();

        const comprobante = responseBody.transaccion || responseBody.transaction || responseBody.comprobante || responseBody.data?.transaccion || responseBody.data?.transaction;

        // 6. Validamos que la API devuelva el comprobante/transaccion generada
        expect(comprobante).toBeDefined();
        expect(comprobante.id).toBeDefined();
        expect(Number(comprobante.monto ?? comprobante.amount)).toBe(montoTransferencia);
        expect(comprobante.descripcion ?? comprobante.description).toBe(motivoTransferencia);

        idTransferencia = comprobante.id;
    });

    // Validación de saldo luego de la transferencia:-------------------------------------

    test('CP08 - Validar saldo actualizado luego de la transferencia', async ({ request }) => {
        // 1. Consultamos nuevamente las cuentas del cliente
        const response = await request.get(`${baseURL}/cuentas/`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        // 2. Validamos el Status Code
        expect(response.status()).toBe(200);

        // 3. Leemos el JSON de la respuesta
        const responseBody = await response.json();

        // 4. Obtenemos el listado de cuentas
        const cuentas = obtenerCuentas(responseBody);

        // 5. Buscamos nuevamente la cuenta origen
        const cuentaOrigenActualizada = cuentas.find((cuenta) => cuenta.id === cuentaOrigen);

        console.log('Cuenta origen luego de transferencia:', cuentaOrigenActualizada);

        // 6. Validamos que la cuenta exista
        expect(cuentaOrigenActualizada).toBeDefined();

        // 7. Validamos que el saldo haya disminuido
        expect(obtenerSaldo(cuentaOrigenActualizada)).toBe(saldoInicial - montoTransferencia);
    });

    // Validación de movimiento registrado:-------------------------------------

    test('CP09 - Validar que la transferencia quedó registrada en transacciones', async ({ request }) => {
        // 1. Consultamos las últimas transacciones
        const response = await request.get(`${baseURL}/transacciones/?limit=10`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        // 2. Validamos el Status Code
        expect(response.status()).toBe(200);

        // 3. Leemos el JSON de la respuesta
        const responseBody = await response.json();

        // 4. Mostramos las transacciones luego de la transferencia
        console.log('Transacciones luego de transferencia:', responseBody);

        // 5. Obtenemos el listado de transacciones
        const transacciones = obtenerTransacciones(responseBody);

        expect(Array.isArray(transacciones)).toBeTruthy();

        // 6. Buscamos la transferencia por motivo o concepto
        const transferenciaEncontrada = transacciones.find((transaccion) =>
            transaccion.id === idTransferencia ||
            transaccion.motivo === motivoTransferencia ||
            transaccion.concepto === motivoTransferencia ||
            transaccion.descripcion === motivoTransferencia ||
            transaccion.description === motivoTransferencia ||
            (
                transaccion.account === cuentaOrigen &&
                Math.abs(Number(transaccion.amount ?? transaccion.monto)) === montoTransferencia
            )
        );

        // 7. Validamos que la transferencia exista en el historial
        expect(transferenciaEncontrada).toBeDefined();
    });

    // Consulta de tarjetas asociadas al cliente usando el token del login:-------------------------------------

    test('CP10 - Consultar tarjetas asociadas al cliente con token válido', async ({ request }) => {
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
        expect(JSON.stringify(responseBody)).toContain(tarjetaDebito);
    });

    // Consulta de préstamos asociados al cliente usando el token del login:-------------------------------------

    test('CP11 - Consultar préstamos asociados al cliente con token válido', async ({ request }) => {
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
