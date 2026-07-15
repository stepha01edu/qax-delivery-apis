// qax_apis_playwright_st4_exe1/tests/products/productTest.spec.ts

import { test, expect } from '@playwright/test';
import { ProductService } from '../../src/services/ProductService';
import { ProductRequestBody } from '../../src/types/modelos';

test.describe.serial('Products API con TypeScript y data quemada @products', () => {
    let productService: ProductService; // guardo el servicio para usarlo en los tests
    let productId: string; // guardo el id que devuelve la API al crear el producto
    let productToCreate: ProductRequestBody; // guardo la data quemada que se enviara en el POST

    test.beforeEach(async ({ request }) => {
        productService = new ProductService(request); // antes de cada test inicializo el service
    });

    test('debe crear un producto con data quemada usando POST @post @smoke', async () => {
        console.log('========== INICIO DEL TEST POST /objects ==========');
        console.log('Se inicia la prueba para crear un producto con data escrita directamente en el test.');

        // ARRANGE
        // preparo la data fija que se enviara en el body del POST
        console.log('ARRANGE: Se prepara la data quemada que se enviara para crear el producto.');

        productToCreate = {
            name: 'Apple MacBook Pro 16 - Stepha Practica',
            data: {
                price: 100,
                year: 2016,
                'CPU model': 'Intel Core i9'
            }
        };

        console.log('ARRANGE: La data quemada que se enviara para crear el producto es:', productToCreate);

        // ACT
        // ejecuto el POST para crear el producto
        console.log('ACT: Se envia el request POST para crear el producto.');

        const createProductResponse = await productService.createProduct(productToCreate);

        console.log('ACT: La respuesta recibida despues de crear el producto es:', createProductResponse.body);

        productId = createProductResponse.body.id;

        console.log('ACT: El ID generado por la API es:', productId);

        // ASSERT
        // valido que la creacion haya sido correcta
        console.log('ASSERT: Se valida que el status code sea 200 porque se esta creando un registro.');

        expect(createProductResponse.status).toBe(200);

        console.log('ASSERT: Se valida que la API haya generado un ID para el producto.');

        expect(createProductResponse.body.id).toBeTruthy();

        console.log('ASSERT: Se valida que el nombre recibido sea igual al nombre enviado.');

        expect(createProductResponse.body.name).toBe(productToCreate.name);

        console.log('ASSERT: Se valida que el precio recibido sea igual al precio enviado.');

        expect(createProductResponse.body.data.price).toBe(productToCreate.data.price);

        console.log('ASSERT: Se valida que el año recibido sea igual al año enviado.');

        expect(createProductResponse.body.data.year).toBe(productToCreate.data.year);

        console.log('ASSERT: Se valida que el modelo de CPU recibido sea igual al enviado.');

        expect(createProductResponse.body.data['CPU model']).toBe(productToCreate.data['CPU model']);

        console.log(
            'Se ha creado correctamente el producto con data quemada. El ID generado es:',
            createProductResponse.body.id,
            'el nombre es:',
            createProductResponse.body.name,
            'y la data es:',
            createProductResponse.body.data
        );

        console.log('========== FIN DEL TEST POST /objects ==========');
    });

    test('debe consultar el producto creado usando GET @get @smoke', async () => {
        console.log('========== INICIO DEL TEST GET /objects/{id} ==========');
        console.log('Se inicia la prueba para consultar el producto creado en el test anterior.');

        // ARRANGE
        // valido que exista un id antes de hacer el GET
        console.log('ARRANGE: Se valida que exista un ID de producto creado previamente.');

        expect(productId).toBeTruthy();

        console.log('ARRANGE: El ID que se usara para consultar el producto es:', productId);

        // ACT
        // ejecuto el GET usando el ID creado en el test de POST
        console.log('ACT: Se envia el request GET para consultar el producto creado.');

        const getProductResponse = await productService.getProduct(productId);

        console.log('ACT: La respuesta recibida desde el GET es:', getProductResponse.body);

        // ASSERT
        // valido que el producto consultado sea el mismo que se creo
        console.log('ASSERT: Se valida que el status code del GET sea 200.');

        expect(getProductResponse.status).toBe(200);

        console.log('ASSERT: Se valida que el ID consultado sea el mismo ID creado.');

        expect(getProductResponse.body.id).toBe(productId);

        console.log('ASSERT: Se valida que el nombre consultado sea igual al nombre creado.');

        expect(getProductResponse.body.name).toBe(productToCreate.name);

        console.log('ASSERT: Se valida que el precio consultado sea igual al precio creado.');

        expect(getProductResponse.body.data.price).toBe(productToCreate.data.price);

        console.log('ASSERT: Se valida que el año consultado sea igual al año creado.');

        expect(getProductResponse.body.data.year).toBe(productToCreate.data.year);

        console.log('ASSERT: Se valida que el modelo de CPU consultado sea igual al enviado.');

        expect(getProductResponse.body.data['CPU model']).toBe(productToCreate.data['CPU model']);

        console.log(
            'Se ha consultado correctamente el producto creado. El ID es:',
            getProductResponse.body.id,
            'el nombre es:',
            getProductResponse.body.name,
            'y la data es:',
            getProductResponse.body.data
        );

        console.log('========== FIN DEL TEST GET /objects/{id} ==========');
    });
});