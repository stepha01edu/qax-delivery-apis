// qax_apis_playwright_st4_exe1/src/services/ProductService.ts

import { APIRequestContext } from '@playwright/test';
import {
    ProductRequestBody,
    ProductServiceResponse
} from '../types/modelos';
import { ApiHelper } from '../helpers/apiHelper';


// Esta clase maneja las llamadas a la API de productos,para que los tests usen el service y no llamen directamente al request.
export class ProductService {

    // herramienta que permite consumir la API desde Playwright
    // private request: APIRequestContext;

    // helper que permite consumir la API y registrar logs automaticamente
    private apiHelper: ApiHelper;

    // endpoint que completa la BASE_URL para trabajar con la coleccion de productos
    private baseEndpoint: string;

    // guardo el request para poder usarlo en los metodos del service
    constructor(request: APIRequestContext) {
        // this.request = request;

        // ahora el request se guarda dentro del ApiHelper
        this.apiHelper = new ApiHelper(request);

        const collectionName = process.env.COLLECTION_NAME || 'products'; // cargo el valor de la variable del archivo env, sino lo tengo, cargo el valor string como products
        this.baseEndpoint = `/collections/${collectionName}/objects`;  // envio como parametro el nombre de la collection

        console.log('Se ha inicializado correctamente el servicio de productos para consumir la API.');
        console.log('La coleccion configurada para las pruebas es:', collectionName);
    }

    // obtengo el API key desde el archivo .env
    private getApiKey(): string {
        const apiKey = process.env.API_KEY; // nombre de la variable en el .env

        if (!apiKey) {
            throw new Error('No se encontro API_KEY en el archivo .env.'); // valido que realmente existe una api key
        }

        return apiKey;
    }

    // headers comunes para todos los endpoints
    private getHeaders(): Record<string, string> {
        return {
            'x-api-key': this.getApiKey()
        };
    }

    // convierto la respuesta a JSON, si cualquiera de las API responde texto, lo retorno como message para poder entender el error
    // esta logica ahora vive en ApiHelper, por eso ya no se necesita aqui
    // private async parseResponseBody(response: any): Promise<any> {
    //     const responseText = await response.text();

    //     try {
    //         return JSON.parse(responseText);
    //     } catch {
    //         console.log('La respuesta no vino en formato JSON. El texto recibido fue:', responseText);

    //         return {
    //             message: responseText
    //         };
    //     }
    // }

    // creo un nuevo producto enviando la data definida en ProductRequestBody
    async createProduct(productData: ProductRequestBody): Promise<ProductServiceResponse> {
        console.log('Se va a crear un nuevo producto usando el metodo POST.');

        return await this.apiHelper.post(
            this.baseEndpoint,
            productData,
            this.getHeaders()
        );

        // codigo anterior antes de ApiHelper y Logger
        // console.log('La informacion que se enviara en el body es:', productData);
        // console.log(`Se ejecutara el endpoint POST ${this.baseEndpoint}`);
        // console.log('El request se enviara usando el API key configurado en el archivo .env.');

        // const response = await this.request.post(this.baseEndpoint, {
        //     headers: {
        //         'x-api-key': this.getApiKey()
        //     },
        //     data: productData
        // });

        // console.log('Se recibio respuesta del endpoint POST.');
        // console.log('El status code recibido en el POST es:', response.status());

        // const body = await this.parseResponseBody(response);

        // console.log('El body recibido en el POST es:', body);

        // return {
        //     status: response.status(),
        //     body
        // };
    }

    // consulto un producto por ID usando el metodo GET -----------
    async getProduct(id: string): Promise<ProductServiceResponse> {
        console.log('Se va a consultar un producto por ID.');
        console.log('El ID que se enviara para la consulta es:', id);

        return await this.apiHelper.get(
            `${this.baseEndpoint}/${id}`,
            this.getHeaders()
        );

        // codigo anterior antes de ApiHelper y Logger
        // console.log(`Se ejecutara el endpoint GET ${this.baseEndpoint}/${id}`);
        // console.log('El request se enviara usando el API key configurado en el archivo .env.');

        // const response = await this.request.get(`${this.baseEndpoint}/${id}`, {
        //     headers: {
        //         'x-api-key': this.getApiKey()
        //     }
        // });

        // console.log('Se recibio respuesta del endpoint GET.');
        // console.log('El status code recibido en el GET es:', response.status());

        // const body = await this.parseResponseBody(response);

        // console.log('El body recibido en el GET es:', body);

        // return {
        //     status: response.status(),
        //     body
        // };
    }
}