import { Server } from './server.js';
import { AppRoutes } from './main_routes.js';
import { envs } from './config/plugins/envs.plugin.js';

/**
 * @description Se utiliza una Función Anónima Autoejecutable (IIFE) asíncrona para
 *              iniciar la lógica principal. Este patrón permite usar `await` en el
 *              nivel superior del archivo si fuera necesario en el futuro.
 */
(async () => {
  main();
})();

function main() {

  const server = new Server({
    port: envs.PORT,
    routes: AppRoutes.routes,
  });

  server.start();

}

/**
 * ==================================================================================================
 *                               PUNTO DE ENTRADA DE LA APLICACIÓN
 * ==================================================================================================
 *
 * @file src/app.ts
 * @description Este archivo es el corazón de la aplicación. Su responsabilidad es orquestar
 *              el inicio del servidor, cargando las configuraciones y rutas necesarias.
 *              Actúa como el punto de partida que une todas las piezas.
 *
 *
 * --------------------------------------------------------------------------------------------------
 *                                  PUNTO DE ENTRADA ASÍNCRONO (IIFE)
 * --------------------------------------------------------------------------------------------------
 * @description Se utiliza una Función Anónima Autoejecutable (IIFE) asíncrona para
 *              iniciar la lógica principal. Este patrón permite usar `await` en el
 *              nivel superior del archivo si fuera necesario en el futuro.
 *
 *
 * --------------------------------------------------------------------------------------------------
 *                                       FUNCIÓN PRINCIPAL (main)
 * --------------------------------------------------------------------------------------------------
 * @function main
 * @description Función que centraliza y orquesta el arranque del servidor.
 *
 * @paso 1: Creación de la Instancia del Servidor
 *   - `const server = new Server(...)`
 *   - Se crea una nueva instancia de la clase `Server`, pasándole un objeto de
 *     configuración. Este objeto contiene:
 *     - `port`: El puerto en el que escuchará el servidor, obtenido de las variables de entorno validadas.
 *     - `routes`: El enrutador principal de la aplicación, proporcionado por `AppRoutes.routes`.
 *
 * @paso 2: Inicio del Servidor
 *   - `server.start()`
 *   - Se invoca el método `start()` de la instancia del servidor. Este método se encarga
 *     de configurar los middlewares, montar las rutas y poner al servidor a escuchar
 *     peticiones en el puerto especificado.
 *
 */