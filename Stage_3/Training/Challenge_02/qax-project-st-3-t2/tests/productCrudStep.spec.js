// qax-project-st-3-t2/tests/productCrud.spec.js

const { test, expect } = require("@playwright/test");
const { ProductService } = require("../services/ProductService"); // importo la llamada a la api desde el servicio
const { ProductRequest } = require("../models/ProductRequest"); // importo el formato de la data que se enviara en el request
const { ProductResponse } = require("../models/ProductResponse"); // importo el formato de la data que debe devolver la api

test.describe.serial('Products CRUD y PATCH para API @challenge @crud', () => {
    let productService; // en esta variable guardare el servicio del producto
    let productId; // en esta variable guardare el id del producto que creare

    test.beforeEach(async ({ request }) => {
        productService = new ProductService(request); // antes de cada test llamo el servicio para poder invocar las apis del producto
    });

    test('Flujo POST GET PUT PATCH GET', async () => { // creo un producto, lo consulto, lo actualizo totalmente, vuelo a actualizar solo un campo y valido la actualizacion

        let productToCreate; // guardare la data del producto que voy a crear
        let createResponse; // guardare la respuesta completa del POST
        let createdProduct; // guardare la respuesta del POST organizada con ProductResponse

        let getResponse; // guardare la respuesta completa del GET
        let productFromGet; // guardare la respuesta del GET organizada con ProductResponse

        let productToUpdate; // guardare la data nueva para actualizar el producto con PUT
        let updateResponse; // guardare la respuesta completa del PUT
        let updatedProduct; // guardare la respuesta del PUT organizada con ProductResponse

        let fieldsToUpdate; // guardare solo el campo que quiero actualizar con PATCH
        let patchResponse; // guardare la respuesta completa del PATCH
        let patchedProduct; // guardare la respuesta del PATCH organizada con ProductResponse

        let verifyGetResponse; // guardare la respuesta completa del nuevo GET de verificacion
        let verifiedProduct; // guardare la respuesta del GET de verificacion organizada con ProductResponse

        // POST---------------------------------------------------------------

        await test.step('Preparar producto para crear con POST', async () => {
            // preparo la data que se enviara en el body del POST
            productToCreate = new ProductRequest(
                'Apple MacBook Pro 16 - Stepha Practica',
                {
                    price: 100,
                    year: 2016,
                    'CPU model': 'Intel Core i9'
                }
            );
        });

        await test.step('Enviar POST /objects para crear producto', async () => {
            // llamo el servicio que ejecuta el POST para crear el producto
            createResponse = await productService.createProduct(productToCreate);

            // convierto la respuesta de la api en formato json para poder leerla
            const createBody = await createResponse.json();

            // organizo la respuesta usando el modelo ProductResponse
            createdProduct = new ProductResponse(createBody);

            // imprimo en consola el producto creado para tener evidencia durante la ejecucion
            //console.log("imprimo la respuesta real", createdBody);
            console.log("Producto creado", createdProduct);
        });

        await test.step('Validar creación del producto', async () => {
            // valido que la respuesta del POST sea exitosa
            expect(createResponse.status()).toBe(200);

            // valido que el producto creado tenga un id generado por la api
            expect(createdProduct.hasId()).toBeTruthy();

            // valido que el nombre retornado sea igual al nombre enviado
            expect(createdProduct.name).toBe(productToCreate.name);

            // valido que el precio retornado sea igual al precio enviado
            expect(createdProduct.data.price).toBe(productToCreate.data.price);

            // valido que el año retornado sea igual al año enviado
            expect(createdProduct.data.year).toBe(productToCreate.data.year);

            // valido el modelo de CPU enviado, como el campo tiene espacio se debe acceder con corchetes
            expect(createdProduct.data['CPU model']).toBe(productToCreate.data['CPU model']);

            // guardo el id del producto creado para poder consultarlo y actualizarlo despues
            productId = createdProduct.id;
        });

        // GET ---------------------------------------------------------------

        await test.step('Enviar GET /objects/{id} para consultar producto creado', async () => {
            // llamo el servicio que ejecuta el GET usando el id del producto creado
            getResponse = await productService.getProduct(productId);

            // convierto la respuesta del GET a json
            const getBody = await getResponse.json();

            // organizo la respuesta usando el modelo ProductResponse
            productFromGet = new ProductResponse(getBody);

            // imprimo en consola el producto consultado
            console.log("Producto consultado", productFromGet);
        });

        await test.step('Validar información del producto consultado', async () => {
            // valido que la consulta del producto sea exitosa
            expect(getResponse.status()).toBe(200);

            // valido que el id consultado sea el mismo id creado en el POST
            expect(productFromGet.id).toBe(productId);

            // valido que el nombre consultado sea igual al nombre creado
            expect(productFromGet.name).toBe(productToCreate.name);

            // valido que el precio consultado sea igual al precio creado
            expect(productFromGet.data.price).toBe(productToCreate.data.price);

            // valido que el año consultado sea igual al año creado
            expect(productFromGet.data.year).toBe(productToCreate.data.year);

            // valido que el modelo de CPU consultado sea igual al enviado en el POST
            expect(productFromGet.data['CPU model']).toBe(productToCreate.data['CPU model']);
        });

        // PUT---------------------------------------------------------------

        await test.step('Preparar producto actualizado para PUT', async () => {
            // preparo la nueva data completa que se enviara para reemplazar el producto con PUT
            productToUpdate = new ProductRequest(
                'Apple MacBook Pro 16 - Stepha Practica - actualiza con PUT',
                {
                    price: 100,
                    year: 2016,
                    'CPU model': 'Intel Core i9 actualizado con put' // VALIDAR PORQUE NO QUEDA COMO QUEDA EN LA COLLECTION DE POSTMAN
                }
            );
        });

        await test.step('Enviar PUT /objects/{id} para reemplazar producto', async () => {
            // llamo el servicio que ejecuta el PUT usando el id del producto creado
            updateResponse = await productService.updateProduct(productId, productToUpdate);

            // convierto la respuesta del PUT a json
            const updateBody = await updateResponse.json();

            // organizo la respuesta usando el modelo ProductResponse
            updatedProduct = new ProductResponse(updateBody);

            // imprimo en consola el producto actualizado con PUT
            console.log("Producto actualizado", updatedProduct);
        });

        await test.step('Validar actualización completa con PUT', async () => {
            // valido que la actualizacion con PUT sea exitosa
            expect(updateResponse.status()).toBe(200);

            // valido que el id se mantenga igual despues de actualizar
            expect(updatedProduct.id).toBe(productId);

            // valido que el nombre retornado sea el nuevo nombre enviado en el PUT
            expect(updatedProduct.name).toBe(productToUpdate.name);

            // valido que el precio retornado sea igual al precio enviado en el PUT
            expect(updatedProduct.data.price).toBe(productToUpdate.data.price);

            // valido que el año retornado sea igual al año enviado en el PUT
            expect(updatedProduct.data.year).toBe(productToUpdate.data.year);

            // REVISAR CON MENTOR ORQUE NO LOGRO QUE EL CAMPO QUEDE COMO LA COLLECTION DE POSTMAN---- valido que el modelo de CPU retornado sea igual al enviado en el PUT
            expect(updatedProduct.data['CPU model']).toBe(productToUpdate.data['CPU model']);
        });

        // PATCH ---------------------------------------------------------------

        await test.step('Preparar campo a actualizar con PATCH', async () => {
            // preparo solo el campo que quiero actualizar parcialmente
            fieldsToUpdate = {
                name: 'Asus Pro 20 - Stepha Practica actualizado con PATCH'
            };
        });

        await test.step('Enviar PATCH /objects/{id} para actualizar solo el name', async () => {
            // llamo el servicio que ejecuta el PATCH enviando solo el campo name
            patchResponse = await productService.patchProduct(productId, fieldsToUpdate);

            // convierto la respuesta del PATCH a json
            const patchBody = await patchResponse.json();

            // organizo la respuesta usando el modelo ProductResponse
            patchedProduct = new ProductResponse(patchBody);

            // imprimo en consola el producto actualizado con PATCH
            console.log("Producto actualizado con PATCH", patchedProduct);
        });

        await test.step('Validar actualización parcial con PATCH', async () => {
            // valido que el PATCH haya respondido exitosamente
            expect(patchResponse.status()).toBe(200);

            // valido que el id siga siendo el mismo producto
            expect(patchedProduct.id).toBe(productId);

            // valido que el name haya cambiado al valor enviado en PATCH
            expect(patchedProduct.name).toBe(fieldsToUpdate.name);

            console.log('aqui se cambio el nombre', patchedProduct.name)

            // valido que el precio se conserve igual porque no se envio en el PATCH
            expect(patchedProduct.data.price).toBe(productToUpdate.data.price);

            // valido que el año se conserve igual porque no se envio en el PATCH
            expect(patchedProduct.data.year).toBe(productToUpdate.data.year);

            // REVISAR CON MENTOR ORQUE NO LOGRO QUE EL CAMPO QUEDE COMO LA COLLECTION DE POSTMAN---- valido que el modelo de CPU se conserve igual porque no se envio en el PATCH
            expect(patchedProduct.data['CPU model']).toBe(productToUpdate.data['CPU model']);
        });

        // GET ---------------------------------------------------------------   

        await test.step('Enviar GET /objects/{id} para verificar actualización con PUT y PATCH', async () => {
            // consulto nuevamente el producto para validar que el PUT y PATCH quedaron aplicados
            verifyGetResponse = await productService.getProduct(productId);

            // convierto la respuesta del GET a json
            const verifyGetBody = await verifyGetResponse.json();

            // organizo la respuesta usando el modelo ProductResponse
            verifiedProduct = new ProductResponse(verifyGetBody);

            // imprimo en consola el producto consultado despues del PATCH
            console.log("Producto actualizado con PUT y PATCH consultado", verifiedProduct);
        });

        await test.step('Validar que solo cambió el campo enviado en PATCH', async () => {
            // valido que el GET de verificacion responda exitosamente
            expect(verifyGetResponse.status()).toBe(200);

            // valido que el id consultado sea el mismo producto actualizado con PATCH
            expect(verifiedProduct.id).toBe(productId);

            console.log('hasta aqui llega antes de que se rompa');

            // valido que el nombre consultado sea el nombre actualizado con PATCH
            expect(verifiedProduct.name).toBe(fieldsToUpdate.name);

            // valido que el precio se conserve igual porque no se envio en el PATCH
            expect(verifiedProduct.data.price).toBe(productToUpdate.data.price);

            // valido que el año se conserve igual porque no se envio en el PATCH
            expect(verifiedProduct.data.year).toBe(productToUpdate.data.year);

            // REVISAR CON MENTOR ORQUE NO LOGRO QUE EL CAMPO QUEDE COMO LA COLLECTION DE POSTMAN---- valido que el modelo de CPU se conserve igual porque no se envio en el PATCH
            expect(patchedProduct.data['CPU model']).toBe(productToUpdate.data['CPU model']);
        });
    });
    // ------------------------------------------------------
    // Scenario negativo --------------------------------------------------------------- 
    // ------------------------------------------------------
    test('debe retornar error al hacer GET con ID inválido @regression @negative', async () => {
        await test.step('Enviar GET /objects/{id} con ID inválido', async () => {
            // preparo un id invalido para validar respuesta de error
            const invalidProductId = 'Test negativo';

            // llamo el servicio con un id que no existe
            const invalidGetResponse = await productService.getProduct(invalidProductId);

            // valido que la api responda 404 porque el recurso no existe
            expect(invalidGetResponse.status()).toBe(404);
        });
    });
});

