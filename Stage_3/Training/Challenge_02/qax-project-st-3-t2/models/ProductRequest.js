// qax-project-st-3-t1/models/ProductRequest.js
class ProductRequest { //datos que se enviaran como body en la api
    constructor(name, data) { // constructor es palabra reservada, se usa la estructura de la api
        this.name = name; // segun la api es string
        this.data = data; // segun la api es un objeto
    }
    toJSON() { // serializo la informacion en formato JSON
        return { // esta es la informacion que retornara
            name: this.name,
            data: this.data
        };
    }
}
module.exports = { ProductRequest }; //exporto la funcion para que pueda ser llamada desde afuera
