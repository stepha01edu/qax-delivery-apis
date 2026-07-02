const { PostRequest } = require("../models/PostRequest");

// qax-project-st-3-qt/services/PostService.js
class PostService { // aqui ya envio los request a la api, se maneja el crud

    constructor(request) {
        this.request = request;
        this.baseEndpoint = "/posts";  // completo la url base con la continuidad que necesito
    }
    async getPost(id) {
        return await this.request.get(`${this.baseEndpoint}/${id}`); // armo el get con el parametro de busqueda
    }
    async createPost(postRequest) { //creo el objeto llamado postRequest que sera retornado
        return await this.request.post(this.baseEndpoint, { // armo el POST enviando la estructira de data armada en el PostRequest, al ser un post envio toda la data requerida para el registro 
            data: postRequest.toJSON()
        });
    }
    async updatePost(id, postRequest) {
        return await this.request.put(`${this.baseEndpoint}/${id}`, { // armo el PUT enviando la estructira de data armada en el PostRequest, al ser un PUT envio toda la data requerida para la actualizacion del registro, pero asegurandome que se impacte el user cuyo ID se envie como parametro
            data: postRequest.toJSON()
        });
    }
    async patchPost(id, fields) {
        return await this.request.patch(`${this.baseEndpoint}/${id}`, { // armo el PUT enviando la estructira de data armada en el PostRequest, al ser un PATCH envio solo la data requerida para la actualizacion del registro, pero asegurandome que se impacte el user cuyo ID se envie como parametro, aqui manejo solo algunos datos con el parametro fields
            data: fields
        });
    }

    async deletePost(id) {
        return await this.request.delete(`${this.baseEndpoint}/${id}`);  // aqui elimino el registro que coincida con el id enviado
    }
}


module.exports = { PostService };  // exporto la funcion para que pueda ser usada afuera
