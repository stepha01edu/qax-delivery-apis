# Mission #3 - Probando GitHub API

> **Nota:** Este README es una versión provisional creada para habilitar el warmup del siguiente stage.
> La información será actualizada cuando se implemente la misión, se agreguen los tests, la colección de Postman y las evidencias finales.

---

## Descripción

Esta misión corresponde al cierre del Stage 3 de automatización API.

El objetivo es trabajar con la GitHub REST API aplicando los conceptos vistos durante el stage:

* Modelos POO.
* API Service Layer.
* Variables de entorno.
* Autenticación con Personal Access Token.
* Anotaciones profesionales.
* Playwright API Testing.
* Colección de Postman.

---

## API utilizada

```text
https://api.github.com
```

---

## Objetivo

Automatizar flujos principales de la GitHub API, incluyendo:

* Consulta de información de usuario.
* Creación, consulta y actualización de repositorios.
* Listado y creación de issues.
* Validación de estructura y reglas básicas de respuesta.

---

## Autenticación

Algunas operaciones requieren autenticación con un Personal Access Token de GitHub.

El token debe guardarse en un archivo `.env.dev` y nunca escribirse directamente en el código.

Ejemplo:

```env
BASE_URL=https://api.github.com
GITHUB_TOKEN=ghp_tu_token_aqui
GITHUB_USERNAME=tu_usuario_github
ENVIRONMENT=dev
```

El archivo `.env.dev` debe estar incluido en `.gitignore`.

---

## Historias de usuario

### HU1 - Consultar información de usuario

Endpoint:

```text
GET /users/{username}
```

Validaciones esperadas:

* `login` no vacío.
* `id` mayor a 0.
* `avatar_url` inicia con `https://`.
* `repos_url` es una URL válida.
* `type` está presente.

Tag sugerido:

```text
@smoke
```

---

### HU2 - Crear, consultar y actualizar repositorios

Endpoints:

```text
POST /user/repos
GET /repos/{owner}/{repo}
PATCH /repos/{owner}/{repo}
```

Validaciones esperadas:

* El repositorio se crea correctamente.
* El response contiene un `id`.
* El `name` coincide con el enviado.
* El repositorio puede consultarse.
* El repositorio puede actualizarse parcialmente.

Tag sugerido:

```text
@regression
```

---

### HU3 - Listar y crear issues

Endpoints:

```text
GET /repos/{owner}/{repo}/issues
POST /repos/{owner}/{repo}/issues
```

Validaciones esperadas:

* Se puede listar issues de un repositorio.
* Se puede crear un issue nuevo.
* El issue retorna un `id`.
* El `title` coincide con el enviado.
* El `state` está presente.

Tag sugerido:

```text
@regression
```

---

## Estructura inicial propuesta

```text
qax-project-st-3-mission-3/
├── models/
├── services/
├── tests/
├── postman/
├── evidencias/
├── .env.dev
├── .gitignore
├── package.json
├── playwright.config.js
└── README.md
```

---

## Archivos esperados

### `models/`

Contendrá los modelos de request y response.

Ejemplos:

* `UserResponse.js`
* `RepositoryRequest.js`
* `RepositoryResponse.js`
* `IssueRequest.js`
* `IssueResponse.js`

### `services/`

Contendrá las llamadas centralizadas a la API.

Ejemplos:

* `UserService.js`
* `RepositoryService.js`
* `IssueService.js`

### `tests/`

Contendrá los tests automatizados.

Archivos sugeridos:

* `users.spec.js`
* `repos.spec.js`
* `issues.spec.js`

### `postman/`

Contendrá la colección de Postman exportada.

---

## Comandos de instalación

```bash
npm install
```

```bash
npx playwright install
```

---

## Comandos de ejecución

Correr toda la suite:

```bash
npx playwright test
```

Correr solo smoke:

```bash
npx playwright test --grep @smoke
```

Correr solo regression:

```bash
npx playwright test --grep @regression
```

Correr un archivo específico:

```bash
npx playwright test tests/repos.spec.js
```

Correr en staging:

```bash
ENV=staging npx playwright test
```

Ver reporte HTML:

```bash
npx playwright show-report
```

---

## Tests planeados

| Archivo          | Escenario                        | Tag           |
| ---------------- | -------------------------------- | ------------- |
| `users.spec.js`  | Consultar información de usuario | `@smoke`      |
| `repos.spec.js`  | Crear repositorio                | `@regression` |
| `repos.spec.js`  | Consultar repositorio            | `@regression` |
| `repos.spec.js`  | Actualizar repositorio           | `@regression` |
| `issues.spec.js` | Listar issues                    | `@regression` |
| `issues.spec.js` | Crear issue                      | `@regression` |

---

## Estado de la entrega

Esta es una documentación provisional para habilitar el warmup del siguiente stage.

Pendientes:

* Crear el proyecto base.
* Configurar variables de entorno.
* Crear modelos y services.
* Crear colección de Postman.
* Implementar tests automatizados.
* Ejecutar la suite.
* Agregar evidencias.
* Documentar bugs encontrados, si aplica.

---

## Notas importantes

* El token de GitHub no debe subirse al repositorio.
* `.env.dev` debe estar en `.gitignore`.
* Los nombres de repositorios usados en pruebas deberán ser únicos o generados dinámicamente.
* Las operaciones de creación y actualización requieren un token válido con permisos suficientes.

---

## Conclusión

Este README queda como documentación provisional de la Mission #3 para habilitar el warmup del siguiente stage.

Será actualizado conforme avance la implementación del proyecto.
