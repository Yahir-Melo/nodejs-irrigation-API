import { Router } from 'express';
import { Authroutes } from './routes/routes.js';
/**
 * @description Importaciones para el enrutador principal.
 * - `Router`: La clase de Express para crear enrutadores.
 * - `Authroutes`: La clase que contiene nuestro enrutador especializado en autenticación.
 *   Analogía: Estamos importando al "gerente del departamento de autenticación".
 */

export class AppRoutes {
  static get routes(): Router {
    const router = Router();
    /**
     * @description Creación del enrutador principal de la aplicación.
     * Analogía: Este es el "directorio" o la "recepción" del edificio entero.
     */

    // Rutas principales de la aplicación
    router.use('/api/auth', Authroutes.routes);
    /**
     * @description Montaje de las rutas especializadas.
     * - `router.use('/api/auth', Authroutes.routes)`: Esta es la línea más importante.
     * - Le dice al enrutador principal: "Crea una sección principal en la URL llamada '/api/auth',
     *   y cualquier petición que llegue a esa sección, entrégasela al enrutador de `Authroutes` para que él la gestione".
     *
     * @analogy
     *   Esto es como poner un letrero en la recepción del edificio que dice:
     *   "Para asuntos de Autenticación (login, registro), vaya al Departamento de Seguridad en el ala `/api/auth`".
     *   A partir de ahí, el gerente de ese departamento (`Authroutes`) se encarga.
     */

    return router;
    /**
     * @description Se devuelve el enrutador principal ya configurado con todas las sub-rutas montadas.
     * Este es el `Router` que `server.ts` finalmente utiliza.
     */
  }
}
/**
 * @class AppRoutes
 * @description La clase que define y agrupa todas las rutas principales de la aplicación.
 * - El método estático `get routes()` permite un acceso fácil y directo al enrutador configurado (`AppRoutes.routes`).
 */