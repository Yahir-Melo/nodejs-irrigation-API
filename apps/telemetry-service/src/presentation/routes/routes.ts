import { Router } from "express";
import { AuthController } from "../controllers/auth_controller.js";
import { RegisterUserUseCase } from "../../application/use-cases/register-user.usecase.js";
import { UserPrismaDatasource } from "../../infrastructure/datasources/prisma-user-datasource.js";
import { LoginUserUseCase } from "../../application/use-cases/login-user.usecase.js";

export class Authroutes {
  
  static get routes(): Router {
    const router = Router();
    
    // --- INYECCIÓN DE DEPENDENCIAS ---
    const userRepository = new UserPrismaDatasource();

    // Creas una instancia de CADA caso de uso que necesites
    const registerUseCase = new RegisterUserUseCase(userRepository);
    const loginUseCase = new LoginUserUseCase(userRepository); // <--- CREA LA INSTANCIA

    // Inyectas AMBOS casos de uso en el ÚNICO controlador
    const controller = new AuthController(registerUseCase, loginUseCase);


    // --- DEFINICIÓN DE RUTAS ---
    // Ahora el controlador tiene todo lo que necesita para todas las rutas
    router.post('/register', controller.registerUser);
    router.post('/login', controller.loginUser);
    router.get('/validate-email/:token', controller.validateEmail); // (Este necesitará su propio caso de uso también)

    return router;
    
  }
}

/**
 * ==================================================================================================
 *                                     DOCUMENTACIÓN DE RUTAS DE AUTENTICACIÓN
 * ==================================================================================================
 *
 * @file src/presentation/routes/routes.ts
 * @description Este archivo define la clase `Authroutes`, que encapsula todas las rutas
 *              relacionadas con la autenticación de usuarios.
 *
 *
 * --------------------------------------------------------------------------------------------------
 *                                          CLASE Authroutes
 * --------------------------------------------------------------------------------------------------
 * @class Authroutes
 * @description Su única responsabilidad es configurar y devolver un enrutador de Express
 *              especializado en la gestión de la autenticación. Utiliza un método estático
 *              para facilitar el acceso al enrutador sin necesidad de instanciar la clase.
 *
 *
 * --------------------------------------------------------------------------------------------------
 *                                     MÉTODO ESTÁTICO `get routes`
 * --------------------------------------------------------------------------------------------------
 * @method get routes
 * @description Configura y devuelve el enrutador de autenticación.
 *
 * @paso 1: Creación del Enrutador
 *   - `const router = Router();`
 *   - Se crea una instancia de `Router` de Express para agrupar las rutas de este módulo.
 *
 * @paso 2: Inyección de Dependencias (DI)
 *   - `const userRepository = new UserPrismaDatasource();`
 *     - Se crea una instancia del `UserPrismaDatasource`, que es la implementación concreta
 *       de la fuente de datos para usuarios, utilizando Prisma.
 *   - `const registerUseCase = new RegisterUserUseCase(userRepository);`
 *     - Se crea una instancia del caso de uso para registrar usuarios. Se le "inyecta"
 *       el `userRepository`, lo que significa que el caso de uso utilizará esta fuente
 *       de datos para interactuar con la base de datos.
 *   - `const controller = new AuthController(registerUseCase);`
 *     - Se crea la instancia del `AuthController` y se le inyecta el caso de uso.
 *       El controlador orquesta el flujo de datos, recibiendo peticiones HTTP y
 *       llamando a los casos de uso correspondientes para ejecutar la lógica de negocio.
 *
 * @paso 3: Definición de Rutas
 *   - Se asocian las rutas y los verbos HTTP a los métodos del controlador.
 *   - `router.post('/login', controller.loginUser);`
 *     - Peticiones `POST` a `/login` son manejadas por el método `loginUser` del controlador.
 *   - `router.post('/register', controller.registerUser);`
 *     - Peticiones `POST` a `/register` son manejadas por el método `registerUser`.
 *   - `router.get('/validate-email/:token', controller.validateEmail);`
 *     - Peticiones `GET` a `/validate-email/` con un token dinámico son manejadas por
 *       el método `validateEmail`.
 *
 * @paso 4: Retorno del Enrutador
 *   - `return router;`
 *   - Se devuelve el enrutador configurado para que `main_routes.ts` pueda montarlo
 *     en la ruta principal `/api/auth`.
 *
 */
