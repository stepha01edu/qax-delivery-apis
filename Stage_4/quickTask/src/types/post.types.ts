// quickTask/src/types/post.types.ts

// informacion que se envia en el body para crear un nuevo post
// no se agrega id porque la API lo genera
export interface PostRequestBody {
    title: string;
    body: string;
    userId: number;
}

// informacion que espero recibir como respuesta de la API
// aqui si se agrega id porque la API lo devuelve en el response
export interface PostResponseBody {
    userId: number;
    id: number;
    title: string;
    body: string;
}

// estructura para manejar la respuesta del service con status y body
export interface PostServiceResponse {
    status: number;
    body: PostResponseBody;
}