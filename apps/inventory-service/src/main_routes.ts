
import { Router } from 'express';
import { InventoryRoutes } from './presentation/routes/inventory_routes.js';

export class AppRoutes {
  static get routes(): Router {
    const router = Router();
    router.use('/api/inventory', InventoryRoutes.routes);
    return router;
  }
}

/**
 * ==================================================================================================
 *                                     DOCUMENTACIÓN DE RUTAS PRINCIPALES
 * ==================================================================================================
 *
 * @file src/main_routes.ts
 * @description Este archivo define la clase `AppRoutes`, responsable de centralizar y configurar
 *              el enrutamiento principal de la aplicación Express.
 *
 *
 * --------------------------------------------------------------------------------------------------
 *                                          CLASE AppRoutes
 * --------------------------------------------------------------------------------------------------
 * @class AppRoutes
 * @description Actúa como el contenedor principal para todas las rutas de la API. Su función
 *              es agregar los diferentes módulos de enrutamiento (como autenticación, usuarios, etc.)
 *              en un único enrutador que será utilizado por el servidor.
 *
 *
 * --------------------------------------------------------------------------------------------------
 *                                     MÉTODO ESTÁTICO `get routes`
 * --------------------------------------------------------------------------------------------------
 * @method get routes
 * @description Este es un método estático que, al ser invocado, devuelve una instancia del
 *              enrutador de Express (`Router`) completamente configurada.
 *
 * @paso 1: Creación del Enrutador
 *   - `const router = Router();`
 *   - Se inicializa una nueva instancia del enrutador de Express. Este será el enrutador
 *     principal que contendrá todas las demás rutas.
 *
 * @paso 2: Montaje de Sub-Rutas
 *   - `router.use('/api/auth', Authroutes.routes);`
 *   - Aquí es donde se conectan los enrutadores especializados. En este caso, le estamos diciendo
 *     a la aplicación que cualquier petición que comience con el prefijo `/api/auth` debe ser
 *     manejada por el enrutador definido en `Authroutes.routes`. Esto permite modularizar
 *     la aplicación, manteniendo la lógica de autenticación separada.
 *
 * @paso 3: Retorno del Enrutador
 *   - `return router;`
 *   - Finalmente, el método devuelve el enrutador ya configurado con todas sus sub-rutas,
 *     listo para ser utilizado por la instancia principal del servidor Express.
 *
 */
