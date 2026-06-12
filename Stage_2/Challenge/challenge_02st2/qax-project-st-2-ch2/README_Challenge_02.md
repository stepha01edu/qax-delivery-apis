# Challenge - Book Store API: Flujo completo con Token

## ¿Qué es?

Este challenge corresponde al **Stage_2** de la mentoría, enfocado en automatizar un flujo completo de interacción con la **Book Store API** usando **Playwright**.

El objetivo principal fue validar un flujo End-to-End donde se registra un usuario, se genera un token de autenticación, se consulta la información del usuario, se obtiene la lista de libros disponibles, se extrae dinámicamente el ISBN del primer libro y finalmente se agrega ese libro al usuario autenticado.

Este ejercicio permite practicar:

* Organización de pruebas en archivos `.spec.js`.
* Uso de funciones reutilizables desde la carpeta `utils`.
* Generación de datos dinámicos con `@faker-js/faker`.
* Manejo de variables compartidas entre tests.
* Uso de token JWT para consumir endpoints protegidos.
* Extracción de datos dinámicos desde una respuesta JSON.

---

## Título de la entrega

Automatización del flujo completo de Book Store API con token JWT

---

## Objetivo / Historia de usuario

El objetivo de esta entrega es automatizar el flujo de registro y acceso seguro a la **Book Store API**, validando que un usuario pueda ser creado dinámicamente, obtener un token de autenticación y consumir endpoints protegidos para consultar su información y agregar un libro a su cuenta.

**Historia de usuario:**

Como usuario/automatizador de pruebas, quiero poder registrar un usuario, obtener un token de autenticación y consumir endpoints protegidos con ese token, para verificar que la API maneja correctamente el alta de usuarios, la emisión de tokens y el acceso autorizado a información sensible.

---

## Base URL

La API utilizada para este challenge es:

```text
https://demoqa.com
```

La URL base se configura en el archivo `playwright.config.js`, permitiendo que los tests usen rutas relativas para consumir los endpoints.

---

## Criterios de aceptación

* El proyecto debe contener un archivo de prueba automatizada dentro de la carpeta `tests`.
* El proyecto debe contar con un archivo utilitario en la carpeta `utils` para generar datos dinámicos.
* El usuario debe ser generado dinámicamente.
* El usuario debe registrarse correctamente mediante el endpoint `POST /Account/v1/User`.
* El sistema debe retornar un `userID` válido después del registro.
* El sistema debe generar un token JWT mediante el endpoint `POST /Account/v1/GenerateToken`.
* El token generado debe ser válido y reutilizable.
* Se debe consultar la información del usuario mediante `GET /Account/v1/User/{userId}` usando autorización Bearer.
* Se debe obtener la lista de libros disponibles mediante `GET /BookStore/v1/Books`.
* Se debe extraer dinámicamente el ISBN del primer libro retornado por la API.
* Se debe agregar el libro al usuario mediante `POST /BookStore/v1/Books`.
* La petición para agregar el libro debe usar el token JWT en el header `Authorization`.
* El sistema debe responder con status code `201` al agregar el libro correctamente.
* Los tests deben ejecutarse correctamente y pasar en estado exitoso.

---

## Alcance automatizado

El flujo automatizado incluye los siguientes pasos:

1. Generar usuario dinámico.
2. Registrar usuario válido.
3. Obtener token JWT con credenciales válidas.
4. Consultar información del usuario usando token.
5. Obtener lista de libros disponibles.
6. Extraer el ISBN del primer libro.
7. Agregar el libro al usuario usando token de autenticación.

---

## Estrategia de prueba

La estrategia utilizada fue automatizar un flujo End-to-End con Playwright, manteniendo los pasos en orden mediante `test.describe.serial`, ya que cada prueba depende de información generada en pasos anteriores.

El flujo inicia con la generación dinámica de un usuario mediante una función reutilizable ubicada en `utils/dataGenerator.js`. Luego se registra el usuario en la API, se guarda el `userId` retornado, se genera un token JWT, se consulta el perfil del usuario autenticado, se obtiene la lista de libros disponibles y se extrae el primer ISBN para agregarlo al usuario.

Durante la ejecución se validan:

* Status code de cada respuesta.
* Estructura básica del body.
* Existencia del `userId`.
* Existencia del token JWT.
* Coincidencia del usuario consultado con el usuario creado.
* Existencia de libros disponibles.
* Extracción correcta del primer ISBN.
* Confirmación de que el libro fue agregado correctamente.

---

