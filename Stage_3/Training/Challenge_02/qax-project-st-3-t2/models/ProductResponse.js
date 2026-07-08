// qax-project-st-3-t1/models/ProductResponse.js
class ProductResponse {  //datos que debe retornar la api luego de ser llamada con los datos enviados en el PostRequest
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.data = data.data;
    }
    hasId() {
        return this.id && this.id.toString().trim().length > 0;;  // valida que realmente exista un Id, limpia los espacios y mira que al limpiar los espacios, el total de sus caracteres sean mayores a 0
    }
    hasName() {
        return this.name && this.name.trim().length > 0; // valida que realmente exista un nombre, limpia los espacios y mira que al limpiar los espacios, el total de sus caracteres sean mayores a 0
    }
}
module.exports = { ProductResponse };  // exporto la funcion para que pueda ser llamada de afuera
