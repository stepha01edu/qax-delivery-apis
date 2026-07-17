# Stage 4 - Exercice 1

Proyecto de practica para automatizar pruebas de API usando **Playwright + TypeScript**.

En este ejercicio se trabaja con una API de productos. El flujo principal es:

1. Crear un producto con `POST`.
2. Guardar el `id` que devuelve la API.
3. Consultar el producto creado con `GET`.
4. Validar que la informacion consultada sea igual a la informacion enviada.

## Que Se Practica

- Configuracion de Playwright con TypeScript.
- Uso de variables de ambiente desde `.env`.
- Service Layer basico con `ProductService`.
- Interfaces en TypeScript para request y response.
- Flujo encadenado usando `test.describe.serial`.
- Validaciones con `expect`.
- Comentarios tipo `ARRANGE`, `ACT` y `ASSERT` para entender cada parte del test.

## Estructura Del Proyecto

```text
qax_apis_playwright_st4_exe1/
├── src/
│   ├── helpers/
│   │   └── dataBuilder.ts
│   ├── services/
│   │   ├── AuthService.ts
│   │   └── ProductService.ts
│   └── types/
│       └── modelos.ts
├── tests/
│   ├── auth/
│   │   └── generateToken.spec.ts
│   └── products/
│       └── productTest.spec.ts
├── playwright.config.ts
├── package.json
└── tsconfig.json
```

## Variables De Ambiente

El proyecto usa un archivo `.env`.

Ejemplo:

```text
BASE_URL=https://api.example.com
API_KEY=tu_api_key
COLLECTION_NAME=products
```

Notas:

- `BASE_URL` es la URL base de la API.
- `API_KEY` se envia como header `x-api-key`.
- `COLLECTION_NAME` es opcional. Si no se configura, el service usa `products`.
- El archivo `.env` no se debe subir al repositorio.

## Tests Implementados

| Test | Archivo | Tag | Que valida |
|---|---|---|---|
| Crear producto | `tests/products/productTest.spec.ts` | `@post @smoke` | Crea un producto con data fija y valida status, id, nombre, precio, year y CPU model |
| Consultar producto | `tests/products/productTest.spec.ts` | `@get @smoke` | Consulta el producto creado y valida que los datos coincidan |

## Como Ejecutar

Instalar dependencias:

```bash
npm install
```

Ejecutar todos los tests:

```bash
npx playwright test
```

Ejecutar solo smoke:

```bash
npx playwright test --grep @smoke
```

Ejecutar solo POST:

```bash
npx playwright test --grep @post
```

Ejecutar solo GET:

```bash
npx playwright test --grep @get
```

Abrir reporte HTML:

```bash
npx playwright show-report
```

## Flujo Del Test

```gherkin
Feature: Productos

@post @smoke
Scenario: Crear producto con data fija
  Given que tengo configurada la URL base y el API key
  When envio una peticion POST para crear un producto
  Then la API debe responder status 200
  And la respuesta debe incluir un id
  And los datos recibidos deben coincidir con los enviados

@get @smoke
Scenario: Consultar producto creado
  Given que ya cree un producto y tengo su id
  When envio una peticion GET con ese id
  Then la API debe responder status 200
  And el producto consultado debe coincidir con el producto creado
```

## Notas De La Practica

- `ProductService.ts` centraliza los llamados `POST` y `GET`.
- `modelos.ts` define las interfaces usadas por el test.
- `dataBuilder.ts` esta reservado para futuros builders.
- `generateToken.spec.ts` queda reservado porque en este ejercicio ya se usa `API_KEY` directamente.
- La ultima ejecucion registrada quedo en estado `passed`.
