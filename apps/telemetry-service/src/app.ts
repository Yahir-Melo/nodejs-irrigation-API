

import { findHeroById } from './services/hero.service.js'; // <-- SIN extensión



const hero = findHeroById(1);
console.log(hero?.name ?? 'no encontrado');

// Importar y configurar dotenv
import 'dotenv/config';

// Ahora puedes acceder a tus variables de entorno a través de process.env
const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const apiKey = process.env.API_KEY_WEATHER;
const port = process.env.PORT_API;

console.log(`Conectando a la base de datos en: ${dbHost}\nUsuario: ${dbUser}`);
console.log(`Usando la API Key: ${apiKey}\nPUERTO: ${port}`);



// Aquí iría el resto de la lógica de tu aplicación...