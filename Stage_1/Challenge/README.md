# Entrega: Pruebas de API - Gestión de Cuenta de Usuario

## Objetivo / Historia de usuario

El objetivo de esta entrega es validar mediante Postman y automatización con JavaScript + Playwright los servicios relacionados con la gestión de cuenta de un usuario registrado, incluyendo inicio de sesión, consulta de perfil, cambio de contraseña y recuperación de cuenta.

**Historia de usuario:**

Como usuario registrado de la aplicación, quiero poder consultar mi perfil, cambiar mi contraseña y recuperar mi cuenta si olvido mi clave, para mantener el acceso a mis notas y gestionar mi cuenta de forma segura.

---

## Criterios de aceptación

* El usuario registrado debe poder iniciar sesión con credenciales válidas.
* El usuario registrado debe poder consultar la información de su perfil mediante un endpoint protegido.
* El sistema debe rechazar la consulta del perfil cuando no se envíe un token válido.
* El usuario debe poder cambiar su contraseña si envía correctamente su contraseña actual.
* El sistema no debe permitir el cambio de contraseña cuando la contraseña actual sea incorrecta o la nueva contraseña no cumpla las reglas de seguridad.
* El usuario debe poder iniciar sesión con la nueva contraseña después del cambio.
* El usuario debe poder solicitar recuperación de cuenta con un correo registrado.
* El sistema no debe procesar la recuperación cuando el correo no esté registrado o tenga un formato inválido.
* El usuario debe poder validar un token de recuperación válido.
* El usuario debe poder restablecer su contraseña usando un token de recuperación válido.
* El sistema debe rechazar tokens de recuperación inválidos o expirados.

---

## Estrategia de prueba

Las pruebas se ejecutaron inicialmente en Postman, validando los endpoints de la API relacionados con autenticación y gestión de cuenta.

Adicionalmente, se creó un archivo JavaScript para automatizar parte del flujo usando Playwright, con el objetivo de validar los principales endpoints desde código.

Se probaron flujos positivos y negativos para verificar el comportamiento esperado de la API en diferentes escenarios.

Las funcionalidades cubiertas fueron:

1. Inicio de sesión.
2. Consulta de perfil.
3. Cambio de contraseña.
4. Recuperación de cuenta.
5. Validación de token de recuperación.
6. Restablecimiento de contraseña.

---

## Precondiciones generales

* La API debe estar disponible.
* El usuario debe estar registrado en la aplicación.
* Para los endpoints protegidos, se debe contar con un token válido.
* El token de autenticación se obtiene al ejecutar el endpoint de login.
* En Postman se debe configurar una variable de entorno para reutilizar el token en las demás peticiones.
* En la automatización con JavaScript, el token de login se guarda en una variable para usarlo en los endpoints protegidos.
* Para el flujo de recuperación de contraseña, el token de recuperación llega al correo del usuario y no es expuesto directamente por la API.

---

## Automatización con JavaScript y Playwright

Se creó un archivo JavaScript para automatizar los endpoints principales de la historia de usuario usando Playwright.

Los endpoints automatizados fueron:

* Iniciar sesión.
* Consultar el perfil del usuario.
* Cambiar la contraseña del usuario.
* Solicitar la recuperación de contraseña.
* Validar el token de recuperación de contraseña.
* Restablecer la contraseña del usuario.

### Consideración sobre la recuperación de contraseña

Los endpoints relacionados con la recuperación de contraseña fueron **parcialmente automatizados**.

Esto se debe a que, al solicitar la recuperación de contraseña, la API envía el token de recuperación al correo del usuario. Este token no es expuesto en la respuesta de la API por motivos de seguridad.

Por esta razón, para continuar con el flujo automatizado, fue necesario tomar el token recibido en el correo y dejarlo **hardcodeado temporalmente** en el archivo JavaScript.

Esta solución permite validar el flujo de recuperación y restablecimiento de contraseña, aunque no representa una automatización completa de extremo a extremo.

---

## Casos de prueba en Gherkin BDD

### Feature 1: Autenticación y Perfil

```gherkin
Feature: Autenticación y consulta de perfil por API

  Como usuario registrado
  Quiero iniciar sesión y consultar mi perfil mediante la API
  Para validar que puedo acceder de forma segura a mi información

  Background:
    Given que el usuario está registrado en la aplicación

  @Automatizado
  Scenario: CP01 - Iniciar sesión correctamente
    When envía una petición POST al endpoint de login con credenciales válidas
    Then la API debe responder con status code 200
    And debe retornar un token de autenticación válido

  @Automatizado
  Scenario: CP02 - Consultar perfil correctamente
    Given que el usuario obtuvo un token de autenticación válido
    When envía una petición GET al endpoint de perfil
    And envía el token en el header correspondiente
    Then la API debe responder con status code 200
    And la respuesta debe mostrar los datos del usuario

  Scenario: CP03 - Consultar perfil sin token válido
    When envía una petición GET al endpoint de perfil sin token o con token inválido
    Then la API debe responder con status code 401
    And debe mostrarse un mensaje indicando que el usuario no está autorizado
```

---

### Feature 2: Cambio de Contraseña

