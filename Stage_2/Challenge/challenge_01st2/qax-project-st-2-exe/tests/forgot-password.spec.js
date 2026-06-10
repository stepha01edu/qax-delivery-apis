import { test, expect } from '@playwright/test';
import { crearCuentaCorreo, obtenerUltimoCorreo, extraerTokenDeCorreo } from '../utils/tmpEmailReader'; //Importo la generacion del correo del user
import { generarUsuario } from '../utils/dataGenerator';  // importa funcion del utils para generar data

/**
 * test.describe.serial  hace que los tests se ejecuten en ORDEN y en SERIE:
 * - El test 2 NO empieza hasta que el test 1 termine.
 * - Si un test FALLA, los siguientes se SALTAN automáticamente.
 * 
 * Esto es ideal para flujos End-to-End donde cada paso 
 * depende del resultado del paso anterior.
 * (Sin .serial, Playwright ejecutaría los tests en paralelo)
 */
test.describe.serial('Recuperacion de Contraseña por Correo Electrónico', () => {

    let usuarioDinamico;
    let emailCorreo;
    let tokenCorreo;
    let tokenReset;
    const nuevaPassword = 'Qwerty1234';

    /**
     * beforeAll: se ejecuta UNA SOLA VEZ antes de todos los tests.
     * Aquí preparamos el buzón de Mail.tm como HERRAMIENTA AUXILIAR.
     * No es un test en sí, es solo preparar el entorno.
     * Si falla, el flujo continúa (no debería bloquear los tests de la API).
     */
    test.beforeAll(async () => {
        try {
            //genero el user el data generator
            usuarioDinamico = generarUsuario();
            console.log('el user creado es', usuarioDinamico.name, 'y el correo temporal del user es', usuarioDinamico.email, 'mediante el generador de datos, el mail se actualizara luego al registrar el user en la API');

            //creo el correo temporal en Mail.tm
            const usuarioMail = `stephamail_${Date.now()}`;
            const cuenta = await crearCuentaCorreo(usuarioMail, 'Mailqwerty123');

            //Guardo email y token que llego al buzon del correo
            emailCorreo = cuenta.email;
            tokenCorreo = cuenta.token;

            //el correo temporal que se creo del user, lo reemplazo por el correo que ge genero para lograr dar uso al correo real de Mail.tm
            console.log('reemplazo el correo dinamico ', usuarioDinamico.email, ' por el correo real creado ', emailCorreo)
            usuarioDinamico.email = emailCorreo;

            console.log('Correo real creado correctamente:', usuarioDinamico.email);

        } catch (error) {
            console.log('No se pudo crear el correo real');
            throw error;
        }
    });

    test('Paso 1: Registrar usuario nuevo en Notes API', async ({ request }) => {

        console.log('El user que se va a registrar es ', usuarioDinamico.name, ' con el correo ', usuarioDinamico.email, ' y su password sera ', usuarioDinamico.password);

        const res = await request.post('users/register', {
            data: {
                name: usuarioDinamico.name,
                email: usuarioDinamico.email,
                password: usuarioDinamico.password
            }
        });

        const body = await res.json();
        console.log('Status registro:', res.status());
        console.log('Body registro:', body);

        expect(res.status()).toBe(201); // Creacion exitosa del user
        expect(body.success).toBe(true);

        expect(body.data.name).toBe(usuarioDinamico.name); // el nombre guardado debe ser igual al nombre enviado en la api
        expect(body.data.email).toBe(usuarioDinamico.email); // el email guardado debe ser igual al email enviado en la api

        console.log('✅ Usuario registrado correctamente en Notes API');
        //console.log('Nombre:', usuarioDinamico.name);
        //console.log('Email:', usuarioDinamico.email);
        console.log('Data creada:', body.data);
    });

    test('Paso 2: Iniciar sesión con el usuario creado', async ({ request }) => {
        const res = await request.post('users/login', {
            data: {
                email: usuarioDinamico.email,
                password: usuarioDinamico.password
            }
        });

        expect(res.status()).toBe(200);
        const body = await res.json();
        console.log('✅ Login exitoso');
        expect(body.data.email).toBe(emailCorreo);
        console.log('Se inicio sesion con el user', usuarioDinamico.email);
    });

    test('Paso 3: Solicitar recuperación de contraseña (forgot-password)', async ({ request }) => {
        const res = await request.post('users/forgot-password', {
            data: {
                email: usuarioDinamico.email
            }
        });

        expect(res.status()).toBe(200);
        const body = await res.json();
        console.log(`✅ ${body.message}`);
        expect(body.success).toBe(true);
        console.log('Se solicito la recuperacion de la contraseña al correo', usuarioDinamico.email);
    });

    test('Paso 4: Leer el correo de recuperación y extraer el token', async () => {
        // Si Mail.tm no está disponible, saltamos este paso
        if (!tokenCorreo) {
            console.log('⚠️ Sin buzón de Mail.tm, no se puede leer el correo.');
            console.log('   El flujo de API ya fue probado en los pasos anteriores.');
            test.skip();
            return;
        }

        console.log('⏳ Esperando el correo de recuperación...');
        const correo = await obtenerUltimoCorreo(tokenCorreo);  //que pasa si el ultimo correo que se recibe no es el del token?

        console.log(`📧 Asunto: "${correo.subject}"`);
        console.log(`📝 De: "${correo.from?.address || 'desconocido'}"`);

        const contenidoCompleto = (correo.text || '') + '\n' + (correo.html || '');
        tokenReset = extraerTokenDeCorreo(contenidoCompleto); // que sucede si el correo no tiene token?

        expect(tokenReset).not.toBeNull();
        expect(tokenReset.length).toBeGreaterThan(5);
        console.log('el token que fue obtenido del mail', usuarioDinamico.email, 'es', tokenReset);
    });


    test('Paso 5: Verificar que el token es válido', async ({ request }) => {
        if (!tokenReset) { test.skip(); return; }

        const res = await request.post('users/verify-reset-password-token', {
            data: { token: tokenReset }
        });

        expect(res.status()).toBe(200);
        const body = await res.json();
        console.log(`✅ ${body.message}`);
        expect(body.success).toBe(true);
        console.log('Se valido correctamente el token enviado al mail', usuarioDinamico.email)
    });

    test('Paso 6: Cambiar la contraseña con el token', async ({ request }) => {
        if (!tokenReset) { test.skip(); return; }

        const res = await request.post('users/reset-password', {
            data: { token: tokenReset, newPassword: nuevaPassword }
        });

        expect(res.status()).toBe(200);
        const body = await res.json();
        console.log(`✅ ${body.message}`);
        expect(body.success).toBe(true);
        console.log('Se recupero correctamente la contraseña para el user con mail', usuarioDinamico.email);
    });

    test('Paso 7: Iniciar sesión con la nueva contraseña', async ({ request }) => {
        if (!tokenReset) { test.skip(); return; }

        const res = await request.post('users/login', {
            data: { email: usuarioDinamico.email, password: nuevaPassword }
        });

        expect(res.status()).toBe(200);
        const body = await res.json();
        console.log('✅ Login con nueva contraseña exitoso');
        expect(body.data.email).toBe(usuarioDinamico.email);
    });
    console.log('Flujo completado con exito');  // porque no se esta mostrando este log?
});
