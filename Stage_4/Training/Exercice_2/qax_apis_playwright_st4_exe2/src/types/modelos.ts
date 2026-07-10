// qax_apis_playwright_st4_exe2/src/types/modelos.ts

// informacion interna del producto que se envia dentro del campo data
export interface ProductData {
    price: number;
    year: number;
    'CPU model': string;
}

// informacion que se envia en el body para crear un producto, no se agrega id porque la API lo genera
export interface ProductRequestBody {
    name: string;
    data: ProductData;
}

// informacion que espero recibir como respuesta de la API, aqui si se agrega id porque la API lo devuelve en el response
export interface ProductResponseBody {
    id: string;
    name: string;
    data: ProductData;
}

// estructura para manejar la respuesta del service con status y body
export interface ProductServiceResponse {
    status: number;
    body: ProductResponseBody;
}