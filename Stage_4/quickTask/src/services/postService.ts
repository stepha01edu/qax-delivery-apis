// quickTask/src/services/PostService.ts
import { APIRequestContext } from '@playwright/test';
import { PostRequestBody, PostServiceResponse } from '../types/post.types';

export class PostService {
    // request es la herramienta que permite consumir la API desde Playwright
    private request: APIRequestContext;

    // endpoint que completa la BASE_URL para trabajar con posts
    private baseEndpoint: string = '/posts';

    // guardo el request para poder usarlo en los métodos del service
    constructor(request: APIRequestContext) {
        this.request = request;

        console.log('Se ha inicializado correctamente el servicio de Posts para consumir la API.');
    }

    // consulto un post por ID usando el método GET
    async getPost(id: number): Promise<PostServiceResponse> {
        console.log('Se va a consultar un post por ID.');
        console.log('El ID que se enviará para la consulta es:', id);
        console.log(`Se ejecutará el endpoint GET ${this.baseEndpoint}/${id}`);

        const response = await this.request.get(`${this.baseEndpoint}/${id}`);

        console.log('Se recibió respuesta del endpoint GET.');
        console.log('El status code recibido en el GET es:', response.status());

        const body = await response.json();

        console.log('El body recibido en el GET es:', body);

        return {
            status: response.status(),
            body
        };
    }

    // creo un nuevo post enviando la data definida en PostRequestBody
    async createPost(postData: PostRequestBody): Promise<PostServiceResponse> {
        console.log('Se va a crear un nuevo post usando el método POST.');
        console.log('La información que se enviará en el body es:', postData);
        console.log(`Se ejecutará el endpoint POST ${this.baseEndpoint}`);

        const response = await this.request.post(this.baseEndpoint, {
            data: postData
        });

        console.log('Se recibió respuesta del endpoint POST.');
        console.log('El status code recibido en el POST es:', response.status());

        const body = await response.json();

        console.log('El body recibido en el POST es:', body);

        return {
            status: response.status(),
            body
        };
    }
}