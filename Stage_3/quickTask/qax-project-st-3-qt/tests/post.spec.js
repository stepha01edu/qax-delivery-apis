
// qax-project-st-3-qt/tests/posts.spec.js
const { test, expect } = require("@playwright/test");
const { PostService } = require("../services/PostService"); //importo la llamada a la api desde el servicio
const { PostRequest } = require("../models/PostRequest"); //importo en formato en la data que se enviara en el request
const { PostResponse } = require('../models/PostResponse'); //importo el formato de la data que deben devolver los request

test.describe.serial('Posts API CRUD', () => { // se ejecutaran los test en orden

    test('debe obtener un post por ID (GET) @smoke', async ({ request }) => { // llama al metodo get del PostService, esta categorizado como smoke
        const postService = new PostService(request);

        const response = await postService.getPost(2); // envio el parametro ID = 1
        const body = await response.json();

        const postResponse = new PostResponse(body); // almaceno el resultado de acuerdo al modelo del PostResponse

        expect(response.status()).toBe(200); // valido que la respuesta sea 200
        expect(postResponse.id).toBe(2); // valido que el id realmente sea 1
        expect(postResponse.hasTitle()).toBeTruthy(); // valido que exista un titulo
        console.log("Se ha ejecutado correctamente el request Get, el id obtenido es: ", postResponse.id, " y el titulo es ", postResponse.title, " y el body es ", postResponse.body);
    });

    test('debe crear un post correctamente (POST) @regression', async ({ request }) => {
        const postService = new PostService(request); // llamo el request post

        const postRequest = new PostRequest( // envio la data para la creacion del nuevo registro
            'Título creado desde Playwright para practica',
            'Contenido del post creado en automatización, metodo POST',
            2
        );

        const response = await postService.createPost(postRequest); // aqui guardo el objeto del request
        const body = await response.json(); // tomo lo que me responde el post request

        const postResponse = new PostResponse(body); // valido que la respuesta este en el formato definido en el modelo

        //validaciones propias del test
        expect(response.status()).toBe(201);
        expect(postResponse.title).toBe(postRequest.title);
        expect(postResponse.body).toBe(postRequest.body);
        expect(postResponse.userId).toBe(postRequest.userId);
        expect(postResponse.id).toBeTruthy();
        console.log("Se ha creado correctamente el registro, la nueva data es: ", postResponse.body);
    });

    test('debe actualizar un post con PUT @smoke', async ({ request }) => {
        const postService = new PostService(request);

        const postRequest = new PostRequest( // data que voy a enviar en el put con el formato del request
            'Título actualizado con PUT',
            'Contenido actualizado completamente con PUT',
            2
        );

        const response = await postService.updatePost(2, postRequest); //lamo el request con los parametros para el put
        const body = await response.json();

        const postResponse = new PostResponse(body);

        expect(response.status()).toBe(200);
        expect(postResponse.id).toBe(2);
        expect(postResponse.title).toBe(postRequest.title);
        expect(postResponse.body).toBe(postRequest.body);
        expect(postResponse.userId).toBe(postRequest.userId);
        console.log("Se ha actualizado correctamente el registro, el nuevo registro es: ", postResponse.title);
    });

    test('debe actualizar solo el título con PATCH @regression', async ({ request }) => {
        const postService = new PostService(request);

        const fieldsToUpdate = { // campo del registro que se actualizara, en este caso el titulo
            title: 'Título actualizado parcialmente con PATCH'
        };

        const response = await postService.patchPost(2, fieldsToUpdate); //envio los parametros
        const body = await response.json();

        const postResponse = new PostResponse(body); // guardo la respuesa con el formato registrado en el modelo del response

        expect(response.status()).toBe(200);
        expect(postResponse.id).toBe(2);
        expect(postResponse.title).toBe(fieldsToUpdate.title);
        expect(postResponse.body).toBeTruthy();
        expect(postResponse.userId).toBeTruthy();
        console.log("Se ha actualizado correctamente el registro en el campo titulo, el nuevo registro es: ", postResponse.title);
    });

    test.skip('debe eliminar un post (DELETE) @smoke', async ({ request }) => { // elimino el registro, con el Skip indico que este test no se ejecutara en la suit
        const postService = new PostService(request);

        const response = await postService.deletePost(2); // elimino el registro cuyo parametro id es 2

        expect(response.status()).toBe(200);
        console.log("Se ha eliminado el registro");

    });

});
