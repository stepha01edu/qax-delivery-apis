// qax_apis_playwright_st4_exe2/src/services/ProductService.ts

import { APIRequestContext } from '@playwright/test';
import {
    ProductRequestBody,
    ProductServiceResponse
} from '../types/modelos';
import { ApiHelper } from '../helpers/apiHelper';

// Esta clase maneja las llamadas a la API de productos, para que los tests usen el service y no llamen directamente al request.
export class ProductService {

    // helper que hace las llamadas HTTP y registra logs
    private apiHelper: ApiHelper;

    // endpoint que completa la BASE_URL para trabajar con la coleccion de productos
    private baseEndpoint: string;

    // guardo el request dentro del ApiHelper para poder usarlo en los metodos del service
    constructor(request: APIRequestContext) {
        this.apiHelper = new ApiHelper(request);

        const collectionName = process.env.COLLECTION_NAME || 'products';

        this.baseEndpoint = `/collections/${collectionName}/objects`;

        console.log('Se ha inicializado correctamente el servicio de productos para consumir la API.');
        console.log('La coleccion configurada para las pruebas es:', collectionName);
    }

    // obtengo el API key desde el archivo .env
    private getApiKey(): string {
        const apiKey = process.env.API_KEY;

        if (!apiKey) {
            throw new Error('No se encontro API_KEY en el archivo .env.');
        }

        return apiKey;
    }

    // headers comunes para todos los endpoints
    private getHeaders(): Record<string, string> {
        return {
            'x-api-key': this.getApiKey()
        };
    }

    // creo un nuevo producto enviando la data definida en ProductRequestBody
    async createProduct(productData: ProductRequestBody): Promise<ProductServiceResponse> {
        console.log('Se va a crear un nuevo producto usando el metodo POST.');

        return await this.apiHelper.post( // envio el post
            this.baseEndpoint,
            productData,
            this.getHeaders()
        );
    }

    // consulto un producto por ID usando el metodo GET
    async getProduct(id: string): Promise<ProductServiceResponse> {
        console.log('Se va a consultar un producto por ID.');
        console.log('El ID que se enviara para la consulta es:', id);

        return await this.apiHelper.get( // envio el get
            `${this.baseEndpoint}/${id}`,
            this.getHeaders()
        );
    }
}