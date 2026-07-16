# Stage 4 - Challenge 2

Proyecto de practica para probar una API de productos usando **Playwright + TypeScript**, data dinamica, `ApiHelper` y `Logger`.

Este challenge junta varias piezas aprendidas:

1. `dataBuilder.ts` genera un producto dinamico con faker.
2. El test usa `ProductService`.
3. `ProductService` usa `ApiHelper`.
4. `ApiHelper` ejecuta el request y usa `Logger`.
5. `Logger` muestra pasos, request y response en consola y reporte HTML.

## Que Se Practica

- TypeScript aplicado a API Testing.
- Interfaces para modelar request y response.
- Service Layer.
- Api Helper reutilizable.
- Logger con `test.step`.
- Data dinamica con `@faker-js/faker`.
- Flujo `POST` + `GET` encadenado.

## Estructura Del Proyecto

```text
qax_apis_playwright_st4_exe1/
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

- `BASE_URL` es la URL base de la API.
- `API_KEY` se envia como header `x-api-key`.
- `COLLECTION_NAME` es opcional. Si no se configura, usa `products`.
- `.env` no se debe subir al repositorio.

## Tests Implementados

| Test | Archivo | Tag | Que valida |
|---|---|---|---|
| Crear producto dinamico | `tests/products/productTest.spec.ts` | `@post @smoke` | Crea un producto generado con faker usando service, helper y logger |
| Consultar producto creado | `tests/products/productTest.spec.ts` | `@get @smoke` | Consulta el producto creado y valida que coincida |

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
Feature: Productos con data dinamica, helper y logs

@post @smoke
Scenario: Crear producto dinamico
  Given que tengo configurada la URL base y el API key
  And genero un producto usando faker
  When envio una peticion POST usando ProductService
  Then la API debe responder status 200
  And el Logger debe mostrar el request y response
  And la respuesta debe incluir los datos creados

@get @smoke
Scenario: Consultar producto creado
  Given que ya cree un producto y tengo su id
  When envio una peticion GET usando ProductService
  Then la API debe responder status 200
  And la informacion consultada debe coincidir con la informacion creada
```

## Notas De La Practica

- `dataBuilder.ts` genera productos dinamicos.
- `ProductService.ts` contiene la logica del modulo productos.
- `ApiHelper.ts` evita repetir codigo de `request.post` y `request.get`.
- `Logger.ts` permite ver pasos claros en consola y reporte HTML.
- `generateToken.spec.ts` queda reservado porque el API key ya se usa desde `.env`.
- La ultima ejecucion registrada quedo en estado `passed`.
