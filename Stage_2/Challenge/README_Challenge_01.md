# Challenge - Recuperación de Contraseña con Playwright API Testing

## ¿Qué es?

Este ejercicio corresponde a un escenario de complejidad media del **Stage_2** de la mentoría, orientado a escalar un proyecto de automatización de APIs con **Playwright**.

El objetivo principal fue crear un nuevo archivo de prueba independiente para validar el flujo de recuperación de contraseña de un usuario en la aplicación **Notes**, reutilizando funciones auxiliares, manejando variables dinámicas y validando un flujo End-to-End real.

Durante la implementación se trabajó con:

* Creación de un nuevo archivo `.spec.js`.
* Reutilización de funciones desde `utils/dataGenerator.js`.
* Creación de un correo temporal usando Mail.tm.
* Registro de usuario dinámico.
* Solicitud de recuperación de contraseña.
* Obtención del token de recuperación.
* Validación del token de recuperación.
* Restablecimiento de contraseña.
* Login exitoso con la nueva contraseña.

---

## Título de la entrega

Automatización del flujo de recuperación de contraseña con Playwright API Testing

---

## Objetivo / Historia de usuario

El objetivo de esta entrega es automatizar el flujo de recuperación de contraseña para un usuario registrado en la aplicación **Notes**, validando que el usuario pueda solicitar la recuperación, obtener un token válido, restablecer su contraseña e iniciar sesión exitosamente con la nueva contraseña.

Adicionalmente, se busca reforzar buenas prácticas de automatización como la separación de responsabilidades, reutilización de funciones, uso de datos dinámicos, manejo de variables globales y organización del código en archivos independientes.

**Historia de usuario:**

Como usuario de la aplicación **Notes** que olvidó su credencial, quiero solicitar un enlace de restablecimiento, verificar mi identidad y crear una nueva contraseña, para recuperar el acceso a mi cuenta y mis notas de forma segura.

---

## Base URL

La API utilizada para este challenge es:

```text
https://practice.expandtesting.com/notes/api
```

En el proyecto, la URL base se configura de forma global en `playwright.config.js` para evitar repetirla en cada petición.

---

## Criterios de aceptación

* El proyecto debe escalarse agregando un nuevo archivo de prueba independiente.
* El archivo de prueba debe estar ubicado en la carpeta `tests/`.
* Se debe reutilizar la función generadora de datos creada previamente en `utils/dataGenerator.js`.
* La prueba debe registrar un usuario dinámico antes de iniciar el flujo de recuperación de contraseña.
* El usuario registrado debe poder solicitar la recuperación de contraseña mediante el endpoint `POST /users/forgot-password`.
* La solicitud de recuperación debe responder con status code `200`.
* Se debe obtener un token de recuperación válido.
* El token de recuperación debe ser diferente al token de login.
* El token de recuperación debe poder reutilizarse en los endpoints posteriores del flujo.
* El token debe validarse mediante el endpoint `POST /users/verify-reset-password-token`.
* La contraseña debe restablecerse mediante el endpoint `POST /users/reset-password`.
* El usuario debe poder iniciar sesión con el correo original y la nueva contraseña.
* El login final debe responder con status code `200`, confirmando que el cambio de contraseña fue aplicado correctamente.
* El flujo debe ejecutarse correctamente con Playwright.
* Los resultados deben estar documentados con evidencia de ejecución.

---

## Alcance del challenge

El alcance principal del challenge fue automatizar el flujo completo de recuperación de contraseña.

El flujo automatizado incluye:

1. Crear un usuario dinámico.
2. Registrar el usuario en Notes API.
3. Solicitar recuperación de contraseña.
4. Obtener el token de recuperación.
5. Verificar que el token de recuperación sea válido.
6. Restablecer la contraseña.
7. Iniciar sesión con la nueva contraseña.

---

## Estrategia de prueba

La estrategia consistió en crear un flujo automatizado End-to-End usando Playwright API Testing.

El flujo se implementó en un archivo independiente para mantener el proyecto organizado y escalable. Además, se reutilizaron funciones auxiliares para generar datos dinámicos y para trabajar con el correo temporal usado durante la recuperación de contraseña.

La prueba valida el flujo completo desde la preparación del usuario hasta la confirmación final de que la nueva contraseña permite iniciar sesión exitosamente.

---

## Precondiciones

