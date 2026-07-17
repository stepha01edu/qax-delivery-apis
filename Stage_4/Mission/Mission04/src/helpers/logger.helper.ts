// Helper para mostrar logs durante la ejecución:-------------------------------------

export class Logger {

    // Log para mostrar pasos del test:-------------------------------------

    static step(message: string): void {
        console.log(`\nSTEP: ${message}`);
    }

    // Log para mostrar el request que se va a ejecutar:-------------------------------------

    static request(method: string, endpoint: string, data?: unknown): void {
        // 1. Mostramos método y endpoint
        console.log(`\nREQUEST: ${method} ${endpoint}`);

        // 2. Si el request tiene body, lo mostramos en consola
        if (data) {
            console.log('REQUEST BODY:', JSON.stringify(data, null, 2));
        }
    }

    // Log para mostrar la respuesta de la API:-------------------------------------

    static response(status: number, body?: unknown): void {
        // 1. Mostramos el status code
        console.log(`RESPONSE STATUS: ${status}`);

        // 2. Si queremos mostrar el body, lo imprimimos
        if (body) {
            console.log('RESPONSE BODY:', JSON.stringify(body, null, 2));
        }
    }
}