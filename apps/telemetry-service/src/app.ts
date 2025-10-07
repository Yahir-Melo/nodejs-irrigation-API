/**
 * @file app.ts
 * @description Punto de entrada principal de la aplicación. Este archivo se encarga de
 * la inicialización de la configuración, la instanciación del servidor y el arranque
 * de la aplicación.
 */

// -----------------------------------------------------------------------------
// 1. Importaciones de Módulos
// -----------------------------------------------------------------------------

/**
 * @description Importa las dependencias esenciales para el arranque y funcionamiento de la aplicación.
 * @property {function} findHeroById - Función del servicio `hero.service` para buscar un héroe por su ID (usada para pruebas).
 * @property {class} Server - Clase que encapsula la lógica del servidor web (Express).
 * @property {class} AppRoutes - Clase que define y agrupa las rutas principales de la API.
 */

import { Server } from './server.js';
import { AppRoutes } from './main_routes.js';


// -----------------------------------------------------------------------------
// 2. Configuración de Variables de Entorno
// -----------------------------------------------------------------------------

/**
 * @description Carga y configura las variables de entorno desde un archivo `.env`.
 * Al importar 'dotenv/config', la librería `dotenv` lee automáticamente el
 * archivo `.env` en la raíz del proyecto y carga sus variables en `process.env`.
 */
import 'dotenv/config';

// -----------------------------------------------------------------------------
// 3. Asignación de Variables de Entorno
// -----------------------------------------------------------------------------

/**
 * @description Lee valores específicos del entorno y los asigna a constantes para
 * su uso en la aplicación.

 * @property {string} portstring - Puerto del servidor, con '3000' como valor por defecto.
 */

const portstring = process.env.PORT_API || '3000';

// -----------------------------------------------------------------------------
// 5. Procesamiento del Puerto
// -----------------------------------------------------------------------------

/**
 * @description Convierte el puerto (obtenido como `string`) a un tipo `number`.
 * Se utiliza `parseInt` con base 10 para una conversión segura.
 * @type {number}
 */
const port = parseInt(portstring, 10);

// -----------------------------------------------------------------------------
// 6. Punto de Entrada Asíncrono (IIFE)
// -----------------------------------------------------------------------------

/**
 * @description Inicia la ejecución de la aplicación mediante una Expresión de
 * Función Invocada Inmediatamente (IIFE) asíncrona. Este patrón permite el uso
 * de `await` en el nivel superior si fuera necesario.
 */
(async () => {
  main();
})();

// -----------------------------------------------------------------------------
// 7. Función Principal (main)
// -----------------------------------------------------------------------------

/**
 * @function main
 * @description Orquesta el inicio del servidor web.
 * - Crea una instancia de la clase `Server`.
 * - Le pasa un objeto de configuración con el puerto y las rutas de la aplicación.
 * - Invoca el método `start()` para que el servidor comience a aceptar peticiones.
 */
function main() {

  const server = new Server({
    port: port,
    routes: AppRoutes.routes,
    
  });

  server.start();

}