## Precondiciones

* Tener instalado Node.js.
* Tener instalado Playwright en el proyecto.
* Tener instalada la librería `@faker-js/faker`.
* Tener configurada la Base URL `https://demoqa.com` en `playwright.config.js`.
* La API de DemoQA debe estar disponible.
* El proyecto debe contar con una carpeta `tests`.
* El proyecto debe contar con una carpeta `utils`.
* El archivo `utils/dataGenerator.js` debe estar disponible para generar usuarios dinámicos.

---

## Estructura del proyecto

```text
Stage_2/
└── Challenge/
    └── qax-book-store-api/
        ├── tests/
        │   └── book-store.spec.js
        ├── utils/
        │   └── dataGenerator.js
        ├── evidencias/
        ├── playwright.config.js
        ├── package.json
        └── README.md
```

---

## Archivos principales

### `tests/book-store.spec.js`

Archivo principal de pruebas automatizadas.

Contiene el flujo completo de Book Store API:

* Registro de usuario.
* Generación de token.
* Consulta de información del usuario.
* Consulta de libros.
* Extracción del primer ISBN.
* Agregado del libro al usuario.

---

### `utils/dataGenerator.js`

Archivo utilitario encargado de generar datos dinámicos para las pruebas.

Este archivo genera:

* `userName` dinámico.
* `userPassword` dinámico.

El uso de este archivo permite evitar datos quemados, reducir conflictos por usuarios previamente registrados y mejorar la reutilización del código.

---

## Manejo de variables compartidas

El flujo utiliza variables compartidas dentro del bloque `test.describe.serial` para reutilizar información entre pasos.

Variables principales:

| Variable | Uso |
| --- | --- |
| `usuarioDinamico` | Guarda el usuario generado dinámicamente |
| `userId` | Guarda el identificador del usuario creado |
| `tokenAuth` | Guarda el token JWT generado |
| `primerIsbn` | Guarda el ISBN del primer libro de la lista |

Estas variables permiten conectar los pasos del flujo y reutilizar datos obtenidos en respuestas anteriores.

---

## Casos de prueba automatizados

### CP01 - Registrar usuario válido

**Objetivo:**  
Crear un usuario válido en la Book Store API usando datos dinámicos.

**Endpoint:**

```text
POST /Account/v1/User
```

**Validaciones:**

* El status code debe ser `201`.
* El username retornado debe coincidir con el username generado.
* La respuesta debe contener un `userID`.
* El `userID` debe almacenarse para los siguientes pasos.

**Resultado esperado:**

```text
Usuario registrado correctamente con userId
```

---

### CP02 - Generar token JWT con credenciales válidas

**Objetivo:**  
Generar un token JWT usando las credenciales del usuario creado.

**Endpoint:**

```text
POST /Account/v1/GenerateToken
```

**Validaciones:**

* El status code debe ser `200`.
* El status de la respuesta debe ser `Success`.
* La respuesta debe contener un token válido.
* El token debe almacenarse para consumir endpoints protegidos.

**Resultado esperado:**

```text
Token JWT obtenido correctamente
```

---

### CP03 - Consultar información del usuario con token

**Objetivo:**  
Consultar la información del usuario creado usando el token JWT.

**Endpoint:**

```text
GET /Account/v1/User/{userId}
```

**Autenticación:**

```text
Authorization: Bearer token
```

**Validaciones:**

* El status code debe ser `200`.
* El `userId` retornado debe coincidir con el `userId` almacenado.
* El username retornado debe coincidir con el usuario generado.

**Resultado esperado:**

```text
Información del usuario consultada correctamente
```

---

### CP04 - Obtener lista de libros y extraer el primer ISBN

**Objetivo:**  
Consultar la lista de libros disponibles y obtener dinámicamente el ISBN del primer libro retornado.

**Endpoint:**

```text
GET /BookStore/v1/Books
```

**Validaciones:**

* El status code debe ser `200`.
* La respuesta debe contener el arreglo `books`.
* El arreglo de libros debe tener al menos un elemento.
* El primer libro debe contener un ISBN válido.
* El ISBN debe almacenarse para el siguiente paso.

**Resultado esperado:**

```text
Primer ISBN obtenido correctamente
```

---

### CP05 - Agregar el primer libro al usuario usando token

**Objetivo:**  
Agregar al usuario el primer libro obtenido desde la lista de libros.

**Endpoint:**

```text
POST /BookStore/v1/Books
```

**Autenticación:**

```text
Authorization: Bearer token
```

