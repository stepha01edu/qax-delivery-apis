# Mission #2 - E2E API Testing Platzi Fake Store

## Entrega parcial para habilitar Warmup

## ¿Qué es?

Esta es una entrega parcial del README correspondiente a la **Mission #2: E2E API Testing – Platzi Fake Store**, perteneciente al **Stage 2**.

El objetivo de esta versión inicial es dejar documentada la misión, su alcance general y los requerimientos principales para poder habilitar el warmup y avanzar con la preparación del proyecto desde cero.

Esta entrega no corresponde aún a la versión final de la misión. El contenido será actualizado progresivamente a medida que se desarrolle la automatización, se validen los endpoints, se organicen los archivos del proyecto y se generen las evidencias correspondientes.

---

## Nombre de la misión

**Mi Proyecto desde Cero**

**Mission #2: E2E API Testing – Platzi Fake Store**

---

## Contexto

En esta misión se trabajará sobre un sistema completo, simulando el trabajo de un Automation QA en un flujo real de pruebas E2E a nivel de API.

La API objetivo será:

```text
https://fakeapi.platzi.com/
```

La documentación Swagger se encuentra en:

```text
https://api.escuelajs.co/docs
```

La misión requiere leer y comprender la documentación antes de construir los casos automatizados, ya que los endpoints, estructuras de request, responses y reglas de negocio deben tomarse directamente desde Swagger.

---

## Objetivo de la misión

Construir un proyecto de automatización con **Playwright** que valide los principales módulos del sistema Platzi Fake Store.

Los módulos principales a cubrir son:

* Auth
* Users
* Products
* Categories
* Files
* Endpoints adicionales opcionales

El objetivo es validar un flujo E2E completo usando requests encadenados, datos dinámicos, manejo de tokens y modularización del proyecto.

---

## Lo que se busca demostrar

Durante esta misión se espera demostrar:

* Manejo de tokens de autenticación.
* Encadenamiento de requests usando IDs dinámicos.
* Modularización del proyecto mediante carpetas como `tests`, `utils` y/o `services`.
* Uso de validaciones robustas con `expect`.
* Lectura y análisis de la documentación Swagger.
* Creación de datos dinámicos.
* Organización profesional del proyecto desde cero.

---

## Módulos principales a probar

## 1. Auth

### Historia de usuario

Como usuario del sistema, quiero iniciar sesión con mis credenciales para obtener un token que me permita acceder a recursos protegidos.

### Criterios de aceptación

* El endpoint de login debe retornar status `200` o `201`.
* La respuesta debe contener un `access_token`.
* El token no debe ser `null` ni vacío.
* El token debe poder reutilizarse en siguientes requests.

### Endpoints a validar

```text
POST /api/v1/auth/login
GET /api/v1/auth/profile
POST /api/v1/auth/refresh-token
```

---

## 2. Users

### Historia de usuario

Como administrador del sistema, quiero crear y consultar usuarios para gestionar quién puede acceder a la plataforma.

### Criterios de aceptación

* Se puede crear un usuario con datos dinámicos.
* El endpoint retorna un `id` válido.
* Se puede consultar el usuario creado.
* Los datos retornados coinciden con los datos enviados.
* El usuario creado puede validarse dentro de la lista de usuarios.

### Endpoints a validar

```text
POST /api/v1/users
GET /api/v1/users/{id}
GET /api/v1/users
```

---

## 3. Products

### Historia de usuario

Como administrador de catálogo, quiero crear productos para que estén disponibles en la tienda.

### Criterios de aceptación

* Se puede crear un producto usando token.
* La respuesta contiene `id`, `title` y `price`.
* El producto creado puede consultarse posteriormente.
* El producto creado aparece en la lista de productos.

### Endpoints a validar

```text
POST /api/v1/products
GET /api/v1/products/{id}
GET /api/v1/products
```

---

## 4. Categories

### Historia de usuario

Como administrador, quiero crear categorías para organizar los productos.

### Criterios de aceptación

* Se puede crear una categoría.
* Se obtiene un `id` válido.
* Se puede asociar un producto a esa categoría.
* La categoría creada puede consultarse posteriormente.
* El producto asociado aparece en la lista de productos de la categoría.
* La categoría creada aparece en la lista de categorías.

### Endpoints a validar

```text
POST /api/v1/categories
GET /api/v1/categories/{id}
POST /api/v1/products
GET /api/v1/products/{id}
GET /api/v1/categories/{id}/products
GET /api/v1/categories
GET /api/v1/products
```

---

## 5. Files

### Alcance pendiente de revisión

El módulo de Files será revisado posteriormente con base en la documentación Swagger para validar el flujo correcto de carga de archivos.

Endpoint relacionado:

```text
POST /api/v1/files/upload
```

Este módulo queda identificado dentro del alcance general de la misión, pero será detallado en la versión final del README después de validar su implementación.

---

## Flujo principal E2E esperado

El flujo principal de la misión será:

