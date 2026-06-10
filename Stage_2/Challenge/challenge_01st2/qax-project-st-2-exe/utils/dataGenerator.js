import { faker } from "@faker-js/faker";  // libreria instalada con anterioridad para generar datos aleatorios

function generarUsuario() {
    return {
        name: faker.person.fullName(),
        // Agregamos .toLowerCase() para evitar conflictos con la API
        email: faker.internet.email().toLowerCase(),
        password: faker.internet.password() + 'A1!'
    };
}

// Exportamos la función para poder usarla en nuestros tests
module.exports = { generarUsuario };