**Validaciones:**

* El status code debe ser `201`.
* La respuesta debe contener el arreglo `books`.
* El ISBN retornado debe coincidir con el ISBN enviado.
* El libro debe quedar asociado al usuario.

**Resultado esperado:**

```text
Libro agregado correctamente al usuario
```

---

## Ejecución

Para ejecutar el challenge, ubicarse en la raíz del proyecto donde se encuentra el archivo `playwright.config.js`.

Ejecutar el archivo específico:

```bash
npx playwright test tests/book-store.spec.js
```

Ejecutar con un solo worker para mantener el flujo controlado:

```bash
npx playwright test tests/book-store.spec.js --workers 1
```

Generar reporte HTML:

```bash
npx playwright test tests/book-store.spec.js --reporter=html
```

Abrir reporte HTML:

```bash
npx playwright show-report
```

También se puede ejecutar desde **Playwright Test Explorer** en VS Code:

1. Abrir el proyecto en VS Code.
2. Ir al panel de Testing.
3. Ubicar el archivo `book-store.spec.js`.
4. Ejecutar los tests desde Playwright Test Explorer.

---

## Resultados esperados

Al ejecutar la automatización se espera que:

* El usuario dinámico sea generado correctamente.
* El usuario sea registrado exitosamente.
* La API retorne un `userID`.
* El token JWT sea generado correctamente.
* El perfil del usuario sea consultado usando autorización Bearer.
* La lista de libros sea obtenida correctamente.
* El primer ISBN sea extraído desde la respuesta de libros.
* El libro sea agregado correctamente al usuario.
* Todos los tests finalicen en estado exitoso.

---

## Resultados obtenidos

Durante la ejecución del challenge se validó exitosamente el flujo completo de Book Store API.

Resultados principales:

* Se generó correctamente un usuario dinámico.
* Se registró el usuario en la API.
* Se obtuvo correctamente el `userId`.
* Se generó correctamente el token JWT.
* Se consultó la información del usuario autenticado.
* Se obtuvo la lista de libros.
* Se extrajo correctamente el primer ISBN de la lista.
* Se agregó el libro al usuario usando el token JWT.
* El flujo completo finalizó exitosamente.

---

## Evidencias


La evidencia principal corresponde a una captura donde se observa la ejecución exitosa de los tests.

Referencia de la evidencia:

```markdown
![Ejecución exitosa Book Store API](evidencias/image01.png)
![Reporte](image.png)
```

---

## Notas técnicas

* Se utilizó `test.describe.serial` porque el flujo depende de datos generados en pasos anteriores. Esto asegura que los tests se ejecuten en orden.
* Se utilizó `test.beforeAll` para generar una sola vez el usuario dinámico antes de ejecutar los tests.
* Se utilizó `try/catch` dentro del `beforeAll` para capturar errores durante la generación de datos.
* Se reutilizó `utils/dataGenerator.js` para generar un `userName` y un `userPassword` dinámicos.
* Se almacenó el `userId` retornado por el registro para usarlo en la consulta del usuario.
* Se almacenó el token JWT retornado por `GenerateToken` para usarlo en endpoints protegidos.
* Se almacenó el primer ISBN retornado por la lista de libros para usarlo en la petición de agregado de libro.
* Se usó el header `Authorization: Bearer tokenAuth` en los endpoints protegidos.
* Se recomienda ejecutar el flujo con `--workers 1` para evitar problemas de paralelismo en flujos dependientes.
* Se evidencia que si no se agrega `module.exports` en el archivo `playwright.config.js`, el proyecto puede no ser reconocido correctamente por Playwright Test Explorer y los tests no se ejecutan desde la interfaz.
* Se validará con el mentor la mejor alternativa para generar una contraseña dinámica que cumpla todas las condiciones requeridas por la API de forma robusta y reutilizable.

---

## Conclusión

El challenge fue completado exitosamente, validando un flujo End-to-End de interacción con la Book Store API.

La automatización permitió crear un usuario dinámico, generar un token JWT, consultar información protegida del usuario, obtener la lista de libros, extraer dinámicamente el ISBN del primer libro y agregarlo correctamente al usuario autenticado.

Además, se aplicaron buenas prácticas como:

* Organización del código en archivos independientes.
* Reutilización de funciones utilitarias.
* Uso de datos dinámicos.
* Manejo de variables compartidas.
* Ejecución serial para flujos dependientes.
* Consumo de endpoints protegidos con token JWT.
* Reutilización de valores obtenidos en respuestas previas.