* Tener instalado Node.js.
* Tener instalado Playwright en el proyecto.
* Tener instalada la librería `@faker-js/faker`.
* Tener configurada la URL base en `playwright.config.js`.
* La API de Notes debe estar disponible.
* El servicio Mail.tm debe estar disponible para crear el correo temporal.
* El proyecto debe contar con una carpeta `tests/`.
* El proyecto debe contar con una carpeta `utils/`.
* El archivo `utils/dataGenerator.js` debe estar disponible para generar datos dinámicos.
* El archivo utilitario para lectura de correo temporal debe estar disponible.

---

## Estructura del proyecto

La estructura esperada del proyecto es:

```text
Stage_2/
└── Challenge/
    └── qax-project-automation-apis-stage2/
        ├── tests/
        │   └── forgot-password.spec.js
        ├── utils/
        │   ├── dataGenerator.js
        │   └── tmpEmailReader.js
        ├── Evidences/
        ├── playwright.config.js
        ├── package.json
        └── README.md
```

---

## Archivos principales

### `tests/forgot-password.spec.js`

Archivo principal del challenge.

Contiene el flujo automatizado de recuperación de contraseña:

* Registro del usuario.
* Solicitud de recuperación.
* Obtención del token.
* Validación del token.
* Restablecimiento de contraseña.
* Login con la nueva contraseña.

---

### `utils/dataGenerator.js`

Archivo utilitario encargado de generar datos dinámicos para el usuario.

Este archivo permite evitar el uso de datos fijos y mejora la mantenibilidad de las pruebas.

---

### `utils/tmpEmailReader.js`

Archivo utilitario encargado de interactuar con Mail.tm.

Se utiliza para:

* Crear una cuenta de correo temporal.
* Obtener el token del buzón.
* Leer el último correo recibido.
* Extraer el token de recuperación desde el contenido del correo.

---

## Casos de prueba

### CP01 - Registrar usuario nuevo en Notes API

**Objetivo:**  
Registrar un usuario nuevo utilizando datos dinámicos y un correo temporal real.

**Endpoint:**

```text
POST /users/register
```

**Validaciones:**

* El status code debe ser `201`.
* La respuesta debe indicar que el usuario fue creado correctamente.
* El nombre retornado debe coincidir con el nombre generado.
* El email retornado debe coincidir con el email temporal utilizado.

**Resultado esperado:**

```text
Usuario registrado correctamente en Notes API
```

---

### CP02 - Solicitar recuperación de contraseña

**Objetivo:**  
Solicitar la recuperación de contraseña para el usuario registrado.

**Endpoint:**

```text
POST /users/forgot-password
```

**Validaciones:**

* El status code debe ser `200`.
* La respuesta debe indicar que la solicitud fue procesada correctamente.
* El sistema debe generar un token de recuperación.

**Resultado esperado:**

```text
Solicitud de recuperación enviada correctamente
```

---

### CP03 - Obtener token de recuperación

**Objetivo:**  
Obtener el token de recuperación asociado al usuario.

**Validaciones:**

* El token no debe ser nulo.
* El token debe tener una longitud válida.
* El token debe poder reutilizarse en los siguientes endpoints.

**Resultado esperado:**

```text
Token de recuperación obtenido correctamente
```

---

### CP04 - Verificar token de recuperación

**Objetivo:**  
Validar que el token de recuperación sea correcto y no haya expirado.

**Endpoint:**

```text
POST /users/verify-reset-password-token
```

**Validaciones:**

* El status code debe ser `200`.
* La respuesta debe confirmar que el token es válido.
* El flujo debe continuar solamente si el token es aceptado.

**Resultado esperado:**

```text
Token validado correctamente
```

---

### CP05 - Restablecer contraseña

**Objetivo:**  
Restablecer la contraseña del usuario utilizando el token de recuperación.

**Endpoint:**

```text
POST /users/reset-password
```

**Validaciones:**

* El status code debe ser `200`.
* La respuesta debe confirmar que la contraseña fue restablecida correctamente.

**Resultado esperado:**

```text
Contraseña restablecida correctamente
```

---

### CP06 - Iniciar sesión con la nueva contraseña

**Objetivo:**  
Validar de extremo a extremo que la nueva contraseña quedó aplicada correctamente.

**Endpoint:**

```text
POST /users/login
```

**Validaciones:**

