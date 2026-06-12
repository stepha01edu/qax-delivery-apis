// Función para pausar el código unos segundos (Los correos tardan en llegar)
const esperar = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 1. Obtiene un dominio válido de Mail.tm
 */
async function obtenerDominio() {
    const response = await fetch('https://api.mail.tm/domains');
    const data = await response.json();
    return data['hydra:member'][0].domain;
}

/**
 * 2. Crea una cuenta de correo temporal y devuelve el Token de acceso y el Email
 */
async function crearCuentaCorreo(nombreUsuario, password) {
    const dominio = await obtenerDominio();
    const address = `${nombreUsuario}@${dominio}`;

    await fetch('https://api.mail.tm/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, password })
    });

    const tokenResponse = await fetch('https://api.mail.tm/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, password })
    });

    const tokenData = await tokenResponse.json();
    return { email: address, token: tokenData.token };
}

/**
 * 3. Busca el último correo recibido. Reintenta hasta 5 veces.
 * Devuelve el objeto completo del correo (asunto, texto, html...)
 */
async function obtenerUltimoCorreo(token) {
    let intentos = 0;

    while (intentos < 5) {
        console.log(`📬 Buscando correos... (Intento ${intentos + 1}/5)`);

        const response = await fetch('https://api.mail.tm/messages', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        const correos = data['hydra:member'];

        if (correos.length > 0) {
            const idCorreo = correos[0].id;
            const responseDetalle = await fetch(`https://api.mail.tm/messages/${idCorreo}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return await responseDetalle.json();
        }

        await esperar(4000);
        intentos++;
    }

    throw new Error('❌ No se recibió ningún correo después de 20 segundos.');
}

/**
 * 4. Extrae el token del enlace de recuperación usando Regex
 * El correo contiene un enlace: /reset-password/TOKEN_HEXADECIMAL
 */
function extraerTokenDeCorreo(textoCorreo) {
    const regex = /\/reset-password\/([a-f0-9]+)/;
    const coincidencia = textoCorreo.match(regex);

    if (coincidencia) {
        console.log(`🔑 Token encontrado: ${coincidencia[1]}`);
        return coincidencia[1];
    }

    console.log('⚠️ No se encontró ningún token en el correo');
    return null;
}

module.exports = { crearCuentaCorreo, obtenerUltimoCorreo, extraerTokenDeCorreo };