```gherkin
Feature: Cambio de contraseña por API

  Como usuario registrado
  Quiero cambiar mi contraseña actual mediante la API
  Para proteger el acceso a mi cuenta

  Background:
    Given que el usuario está registrado en la aplicación
    And cuenta con un token de autenticación válido

  @Automatizado
  Scenario: CP04 - Cambiar contraseña correctamente
    Given que el usuario conoce su contraseña actual
    When envía una petición al endpoint de cambio de contraseña
    And envía su contraseña actual correctamente
    And envía una nueva contraseña válida
    Then la API debe responder con status code 200
    And la contraseña debe actualizarse correctamente

  Scenario: CP05 - No permitir cambio de contraseña con datos inválidos
    When envía una petición al endpoint de cambio de contraseña
    And envía una contraseña actual incorrecta o una nueva contraseña inválida
    Then la API debe responder con status code 400 o 401
    And la contraseña no debe actualizarse

  @Automatizado
  Scenario: CP06 - Iniciar sesión con la nueva contraseña
    Given que el usuario cambió su contraseña correctamente
    When envía una petición POST al endpoint de login usando la nueva contraseña
    Then la API debe responder con status code 200
    And debe retornar un token de autenticación válido
```

---

### Feature 3: Recuperación de Cuenta

```gherkin
Feature: Recuperación de cuenta por API

  Como usuario registrado
  Quiero recuperar mi cuenta si olvido mi contraseña
  Para no perder el acceso a mis notas

  Background:
    Given que el usuario está registrado en la aplicación

  @Automatizado
  Scenario: CP07 - Solicitar recuperación con correo registrado
    When envía una petición al endpoint de recuperación de cuenta
    And envía un correo registrado
    Then la API debe responder con status code 200
    And debe mostrarse un mensaje confirmando el envío de instrucciones de recuperación

  Scenario: CP08 - No permitir recuperación con correo inválido o no registrado
    When envía una petición al endpoint de recuperación de cuenta
    And envía un correo no registrado o con formato inválido
    Then la API debe responder con status code 400 o 404
    And no deben enviarse instrucciones de recuperación

  @ParcialmenteAutomatizado
  Scenario: CP09 - Validar token de recuperación
    Given que el usuario recibió un token de recuperación en su correo
    When envía una petición al endpoint de validación de token
    And envía un token de recuperación válido
    Then la API debe responder con status code 200
    And debe confirmar que el token es válido

  @ParcialmenteAutomatizado
  Scenario: CP10 - Restablecer contraseña con token válido
    Given que el usuario recibió un token de recuperación válido
    When envía una petición al endpoint de restablecimiento de contraseña
    And envía una nueva contraseña válida
    Then la API debe responder con status code 200
    And la contraseña debe restablecerse correctamente

  Scenario: CP11 - No permitir restablecimiento con token inválido o expirado
    When envía una petición al endpoint de restablecimiento de contraseña
    And envía un token inválido o expirado
    Then la API debe responder con status code 400 o 401
    And la solicitud debe ser rechazada
```

---

## Ejecución

Las pruebas fueron ejecutadas manualmente en **Postman**, enviando peticiones HTTP a los endpoints correspondientes de la API.

Para la ejecución manual se usó el archivo JSON de la colección de Postman, el cual contiene los endpoints organizados y listos para ser ejecutados.

### Ejecución en Postman

1. Abrir Postman.
2. Importar el archivo JSON de la colección.
3. Configurar el ambiente de pruebas y las variables necesarias.
4. Ejecutar el endpoint de login para obtener el token.
5. Guardar el token en una variable de entorno.
6. Usar el token en los endpoints protegidos.
7. Ejecutar los casos de prueba incluidos en la colección.
8. Validar:

   * Status code.
   * Mensaje de respuesta.
   * Estructura del body.
   * Datos retornados por la API.
9. Guardar evidencias de los resultados obtenidos.

### Ejecución de pruebas automatizadas con Playwright

También se ejecutaron pruebas automatizadas desde el archivo JavaScript creado con **Playwright**.

Para ejecutar el archivo de automatización, se utiliza el siguiente comando:

```bash
npx playwright test tests/auth.spec.js
```

---

## Resultados

Los resultados de las pruebas se validaron en Postman revisando:

* Código de respuesta HTTP.
* Body de respuesta.
* Mensajes retornados por la API.
* Uso correcto del token.
* Comportamiento esperado en escenarios positivos y negativos.

En la automatización con Playwright, los resultados se validaron mediante:

* Status code esperado.
* Mensajes de respuesta esperados.
* Obtención y reutilización del token de autenticación.
* Ejecución de endpoints protegidos.
* Logs en consola para confirmar datos importantes del flujo.

### Resultado de automatización

| Flujo                                   | Estado                    |
| --------------------------------------- | ------------------------- |
| Inicio de sesión                        | Automatizado              |
| Consulta de perfil                      | Automatizado              |
| Cambio de contraseña                    | Automatizado              |
| Login con nueva contraseña              | Automatizado              |
| Solicitud de recuperación de contraseña | Automatizado              |
| Validación de token de recuperación     | Parcialmente automatizado |
| Restablecimiento de contraseña          | Parcialmente automatizado |

### Observación

La recuperación de contraseña no quedó completamente automatizada porque el token de recuperación no es retornado por la API. El token llega al correo del usuario y fue necesario ingresarlo de forma manual en el código para continuar con el flujo.

---

## Evidencias

Las evidencias pueden incluir:

* Capturas de ejecución en Postman.
  Captura del login exitoso.
  ![alt text](image-10.png)
  Captura de consulta de perfil exitosa. 
  ![alt text](image-11.png)
  Captura de consulta sin token. 
  ![alt text](image-12.png)
  Captura de cambio de contraseña exitoso. 
  ![alt text](image-13.png)
  Captura de Recuperacion de contraseña exitoso.
  ![alt text](image-14.png)
  ![alt text](image-15.png)
  Captura de intento con contraseña incorrecta. 
  ![alt text](image-16.png)
  Captura de recuperación de cuenta. 
  ![alt text](image-17.png)
* Captura de ejecución en consola con Playwright.
  ![alt text](image-9.png)
* Colección de Postman exportada en formato JSON.
* Archivo JavaScript de automatización.
* Reporte HTML.
  ![alt text](image-8.png)
