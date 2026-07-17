const { test, expect } = require('@playwright/test');


test.describe('Estado del Sistema y Autenticación', () => {

    const baseURL = 'https://practice.expandtesting.com/notes/api';
    const userName = 'Stephania';
    const userEmail = 'stephaniasoe.edu+1@gmail.com';
    let userPassword = 'Qwerty123!';
    let newUserPassword = 'Qwerty1234';
    let token;
    let recoveryToken;  //Pegar token de recuperacion de contraseña recibido en el mail.
    let recoveryPassword;
    //const readline = require('readline/promises'); //Variable para la funcion de solicitar datos

    /* Funcion para pedir el dato desde la terminal ----- NO FUNCIONO    
        // Funcion para pedir el token de recurperacion del mail al user
    
        function pedirDato(mensaje) {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
    
            return new Promise((resolve) => {
                rl.question(mensaje, (respuesta) => {
                    rl.close();
                    resolve(respuesta);
                });
            });
        }
    */
    /*
        // Sanity check del sistema:-------------------------------------
    
        test('CP01 - Verificar la salud de la API (Health Check)', async ({ request }) => {
            // 1. Hacemos la petición (Igual que el botón SEND en Postman)
            const response = await request.get(`${baseURL}/health-check`);
    
            // 2. Validamos el Status Code
            expect(response.status()).toBe(200);
    
            // 3. Leemos el JSON de la respuesta y validamos el mensaje
            const responseBody = await response.json();
            expect(responseBody.message).toBe('Notes API is Running');
        });
        
            // Registro del user:-------------------------------------
        
            test('CP02 - Registrar un usuario exitosamente', async ({ request }) => {
                const response = await request.post(`${baseURL}/users/register`, {
                    data: {
                        name: userName,
                        email: userEmail,
                        password: userPassword
                    }
                });
        
                expect(response.status()).toBe(201);
        
                const responseBody = await response.json();
                expect(responseBody.message).toBe('User account created successfully');
            });
   */
    /*
      // Inicio de sesion del user registrado:-------------------------------------
  
      test('CP01 - Iniciar sesión con credenciales válidas', async ({ request }) => {
          const response = await request.post(`${baseURL}/users/login`, {
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
          console.log("el token de inicio de sesion es", token);
      });
  
      // NUEVA SESION DEL CODIGO DE ACUERDO A LOS NUEVOS TEST CASES REQUERIDOS EN EL CHALLENGE
  
      // Visualizacion del profile del user registrado:-------------------------------------
  
      test('CP02 - Consultar perfil correctamente', async ({ request }) => {
          const response = await request.get(`${baseURL}/users/profile`, {
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
  
      // Cambio de contraseña del user registrado:-------------------------------------
  
      test('CP03 - Cambiar contraseña correctamente', async ({ request }) => {
  
          //valido cual es la contraseña actua del user
          console.log("La password del user actualemente es ", userPassword);
  
          const response = await request.post(`${baseURL}/users/change-password`, {
              headers: {
                  'x-auth-token': token,
                  'Content-Type': 'application/json'
              },
              data: {
                  currentPassword: userPassword,
                  newPassword: newUserPassword
              }
          });
  
          expect(response.status()).toBe(200);
  
          const responseBody = await response.json();
          expect(responseBody.message).toBe('The password was successfully updated');
  
          // Actualizo la contraseña actual con la nueva contraseña del user, como puedo hacer para que la nueva password no sea un valor estatico, sino que sea dinamico? podria agregar un numero he irlo incrementando en cada ejecucion del test? como podria mantenerlo? seria un for central? de ser asi, donde puedo almacenar la informacion de cuantas veces puedo ejecutar esta suit? la duda surge porque al volverlo a ejecutar con un resultado exitoso, el nuevo resultado es un 400 porque valida que la nueva contraseña no sea la misma de la anterior.
          userPassword = newUserPassword;
  
          // Valido cual es la nueva contraseña del user
          console.log("Se ejecutó bien usando el token del inicio de sesion", token);
          console.log("la nueva contraseña del user es ", userPassword);
      });
  
      // Solicitud de recuperacion de contraseña del user registrado:-------------------------------------
  
      test('CP04 - Solicitar recuperación con correo registrado', async ({ request }) => {
  
          const response = await request.post(`${baseURL}/users/forgot-password`, {
              data: {
                  email: userEmail
              }
          });
  
          expect(response.status()).toBe(200);
  
          const responseBody = await response.json();
          expect(responseBody.message).toBe('Password reset link successfully sent to stephaniasoe.edu+1@gmail.com. Please verify by clicking on the given link');
          console.log("Se ha solicitado recuperacion de contraseña mediante email");
  
      });
  */


    // Validacion del token obtenido del user registrado mediante correo electronico:-------------------------------------
    // PARCIALMENTE AUTOMATIZABLE debido a que la api no expone el token y no se puede acceder al mail del user

    test('CP05 - Validar token de recuperacion de contraseña', async ({ request }) => {

        console.log('Antes de pedir el token');
        //test.setTimeout(120000);

        //let tokenIngresado = await pedirDato('Ingresa el token de recuperación: ');
        recoveryToken = process.env.RECOVERY_TOKEN;
        expect(recoveryToken).toBeDefined();

        console.log('Continuó después de ingresar el token');
        //recoveryToken = tokenIngresado.trim();

        const response = await request.post(`${baseURL}/users/verify-reset-password-token`, {
            data: {
                token: recoveryToken
            }
        });

        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        expect(responseBody.message).toBe('The provided password reset token is valid');
        // Asigno el token a la variable global para hacer uso de el en el siguiente metodo

        console.log("Se ha validado exitosamente el token de recuperacion  ", recoveryToken);
    });



    // Restablecer contraseña con token válido del user registrado, token obtenido del correo electronico:-------------------------------------
    // PARCIALMENTE AUTOMATIZABLE debido a que la api no expone el token y no se puede acceder al mail del user

    test('CP06 - Reestablecer contraseña con token del correo de recuperacion', async ({ request }) => {
        recoveryPassword = "Qwerty123!"
        console.log("Se reestablecera la contraseña")
        const response = await request.post(`${baseURL}/users/reset-password`, {
            data: {
                token: recoveryToken,
                //token obtenido desde la url recibida en el mail
                newPassword: recoveryPassword
            }
        });

        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        expect(responseBody.message).toBe('The password was successfully updated');
        // Se asigno al user la nueva password de recuperacion
        userPassword = recoveryPassword;
        console.log("La contraseña de ha recuperado exitosamente, su nueva contraseña es ", userPassword);
    });

});
