import 'dotenv/config';
import env from 'env-var'; // Importa la librería 'env-var'

//!! ESTO ES UN PATRON ADAPTADOR 
//? SE UTILIZA envs PARA USAR LAS VARIABLES DEL ENTORNO

export const envs = {
 
    PORT:env.get('PORT_API').required().asPortNumber(),
    MAILER_SERVICE:env.get('MAILER_SERVICE').required().asString(),
    MAILER_SECRET_KEY:env.get('MAILER_SECRET_KEY').required().asString(),
    MAILER_EMAIL:env.get('MAILER_EMAIL').required().asEmailString(),
    JWT_ACCESS_SECRET:env.get('JWT_ACCESS_SECRET').required().asString(),
    JWT_REFRESH_SECRET:env.get('JWT_REFRESH_SECRET').required().asString(),
}
