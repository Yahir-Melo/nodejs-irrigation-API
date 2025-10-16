import { Router } from "express";
import { AuthController } from "../controllers/auth_controller.js";
import { RegisterUserUseCase } from "../../application/use-cases/register-user.usecase.js";
import { UserPrismaDatasource } from "../../infrastructure/datasources/prisma-user-datasource.js";
import { LoginUserUseCase } from "../../application/use-cases/login-user.usecase.js";
import { ValidateEmailUseCase } from "../../application/use-cases/validate-email.usecase.js";
import { loginLimiter, registerLimiter } from "../middlewares/rateLimiter.js";
import { EmailService } from "../email/email.service.js";

export class Authroutes {
  
  static get routes(): Router {

    const router = Router();
    const userRepository = new UserPrismaDatasource();
    const emailService = new EmailService();

    const registerUseCase = new RegisterUserUseCase(userRepository, emailService);
    const loginUseCase = new LoginUserUseCase(userRepository);
    const validateEmailUseCase = new ValidateEmailUseCase(userRepository);

    const controller = new AuthController(registerUseCase, loginUseCase, validateEmailUseCase);

    router.post('/register', registerLimiter,controller.registerUser);
    router.post('/login', loginLimiter,controller.loginUser);
    router.get('/validate-email/:token', controller.validateEmail);
    
    return router;
    
  }
}

/**
 * ==================================================================================================
 *                                    DEFINICIÓN DE RUTAS DE AUTENTICACIÓN
 * ==================================================================================================
 *
 * @file src/presentation/routes/routes.ts
 * @description Este archivo define las rutas específicas para la autenticación de usuarios.
 *              Utiliza un enfoque de clase estática para agrupar y exponer un enrutador de Express
 *              configurado con todas las dependencias y controladores necesarios.
 *
 *
 * --------------------------------------------------------------------------------------------------
 *                                          CLASE Authroutes
 * --------------------------------------------------------------------------------------------------
 * @class Authroutes
 * @description Clase que agrupa las rutas de autenticación. No está pensada para ser instanciada,
 *              sino para ser un contenedor semántico de la lógica de enrutamiento de autenticación.
 *
 *
 * --------------------------------------------------------------------------------------------------
 *                                     MÉTODO ESTÁTICO `get routes`
 * --------------------------------------------------------------------------------------------------
 * @method get routes
 * @description Getter estático que construye, configura y devuelve un enrutador de Express.
 *              Este es el corazón del archivo, donde se realiza la inyección de dependencias
 *              y se asocian las rutas con los métodos del controlador.
 *
 * @paso 1: Creación del Enrutador
 *   - `const router = Router();`
 *   - Se crea una nueva instancia del enrutador de Express.
 *
 * @paso 2: Inyección de Dependencias (Composición de Objetos)
 *   - `const userRepository = new UserPrismaDatasource();`
 *     - Se crea una instancia del `UserPrismaDatasource`, que es la implementación concreta
 *       de la fuente de datos para usuarios, utilizando Prisma.
 *   - `const registerUseCase = new RegisterUserUseCase(userRepository);`
 *     - Se crea el caso de uso para registrar usuarios, inyectándole el repositorio.
 *   - `const loginUseCase = new LoginUserUseCase(userRepository);`
 *     - Se crea el caso de uso para el login, inyectándole el mismo repositorio.
 *   - `const validateEmailUseCase = new ValidateEmailUseCase(userRepository);`
 *     - Se crea el caso de uso para validar el email, también con el mismo repositorio.
 *   - `const controller = new AuthController(...)`
 *     - Se crea la instancia del `AuthController`, inyectándole todos los casos de uso
 *       que necesita para orquestar las operaciones.
 *
 * @paso 3: Definición de Rutas
 *   - Se asocian las rutas HTTP (endpoints) con los métodos correspondientes del controlador.
 *     - `POST /register` -> `controller.registerUser`
 *     - `POST /login` -> `controller.loginUser`
 *     - `GET /validate-email/:token` -> `controller.validateEmail`
 *
 * @paso 4: Retorno del Enrutador
 *   - `return router;`
 *   - Se devuelve el enrutador configurado para que pueda ser montado por el servidor principal.
 *
 */