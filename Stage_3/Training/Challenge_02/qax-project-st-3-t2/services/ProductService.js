const { ProductRequest } = require("../models/ProductRequest");

// qax-project-st-3-t1/services/ProductService.js
class ProductService { // aqui ya envio los request a la api, se maneja el crud

    constructor(request) {
        this.request = request;
        this.baseEndpoint = "/objects";  // completo la url base con la continuidad que necesito
    }

    async createProduct(ProductRequest) { //creo el objeto llamado ProductRequest que sera retornado
        return await this.request.post(this.baseEndpoint, { // armo el Product enviando la estructira de data armada en el ProductRequest, al ser un Product envio toda la data requerida para el registro 
            data: ProductRequest.toJSON()
        });
    }

    async getProduct(id) {
        return await this.request.get(`${this.baseEndpoint}/${id}`); // armo el get con el parametro de busqueda
    }

    async updateProduct(id, ProductRequest) {
        return await this.request.put(`${this.baseEndpoint}/${id}`, { // armo el PUT enviando la estructira de data armada en el ProductRequest, al ser un PUT envio toda la data requerida para la actualizacion del registro, pero asegurandome que se impacte el user cuyo ID se envie como parametro
            data: ProductRequest.toJSON()
        });
    }
    async patchProduct(id, fields) {
        return await this.request.patch(`${this.baseEndpoint}/${id}`, { // armo el PUT enviando la estructira de data armada en el ProductRequest, al ser un PATCH envio solo la data requerida para la actualizacion del registro, pero asegurandome que se impacte el user cuyo ID se envie como parametro, aqui manejo solo algunos datos con el parametro fields
            data: fields
        });
    }

    async deleteProduct(id) {
        return await this.request.delete(`${this.baseEndpoint}/${id}`);  // aqui elimino el registro que coincida con el id enviado
    }

}


module.exports = { ProductService };  // exporto la funcion para que pueda ser usada afuera