```text
1. Login para obtener token.
2. Crear usuario.
3. Crear categoría.
4. Crear producto asociado a la categoría.
5. Consultar el producto creado.
```

Este flujo podrá ampliarse durante la implementación, dependiendo de las validaciones necesarias y de lo identificado en la documentación Swagger.

---

## Configuración esperada del proyecto

La misión solicita crear un proyecto desde cero usando Playwright.

La Base URL esperada es:

```text
https://api.escuelajs.co/api/v1/
```

Esta URL deberá configurarse en el archivo:

```text
playwright.config.js
```

---

## Estructura inicial esperada

La estructura inicial del proyecto podrá organizarse de la siguiente manera:

```text
Mission_2/
└── platzi-fake-store-api/
    ├── tests/
    ├── utils/
    ├── services/
    ├── evidencias/
    ├── playwright.config.js
    ├── package.json
    ├── .gitignore
    └── README.md
```

Esta estructura podrá ajustarse durante el desarrollo de la misión según la necesidad de modularizar endpoints, datos dinámicos, servicios o helpers.

---

## Funciones de apoyo esperadas

Se espera crear funciones reutilizables dentro de la carpeta `utils`.

Inicialmente se contempla una función para generar datos dinámicos de producto, como:

* Título aleatorio.
* Precio aleatorio.
* Descripción.
* Categoría asociada.
* Imágenes.

También se podrán crear funciones auxiliares para:

* Generar usuarios dinámicos.
* Generar categorías dinámicas.
* Centralizar datos de prueba.
* Reutilizar estructuras JSON para requests.

La librería sugerida para generación de datos dinámicos es:

```text
@faker-js/faker
```

Documentación:

```text
https://fakerjs.dev/guide/
```

---

## Ejecución esperada

Una vez implementados los tests, el proyecto deberá ejecutarse desde terminal con Playwright.

Comando general:

```bash
npx playwright test
```

Para abrir el reporte HTML:

```bash
npx playwright show-report
```

La versión final del README incluirá los comandos específicos según los archivos `.spec.js` creados.

---

## Evidencias esperadas

La entrega final deberá incluir evidencias de ejecución donde se observe que los tests fueron ejecutados correctamente y que las validaciones principales se encuentran en verde.

Las evidencias podrán almacenarse en:

```text
evidencias/
```

En esta entrega parcial aún no se adjuntan evidencias finales, ya que el objetivo principal es habilitar el warmup y preparar la estructura inicial de la misión.

---

## .gitignore

Antes de realizar commits, se debe asegurar que el proyecto ignore archivos temporales y carpetas generadas automáticamente.

El archivo `.gitignore` debe incluir como mínimo:

```text
node_modules/
playwright-report/
test-results/
```

Esto evita subir dependencias, reportes temporales o resultados de ejecución al repositorio.

---

## Estado actual de la entrega

Esta versión corresponde a una entrega parcial del README.

Estado actual:

* Se documentó el objetivo general de la misión.
* Se identificaron los módulos principales a validar.
* Se registraron las historias de usuario y criterios de aceptación principales.
* Se definió el flujo E2E esperado.
* Se dejó una propuesta inicial de estructura del proyecto.
* Se incluyeron comandos base de ejecución.
* Se documentó la necesidad de usar datos dinámicos y modularización.
* Se dejó pendiente la implementación completa de los tests automatizados.
* Se dejó pendiente la carga de evidencias finales.

---

## Pendientes para la entrega final

Para completar la entrega final será necesario:

* Crear el proyecto desde cero con Playwright.
* Configurar correctamente `playwright.config.js`.
* Crear la estructura profesional de carpetas.
* Implementar funciones reutilizables en `utils` y/o `services`.
* Automatizar los flujos de Auth, Users, Products y Categories.
* Validar el módulo Files si aplica dentro del alcance final.
* Encadenar requests usando IDs dinámicos.
* Reutilizar tokens en endpoints protegidos.
* Ejecutar todos los tests.
* Revisar el reporte HTML de Playwright.
* Agregar evidencias de ejecución.
* Actualizar este README con la implementación real realizada.

---

## Nota para mentoría

Esta entrega parcial se realiza con el propósito de habilitar el warmup del Stage 2 y preparar el desarrollo de la misión final.

La intención es revisar el contenido de la misión, analizar los endpoints en Swagger y llegar a la mentoría con mayor contexto para resolver dudas sobre:

* Alcance esperado de la cobertura.
* Organización recomendada del proyecto.
* Modularización en `utils` y `services`.
* Manejo de token.
* Encadenamiento de requests.
* Flujo correcto para productos y categorías.
* Alcance esperado para Files upload.
* Evidencias requeridas para la entrega final.

---

## Conclusión parcial

Esta versión inicial del README permite dejar documentada la misión y sus requerimientos principales para avanzar con el warmup.

La entrega final será actualizada cuando el proyecto de automatización esté implementado, ejecutado y documentado con sus respectivas evidencias.
