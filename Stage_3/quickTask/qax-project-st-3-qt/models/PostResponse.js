// qax-project-st-3-qt/models/PostResponse.js
class PostResponse {  //datos que debe retornar la api luego de ser llamada con los datos enviados en el PostRequest
    constructor(data) {
        this.id = data.id;
        this.title = data.title;
        this.body = data.body;
        this.userId = data.userId;
    }
    hasTitle() {
        return this.title && this.title.trim().length > 0;  // valida que realmente exista un titulo, limpia los espacios y mira que al limpiar los espacios, el total de sus caracteres sean mayores a 0
    }
}
module.exports = { PostResponse };  // exporto la funcion para que pueda ser llamada de afuera
