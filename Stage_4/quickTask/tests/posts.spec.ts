// quickTask/tests/posts.spec.ts

import { test, expect } from '@playwright/test';
import { PostService } from '../src/services/postService';
import { PostRequestBody } from '../src/types/post.types';

test.describe.serial('Posts API con TypeScript', () => {

    //test 1 GET --------   

    test('debe obtener un post por ID usando GET @get @smoke', async ({ request }) => {
        console.log('========== INICIO DEL TEST GET /posts/:id ==========');
        console.log('Se inicia la prueba para consultar un post existente por medio de su ID.');

        // ARRANGE
        // En esta sección preparo todo lo necesario antes de ejecutar el request.
        // Aquí creo el service y defino el ID que voy a consultar.
        console.log('ARRANGE: Se prepara el servicio que permitirá hacer la llamada GET a la API.');

        const postService = new PostService(request);

        const postId: number = 2;

        console.log('ARRANGE: El ID seleccionado para la consulta es:', postId);

        // ACT
        // En esta sección ejecuto la acción principal del test, aqui llamo al service para hacer el GET /posts/{id}.
        console.log('ACT: Se envía el request GET para consultar el post.');

        const getPostResponse = await postService.getPost(postId);

        console.log('ACT: La respuesta recibida desde la API es:', getPostResponse.body);

        // ASSERT
        // En esta sección valido que el resultado sea el esperado.
        // Primero valido el status code y luego valido la información del body.
        console.log('ASSERT: Se valida que el status code sea 200.');

        expect(getPostResponse.status).toBe(200);

        console.log('ASSERT: Se valida que el ID recibido sea igual al ID consultado.');

        expect(getPostResponse.body.id).toBe(postId);

        console.log('ASSERT: Se valida que el userId exista y sea mayor a 0.');

        expect(getPostResponse.body.userId).toBeGreaterThan(0);

        console.log('ASSERT: Se valida que el título exista y no esté vacío.');

        expect(getPostResponse.body.title.trim().length).toBeGreaterThan(0);

        console.log('ASSERT: Se valida que el body exista y no esté vacío.');

        expect(getPostResponse.body.body.trim().length).toBeGreaterThan(0);

        console.log(
            'Se ha ejecutado correctamente el request GET. El ID obtenido es:', getPostResponse.body.id, 'el userId es:', getPostResponse.body.userId, 'el título es:', getPostResponse.body.title, 'y el body es:', getPostResponse.body.body
        );

        console.log('========== FIN DEL TEST GET /posts/:id ==========');
    });

    //test 2 POST

    test('debe crear un post correctamente usando POST @post @regresion', async ({ request }) => {
        console.log('========== INICIO DEL TEST POST /posts ==========');
        console.log('Se inicia la prueba para crear un nuevo post usando el método POST.');

        // ARRANGE
        // En esta sección preparo el service y la data que voy a enviar a la API.
        // El objeto postRequest debe cumplir con la interface PostRequestBody.
        console.log('ARRANGE: Se prepara el servicio que permitira hacer la llamada POST a la API.');

        const postService = new PostService(request);

        console.log('ARRANGE: Se prepara la informacion que se enviará en el body del request.');

        const postRequest: PostRequestBody = {
            title: 'Parctica de TypeScript',
            body: 'Post creado en automatización usando el metodo POST',
            userId: 2
        };

        console.log('ARRANGE: La data que se enviara para crear el post es:', postRequest);

        // ACT
        // En esta sección ejecuto la acción principal del test.
        // Aquí llamo al service para hacer el POST /posts.
        console.log('ACT: Se envía el request POST para crear el nuevo post.');

        const createPostResponse = await postService.createPost(postRequest);

        console.log('ACT: La respuesta recibida despues de crear el post es:', createPostResponse.body);

        // ASSERT
        // En esta sección valido que la creación del post haya sido correcta.
        // Para un POST exitoso, JSONPlaceholder responde status 201.
        console.log('ASSERT: Se valida que el status code sea 201 porque se esta creando un registro.');

        expect(createPostResponse.status).toBe(201);

        console.log('ASSERT: Se valida que la API haya generado un ID para el nuevo post.');

        expect(createPostResponse.body.id).toBeTruthy();
        expect(createPostResponse.body.id).toBeGreaterThan(0);

        console.log('ASSERT: Se valida que el título recibido sea igual al título enviado.');

        expect(createPostResponse.body.title).toBe(postRequest.title);

        console.log('ASSERT: Se valida que el body recibido sea igual al body enviado.');

        expect(createPostResponse.body.body).toBe(postRequest.body);

        console.log('ASSERT: Se valida que el userId recibido sea igual al userId enviado.');

        expect(createPostResponse.body.userId).toBe(postRequest.userId);

        console.log(
            'Se ha creado correctamente el registro. El ID generado es:', createPostResponse.body.id, 'el título creado es:', createPostResponse.body.title, 'y el body creado es:', createPostResponse.body.body
        );

        console.log('========== FIN DEL TEST POST /posts ==========');
    });
});