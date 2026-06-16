import { faker } from "@faker-js/faker";  // libreria instalada con anterioridad para generar datos aleatorios

function generarUsuario() {
    return {
        userName: faker.person.fullName() + 'CH2',
        userPassword: faker.internet.password({ length: 5 }) + 'Aa1!'//faker.internet.password() + 'CH2+'  // REVISAR EN LA MENTORIA 1-1 -esta linea me esta generando este error al crear el user porque la password que se crea no cumple con las condiciones de la password, Expected: 201, Received: 400 ("Passwords must have at least one non alphanumeric character, one digit ('0'-'9'), one uppercase ('A'-'Z'), one lowercase ('a'-'z'), one special character and Password must be eight characters or longer."). si puedo hacerlp con el trunc a los caracteres

    };
}

// Exportamos la función para poder usarla en nuestros tests
module.exports = { generarUsuario };