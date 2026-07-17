# Stage 4 - Challenge 1

Proyecto de practica para probar una API de productos usando **Playwright + TypeScript** con data dinamica.

Este challenge mejora el ejercicio basico porque ya no usa un producto fijo. Ahora genera la data con `faker` usando el helper `dataBuilder.ts`.

## Que Se Practica

- Playwright para pruebas de API.
- TypeScript con interfaces.
- Service Layer con `ProductService`.
- Data dinamica con `@faker-js/faker`.
- Flujo serial: crear producto y luego consultarlo.
- Validaciones con `expect`.
- Comentarios `ARRANGE`, `ACT` y `ASSERT` para entender el orden del test.

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

El proyecto usa `.env`.

Ejemplo:

```text
BASE_URL=https://api.example.com
API_KEY=tu_api_key
COLLECTION_NAME=products
```

Notas:

- `BASE_URL` es la URL base de la API.
- `API_KEY` se manda como header `x-api-key`.
- `COLLECTION_NAME` es opcional. Si no se configura, usa `products`.
- `.env` no se debe subir al repositorio.

## Tests Implementados

| Test | Archivo | Tag | Que valida |
|---|---|---|---|
| Crear producto dinamico | `tests/products/productTest.spec.ts` | `@post @smoke` | Crea un producto generado con faker y valida la respuesta |
| Consultar producto creado | `tests/products/productTest.spec.ts` | `@get @smoke` | Consulta el producto creado y valida que coincida con la data dinamica |

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
Feature: Productos con data dinamica

@post @smoke
Scenario: Crear producto con data dinamica
  Given que tengo configurada la URL base y el API key
  And genero un producto usando faker
  When envio una peticion POST para crear el producto
  Then la API debe responder status 200
  And la respuesta debe incluir un id
  And los datos recibidos deben coincidir con los generados

@get @smoke
Scenario: Consultar producto creado
  Given que ya cree un producto y tengo su id
  When envio una peticion GET con ese id
  Then la API debe responder status 200
  And la informacion consultada debe coincidir con la informacion creada
```

## Notas De La Practica

- `dataBuilder.ts` genera `name`, `price`, `year` y `CPU model` de forma dinamica.
- `ProductService.ts` mantiene los llamados a la API fuera del test.
- `modelos.ts` define las interfaces del producto.
- `generateToken.spec.ts` queda reservado porque el API key se usa desde `.env`.
- La ultima ejecucion registrada quedo en estado `passed`.
