// Entregable #1 - Entrenamiento de APIS

//Definicion de variables
const name = "Stephania";
let age = 34;
let apisStudy = true;
let hobbies = ["tiempoEnFamilia", "viajar", "leer"];

// lectuar de variables en log
console.log("Lectura de variables");
console.log("Su nombre: ", name, " y su edad ", age, " Esta estudiando APIS? ", apisStudy, " y sus hobbies son ", hobbies);

// Lectura de tipo de variables:
console.log("El nombre es tipo ", typeof name);
console.log("La edad es tipo ", typeof age);
console.log("El tipo de estudio de APIS es ", typeof apisStudy);
console.log("El tipo de hobbie es", typeof hobbies);

// Solicitud de informacion al user y adicionar la nueva info al array
let newHobbie = prompt("¿Cual es su nuevo hobbie?");
hobbies.push(newHobbie);
console.log("Sus hobbies se han actualizado ", hobbies, " y ahora tienen en total ", hobbies.length);

// el user cumplio años, se actualizara su edad
age++;
console.log("Su nueva edad es ", age);