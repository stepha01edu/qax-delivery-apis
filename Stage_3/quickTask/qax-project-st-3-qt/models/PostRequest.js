// qax-project-st-3-qt/models/PostRequest.js
class PostRequest { //datos que se enviaran como body en la api
    constructor(title, body, userId) { // constructor es una palabra reservada
        this.title = title;
        this.body = body;
        this.userId = userId;
    }
    toJSON() { // serializo la informacion en formato JSON
        return { // esta es la informacion que retornara
            title: this.title,
            body: this.body,
            userId: this.userId
        };
    }
}
module.exports = { PostRequest }; //exporto la funcion para que pueda ser llamada desde afuera
