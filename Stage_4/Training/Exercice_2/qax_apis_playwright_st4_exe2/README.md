# Stage 4 - Exercice 2

Proyecto de practica para automatizar API Testing con **Playwright + TypeScript**, agregando un `ApiHelper` y un `Logger`.

Este ejercicio toma el flujo de productos y lo mejora para que el test sea mas limpio:

1. El test llama al `ProductService`.
2. El `ProductService` usa el `ApiHelper`.
3. El `ApiHelper` ejecuta `POST` y `GET`.
4. El `Logger` imprime request, response y crea pasos visibles en el reporte HTML.

## Que Se Practica

- TypeScript en tests de API.
- Service Layer con `ProductService`.
- Helper reutilizable para requests HTTP.
- Logger para ver pasos, request y response.
- Interfaces para tipar la data.
- Flujo encadenado con `test.describe.serial`.
- Validaciones basicas con `expect`.

## Estructura Del Proyecto

```text
qax_apis_playwright_st4_exe2/
├── src/
│   ├── helpers/
│   │   ├── apiHelper.ts
│   │   ├── dataBuilder.ts
│   │   └── logger.ts
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

El proyecto usa `.env`.

Ejemplo:

```text
BASE_URL=https://api.example.com
API_KEY=tu_api_key
COLLECTION_NAME=products
```

Notas:

- `BASE_URL` es la URL base.
- `API_KEY` se envia como header `x-api-key`.
- `COLLECTION_NAME` es opcional. Si no existe, usa `products`.
- No se debe subir `.env` al repositorio.

## Tests Implementados

| Test | Archivo | Tag | Que valida |
|---|---|---|---|
| Crear producto | `tests/products/productTest.spec.ts` | `@post @smoke` | Crea un producto con data fija y valida los campos principales |
| Consultar producto | `tests/products/productTest.spec.ts` | `@get @smoke` | Consulta el producto creado y valida que sea el mismo |

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

Ejecutar solo productos:

```bash
npx playwright test --grep @products
```

Abrir reporte HTML:

```bash
npx playwright show-report
```

## Flujo Del Test

```gherkin
Feature: Productos con helper y logs

@post @smoke
Scenario: Crear producto usando ProductService y ApiHelper
  Given que tengo configurada la URL base y el API key
  When envio una peticion POST para crear un producto
  Then la API debe responder status 200
  And el logger debe mostrar request y response
  And la respuesta debe incluir el producto creado

@get @smoke
Scenario: Consultar producto creado usando ProductService y ApiHelper
  Given que ya tengo el id del producto creado
  When envio una peticion GET con ese id
  Then la API debe responder status 200
  And la informacion consultada debe coincidir con la informacion creada
```

## Notas De La Practica

- `ProductService.ts` contiene la logica de productos.
- `ApiHelper.ts` centraliza los metodos `post` y `get`.
- `Logger.ts` ayuda a leer mejor la ejecucion y el reporte.
- `dataBuilder.ts` queda reservado para futuros datos dinamicos.
- `generateToken.spec.ts` queda reservado porque el API key ya se usa desde `.env`.
- La ultima ejecucion registrada quedo en estado `passed`.
