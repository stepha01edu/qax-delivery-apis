// Helper para validar las variables de entorno:-------------------------------------

export interface EnvConfig {
    baseUrl: string;
    githubToken: string;
    githubUsername: string;
    environment: string;
}

export class EnvHelper {

    // Obtener configuración del archivo .env:-------------------------------------

    static getConfig(): EnvConfig {
        // 1. Leemos las variables de entorno
        const baseUrl = process.env.BASE_URL;
        const githubToken = process.env.GITHUB_TOKEN;
        const githubUsername = process.env.GITHUB_USERNAME;
        const environment = process.env.ENVIRONMENT || 'dev'; // Sino trae ambiente, se asignada dev por defecto

        // 2. Validamos que BASE_URL exista
        if (!baseUrl) {
            throw new Error('BASE_URL no está configurada en el archivo .env');
        }

        // 3. Validamos que GITHUB_TOKEN exista
        if (!githubToken) {
            throw new Error('GITHUB_TOKEN no está configurado en el archivo .env');
        }

        // 4. Validamos que GITHUB_USERNAME exista
        if (!githubUsername) {
            throw new Error('GITHUB_USERNAME no está configurado en el archivo .env');
        }

        // 5. Retornamos la configuración lista para usar
        return {
            baseUrl,
            githubToken,
            githubUsername,
            environment
        };
    }
}