
// qax-project-st-3-t1/tests/productCrud.spec.js

const { test, expect } = require("@playwright/test");
const { ProductService } = require("../services/ProductService"); //importo la llamada a la api desde el servicio
const { ProductRequest } = require("../models/ProductRequest"); //importo en formato en la data que se enviara en el request
const { ProductResponse } = require('../models/ProductResponse'); //importo el formato de la data que deben devolver los request

test.describe.serial('Products CRUD API @challenge @crud', () => {
    let productService; // en esta variable guardare el servicio del producto
    let productId; // en esta variable guardare el id del producto que creare

    test.beforeEach(async ({ request }) => {
        productService = new ProductService(request); // antes de que se ejecute el test, llamo a los servicios para asi poder invocar las api, me aseguro de estar activando el mecanismo por el cual podre consultar la api
    });

    test('Escenario 1 - Flujo POST GET PUT GET @smoke', async () => { // creo un producto, valido su creacion, lo actualizo totalmente y valido su actualizacion

        //POST

        const productToCreate = new ProductRequest(
            'Apple MacBook Pro 16 - Stepha Practica',
            {
                "price": 100,
                "year": 2016,
                "CPU model": 'Intel Core i9'. // VALIDAR PORQUE NO QUEDA COMO QUEDA EN LA COLLECTION DE POSTMAN
            }
        );

        const createResponse = await productService.createProduct(productToCreate); //llama el post para crear el produto
        const createBody = await createResponse.json(); // guardo la respuesta del post
        const createdProduct = new ProductResponse(createBody);

        expect(createResponse.status()).toBe(200); // respuesta positiva
        expect(createdProduct.hasId()).toBeTruthy(); //el producto tiene id
        expect(createdProduct.name).toBe(productToCreate.name); // el producto tiene  el nombre enviado
        expect(createdProduct.data.price).toBe(productToCreate.data.price); // el producto tiene el precio enviado
        expect(createdProduct.data.year).toBe(productToCreate.data.year); // el producto tiene el año enviado
        console.log("Producto creado", createdProduct);
        // expect(createdProduct.data.CPU model).toBe(productToCreate.data.description); // el producto tiene la modelo enviada

        productId = createdProduct.id;  // guardo el ID del producto creado

        //GET

        const getResponse = await productService.getProduct(productId); // llamo el producto con el id
        const getBody = await getResponse.json(); // guardo la respuesta
        const productFromGet = new ProductResponse(getBody); //deserealizo la respuesta

        expect(getResponse.status()).toBe(200);
        expect(productFromGet.id).toBe(productId);
        expect(productFromGet.name).toBe(productToCreate.name);
        console.log("producto consultado", productFromGet);
        //expect(productFromGet.data.price).toBe(productToCreate.data.price);
        //expect(productFromGet.data.color).toBe(productToCreate.data.color);
        //expect(productFromGet.data.description).toBe(productToCreate.data.description);

        //PUT

        const productToUpdate = new ProductRequest(
            'Apple MacBook Pro 16 - Stepha Practica - actualiza con PUT',
            {
                "price": 100,
                "year": 2016,
                "CPU model": 'Intel Core i9 actualizado con put'. // VALIDAR PORQUE NO QUEDA COMO QUEDA EN LA COLLECTION DE POSTMAN
            }
        );

        const updateResponse = await productService.updateProduct(productId, productToUpdate);
        const updateBody = await updateResponse.json();
        const updatedProduct = new ProductResponse(updateBody);

        expect(updateResponse.status()).toBe(200);
        expect(updatedProduct.id).toBe(productId);
        expect(updatedProduct.name).toBe(productToUpdate.name);
        console.log("Producto actualizado", updatedProduct);
        //expect(updatedProduct.data.price).toBe(productToUpdate.data.price);
        //expect(updatedProduct.data.color).toBe(productToUpdate.data.color);
        //expect(updatedProduct.data.description).toBe(productToUpdate.data.description);

        // NEW GET

        const verifyGetResponse = await productService.getProduct(productId);
        const verifyGetBody = await verifyGetResponse.json();
        const verifiedProduct = new ProductResponse(verifyGetBody);

        expect(verifyGetResponse.status()).toBe(200);
        expect(verifiedProduct.id).toBe(productId);
        expect(verifiedProduct.name).toBe(productToUpdate.name);
        console.log("Producto actualizado consultado", verifiedProduct);
        //expect(verifiedProduct.data.price).toBe(productToUpdate.data.price);
        //expect(verifiedProduct.data.color).toBe(productToUpdate.data.color);
        //expect(verifiedProduct.data.description).toBe(productToUpdate.data.description);
    });

    test('Escenario 2 - PATCH cambia solo el campo enviado @regression', async () => {
        const productToCreate = new ProductRequest(
            'Asus Pro 20 - Stepha Practica',
            {
                "price": 100,
                "year": 2016,
                "CPU model": 'Intel Core i20'. // VALIDAR PORQUE NO QUEDA COMO QUEDA EN LA COLLECTION DE POSTMAN
            }
        );

        // POST
        const createResponse = await productService.createProduct(productToCreate);
        const createBody = await createResponse.json();
        const createdProduct = new ProductResponse(createBody);

        expect(createResponse.status()).toBe(200);
        expect(createdProduct.hasId()).toBeTruthy();
        console.log("Producto creado", createdProduct);

        const patchProductId = createdProduct.id;

        //PATCH

        const fieldsToUpdate = {
            name: 'Asus Pro 20 - Stepha Practica actualizado con PATCH'
        };

        const patchResponse = await productService.patchProduct(patchProductId, fieldsToUpdate);
        const patchBody = await patchResponse.json();
        const patchedProduct = new ProductResponse(patchBody);

        expect(patchResponse.status()).toBe(200);
        expect(patchedProduct.id).toBe(patchProductId);
        expect(patchedProduct.name).toBe(fieldsToUpdate.name);
        console.log("Producto actualizado con PATCH", patchedProduct);

        // NEW GET

        const verifyGetResponse = await productService.getProduct(patchProductId);
        const verifyGetBody = await verifyGetResponse.json();
        const verifiedProduct = new ProductResponse(verifyGetBody);

        expect(verifyGetResponse.status()).toBe(200);
        expect(verifiedProduct.id).toBe(patchProductId);
        expect(verifiedProduct.name).toBe(patchedProduct.name);
        console.log("Producto actualizado con PATCH consultado", verifiedProduct);
    });
});