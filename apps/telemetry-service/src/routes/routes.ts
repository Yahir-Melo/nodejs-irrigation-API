import { Router } from "express";
import { AuthController } from "../controllers/auth_controller.js";
/**
 * @description Importaciones necesarias para definir las rutas de autenticación.
 * - `Router`: Es una clase de Express que permite crear manejadores de rutas modulares y montables.
 *   Analogía: Es un "sub-gerente" que se especializa en una sección del restaurante (ej: solo los postres).
 * - `AuthController`: Es la clase que contiene la lógica de negocio para cada ruta (qué hacer al registrar, loguear, etc.).
 *   Analogía: Es el "chef de repostería" que sabe preparar cada postre del menú.
 */

export class Authroutes {
  static get routes(): Router {
    const router = Router();
    /**
     * @description Creación de una instancia del Router.
     * - `const router = Router()`: Aquí se crea el "organizador" o "sub-gerente" que agrupará todas las rutas de autenticación.
     */

    const controller = new AuthController();
    /**
     * @description Creación de una instancia del controlador.
     * - Se crea un objeto `controller` a partir de la clase `AuthController`.
     * - Este objeto nos da acceso a los métodos que ejecutarán la lógica para cada ruta (ej: `controller.loginUser`).
     */

    // Definir las rutas
    router.post('/login', controller.loginUser);
    router.post('/register', controller.registerUser);
    router.get('/validate-email/:token', controller.validateEmail);
    /**
     * @description Definición de las rutas de autenticación.
     * - Cada línea asocia una ruta (URL) y un método HTTP (POST, GET) con un método específico del controlador.
     * - `POST /login`: Cuando alguien haga una petición POST a esta URL, se ejecutará el método `loginUser` del controlador.
     *   Analogía: Cuando un cliente pide "Pastel de Chocolate" (POST a /login), el chef de repostería (`controller`) prepara la receta `loginUser`.
     * - `POST /register`: Similar al anterior, pero para registrar un nuevo usuario.
     * - `GET /validate-email/:token`: Esta ruta captura un valor dinámico de la URL (el `token`).
     *   Analogía: Es como pedir un "postre personalizado" (GET a /validate-email/) con un ingrediente especial (`:token`).
     */

    return router;
    /**
     * @description Devolución del enrutador configurado.
     * - La función `get routes()` devuelve el objeto `router` con todas las rutas ya definidas y listas para ser usadas
     *   por el servidor principal en `server.ts`.
     */
  }
}
/**
 * @class Authroutes
 * @description Clase que agrupa y expone las rutas relacionadas con la autenticación.
 * - Utiliza un método estático `get routes()` para que no sea necesario crear una instancia de la clase para obtener el enrutador.
 *   Se accede directamente con `Authroutes.routes`.
 */