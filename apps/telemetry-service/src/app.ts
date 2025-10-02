

/**
 * @description Importaciones de módulos y clases necesarias para la aplicación.
 * - `findHeroById`: Función del servicio `hero.service` para buscar un héroe por su ID.
 * - `Server`: Clase que encapsula la lógica del servidor Express, proveniente de `server.js`.
 * - `AppRoutes`: Clase que define las rutas principales de la aplicación, desde `main_routes.js`.
 */

import { findHeroById } from './services/hero.service.js';
import { Server } from './server.js';
import { AppRoutes } from './main_routes.js';




const hero = findHeroById(1);
console.log(hero?.name ?? 'no encontrado');
/**
 * @description Bloque de código para pruebas iniciales.
 * - Busca un héroe con ID 1 utilizando el servicio `findHeroById`.
 * - Imprime el nombre del héroe en la consola o 'no encontrado' si no existe.
 * - Este es un ejemplo de uso directo de un servicio.
 */

import 'dotenv/config';
/**
 *  @description Importa y configura `dotenv`.
 * - Al importar 'dotenv/config', la librería carga automáticamente las variables de entorno
 *   desde un archivo `.env` en la raíz del proyecto y las asigna a `process.env`.
 * - Esto permite gestionar configuraciones sensibles o específicas del entorno de forma segura.
 */

const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const apiKey = process.env.API_KEY_WEATHER;
const portstring = process.env.PORT_API || '3000';
/**
 * @description Acceso y asignación de variables de entorno.
 * - `dbHost`, `dbUser`, `apiKey`: Leen valores del objeto `process.env` para configurar la base de datos y servicios externos.
 * - `portstring`: Obtiene el puerto para la API desde `process.env.PORT_API`. Si no se define,
 *   se utiliza '3000' como valor por defecto.
 */
const port = parseInt(portstring, 10);
/**
 * @description Conversión del puerto a número.
 * - `parseInt` convierte el `portstring` (que es un string) a un número entero (`number`).
 * - El segundo argumento, `10`, asegura que la conversión se realice en base decimal.
 */

(async () => {
  main();
})();
/**
 * @description Función autoejecutable asíncrona (IIFE - Immediately Invoked Function Expression).
 * - Envuelve la llamada a `main()` para poder utilizar `await` en el nivel superior si fuera necesario.
 * - Es el punto de entrada que inicia la ejecución de la lógica principal de la aplicación.
 */

function main() {
  const server = new Server({
    port: port,
    routes: AppRoutes.routes,
  });

  server.start();
}
/**
 * @function main
 * @description Función principal que orquesta el inicio de la aplicación.
 * - Crea una nueva instancia de la clase `Server`.
 * - Le pasa un objeto de configuración con:
 *   - `port`: El puerto en el que el servidor debe escuchar.
 *   - `routes`: Las rutas definidas en `AppRoutes` que el servidor debe registrar.
 * - Llama al método `start()` del objeto `server` para iniciar el servidor y ponerlo a la escucha de peticiones.
 */