* El status code debe ser `200`.
* La respuesta debe indicar login exitoso.
* El email retornado debe coincidir con el email del usuario registrado.

**Resultado esperado:**

```text
Login exitoso con la nueva contraseña
```

---

## Ejecución

Para ejecutar el challenge, ubicarse en la raíz del proyecto donde se encuentra el archivo `playwright.config.js`.

Ejecutar el archivo específico:

```bash
npx playwright test tests/forgot-password.spec.js
```

Ejecutar con un solo worker para asegurar ejecución controlada:

```bash
npx playwright test tests/forgot-password.spec.js --workers 1
```

Generar reporte HTML:

```bash
npx playwright test tests/forgot-password.spec.js --reporter=html
```

Abrir reporte HTML:

```bash
npx playwright show-report
```

Ejecutar desde Playwright Test Explorer en VS Code:

1. Abrir el proyecto en VS Code.
2. Ir al panel de Testing.
3. Ubicar el archivo `forgot-password.spec.js`.
4. Ejecutar los tests desde la opción de Playwright Test Explorer.

---

## Resultados esperados

Al ejecutar la automatización se espera que:

* El usuario dinámico sea generado correctamente.
* El correo temporal sea creado correctamente.
* El usuario sea registrado exitosamente en Notes API.
* El sistema permita solicitar recuperación de contraseña.
* El token de recuperación sea obtenido correctamente.
* El token sea validado exitosamente.
* La contraseña sea restablecida correctamente.
* El usuario pueda iniciar sesión con la nueva contraseña.
* Todas las pruebas finalicen en estado exitoso.

---

## Resultados obtenidos

Durante la ejecución del challenge se validó exitosamente el flujo de recuperación de contraseña.

Resultados principales:

* Se creó correctamente el usuario dinámico.
* Se generó correctamente el correo temporal.
* Se registró el usuario en Notes API.
* Se solicitó la recuperación de contraseña.
* Se obtuvo el token de recuperación.
* Se validó correctamente el token.
* Se restableció la contraseña.
* Se inició sesión exitosamente con la nueva contraseña.
* El flujo End-to-End fue completado correctamente.
* La ejecución se realizó correctamente desde Playwright Test Explorer.

---

## Evidencias

La evidencia de esta entrega corresponde a una captura donde se observa la ejecución exitosa de los tests por medio de **Playwright Test Explorer**.

La evidencia se encuentra en la carpeta:

```text
evidencias/
```

Referencia de la evidencia:

```markdown
![Evidencia](qax-project-st-2-exe/Evidences/image.png)


```

---

## Notas técnicas

* Se utilizó `test.describe.serial` porque el flujo depende del resultado de los pasos anteriores. Esto permite que los tests se ejecuten en orden y evita que los pasos posteriores corran si un paso previo falla.
* Se mantuvo el uso de Mail.tm para generar un correo temporal real y poder trabajar con el flujo de recuperación de contraseña por correo electrónico.
* Se mantuvo un bloque `try/catch` en el `beforeAll` para controlar errores durante la preparación del flujo. Si falla la creación del correo temporal, se usa `throw error` para detener la ejecución y evitar continuar con datos incompletos.
* Se reutilizó `utils/dataGenerator.js` para generar datos dinámicos del usuario, evitando datos fijos y conflictos con usuarios previamente registrados.
* Se recomienda ejecutar este flujo con `--workers 1`, ya que es un flujo dependiente y debe ejecutarse de forma controlada y secuencial.
* Se utilizó Playwright API Testing para consumir directamente los endpoints de la API.
* Se ejecutó y validó el flujo desde Playwright Test Explorer en VS Code, lo que permitió visualizar la ejecución correcta de los tests desde la interfaz.

---

## Conclusión

El challenge fue completado exitosamente, validando un flujo End-to-End de recuperación de contraseña con Playwright API Testing.

La automatización permitió registrar un usuario dinámico, solicitar recuperación de contraseña, obtener y validar el token de recuperación, restablecer la contraseña e iniciar sesión con la nueva credencial.

Además, se aplicaron buenas prácticas como:

* Organización del código en archivos independientes.
* Reutilización de funciones utilitarias.
* Uso de datos dinámicos.
* Manejo de variables compartidas.
* Ejecución serial para flujos dependientes.
* Uso de Mail.tm para flujo de recuperación por correo.
* Ejecución y validación desde Playwright Test Explorer.