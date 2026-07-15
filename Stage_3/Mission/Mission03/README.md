# Mission #3 - Probando GitHub API

## Descripción

Esta misión corresponde al cierre del Stage 3 de automatización API.

El objetivo fue automatizar flujos principales de la GitHub REST API usando Playwright, aplicando los conceptos vistos durante el stage:

- Modelos.
- API Service Layer.
- Variables de entorno.
- Autenticación con Personal Access Token.
- Tags de ejecución.
- Validaciones con `expect`.
- Colección de Postman.

API utilizada:

```text
https://api.github.com
```

---

## Objetivo

Validar los siguientes flujos de la GitHub API:

- Consultar información de un usuario.
- Crear, consultar y actualizar repositorios.
- Listar y crear issues en un repositorio.

---

## Autenticación

Algunas operaciones de GitHub requieren autenticación con un Personal Access Token.

El token se guarda en el archivo `.env.dev` y no se escribe directamente en el código.

Ejemplo del archivo `.env.dev`:

```env
BASE_URL=https://api.github.com
GITHUB_TOKEN=ghp_tu_token_aqui
GITHUB_USERNAME=tu_usuario_github
ENVIRONMENT=dev
```

Importante:

```text
.env.dev no debe subirse al repositorio.
```

Por eso debe estar agregado en `.gitignore`.

---

## Estructura del proyecto

```text
Mission03/
│
├── tests/
│   ├── users.spec.js
│   ├── repos.spec.js
│   └── issues.spec.js
│
├── src/
│   ├── models/
│   │   ├── repoModel.js
│   │   └── issueModel.js
│   │
│   └── services/
│       ├── githubUserService.js
│       ├── githubRepoService.js
│       └── githubIssueService.js
│
├── .env.example
├── .gitignore
├── package.json
├── playwright.config.js
└── README.md
```

---

## ¿Cómo está organizado el código?

### tests/

Contiene los tests automatizados.

```text
users.spec.js
repos.spec.js
issues.spec.js
```

### src/models/

Contiene los modelos usados para construir los bodies de los requests.

```text
repoModel.js
issueModel.js
```

### src/services/

Contiene las clases que hacen las llamadas a la API.

```text
githubUserService.js
githubRepoService.js
githubIssueService.js
```

La idea es:

```text
El modelo arma la data.
El service llama a la API.
El test valida la respuesta.
```

---

## Tests implementados

| Archivo | Escenario | Tag |
|---|---|---|
| users.spec.js | Consultar información de usuario | @smoke |
| repos.spec.js | Crear repositorio | @regression |
| repos.spec.js | Consultar repositorio creado | @regression |
| repos.spec.js | Actualizar repositorio parcialmente | @regression |
| issues.spec.js | Crear repositorio para issues | @regression |
| issues.spec.js | Listar issues del repositorio | @regression |
| issues.spec.js | Crear issue en el repositorio | @regression |

---

## Historias de usuario cubiertas

### HU1 - Consultar información de usuario

Endpoint:

```text
GET /users/{username}
```

Validaciones realizadas:

- `login` no está vacío.
- `id` es mayor a 0.
- `avatar_url` contiene `https://`.
- `repos_url` contiene `https://`.
- `type` está presente.

Tag:

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

Validaciones realizadas:

- El repositorio se crea correctamente.
- El response contiene un `id`.
- El `name` coincide con el enviado.
- El repositorio creado se puede consultar.
- El repositorio se puede actualizar parcialmente.

Tag:

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

Validaciones realizadas:

- Se crea un repositorio para probar issues.
- Se puede listar issues del repositorio.
- Se puede crear un issue nuevo.
- El issue retorna `id` y `number`.
- El `title` coincide con el enviado.
- El `state` queda en `open`.

Tag:

```text
@regression
```

---

## Casos de prueba en Gherkin

```gherkin
Feature: GitHub API Automation

  @smoke
  Scenario: Consultar información de usuario
    Given que tengo un username válido de GitHub
    When consulto el endpoint GET /users/{username}
    Then la respuesta debe tener status 200
    And el campo login no debe estar vacío
    And el campo id debe ser mayor a 0
    And avatar_url debe contener https://
    And repos_url debe contener https://
    And type debe estar presente

  @regression
  Scenario: Crear repositorio correctamente
    Given que tengo un token válido de GitHub
    When creo un repositorio con datos válidos
    Then la respuesta debe tener status 201
    And debe devolver un id válido
    And el nombre del repositorio debe coincidir con el enviado

  @regression
  Scenario: Consultar repositorio creado
    Given que existe un repositorio creado por la automatización
    When consulto el endpoint GET /repos/{owner}/{repo}
    Then la respuesta debe tener status 200
    And el nombre del repositorio debe coincidir

  @regression
  Scenario: Actualizar repositorio parcialmente
    Given que existe un repositorio creado por la automatización
    When actualizo su descripción con PATCH
    Then la respuesta debe tener status 200
    And la descripción debe actualizarse correctamente

  @regression
  Scenario: Listar issues de un repositorio
    Given que existe un repositorio válido
    When consulto el endpoint GET /repos/{owner}/{repo}/issues
    Then la respuesta debe tener status 200
    And la respuesta debe ser una lista

  @regression
  Scenario: Crear issue en un repositorio
    Given que existe un repositorio válido
    When creo un issue con título y descripción
    Then la respuesta debe tener status 201
    And debe devolver un número de issue
    And el título debe coincidir con el enviado
```

---

## Instalación

Instalar dependencias:

```bash
npm install
```

Instalar navegadores de Playwright, si aplica:

```bash
npx playwright install
```

---

## Ejecución

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

## .gitignore

El archivo `.gitignore` incluye:

```gitignore
node_modules/
playwright-report/
test-results/
.env
.env.dev
.env.local
.DS_Store
```

---

## Bugs encontrados

No se encontraron bugs funcionales durante la ejecución.

Si algún test falla, se debe revisar primero:

- Que el token sea válido.
- Que el token tenga permisos `repo` y `user`.
- Que `.env.dev` esté configurado correctamente.
- Que `GITHUB_USERNAME` coincida con el usuario dueño del token.

---

## Notas importantes

- El token de GitHub no debe subirse al repositorio.
- `.env.dev` debe estar en `.gitignore`.
- Los repositorios se crean con nombres dinámicos para evitar duplicados.
- Las operaciones de creación y actualización requieren un token válido.
- Los tests de repositorios e issues usan `test.describe.serial` porque dependen de datos creados previamente.

---

## Conclusión

Esta misión permitió practicar automatización API con una API real.

Se aplicaron conceptos de Stage 3 como:

- Service Layer.
- Modelos para request body.
- Variables de entorno.
- Autenticación con token.
- Tags `@smoke` y `@regression`.
- Validaciones profesionales con `expect`.
- Documentación en README.
- Colección de Postman.

El objetivo principal fue validar flujos reales de GitHub API manteniendo el token seguro y el código organizado.