import 'dotenv/config';
import env from 'env-var'; // Importa la librería 'env-var'

//!! ESTO ES UN PATRON ADAPTADOR 
//? SE UTILIZA envs PARA USAR LAS VARIABLES DEL ENTORNO

export const envs = {
 
    PORT:env.get('PORT_API').required().asPortNumber(),
    JWT_ACCESS_SECRET:env.get('JWT_ACCESS_SECRET').required().asString(),
    
}
