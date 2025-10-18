import type { Request, Response } from "express";
import { RegisterUserUseCase } from "../../application/use-cases/register-user.usecase.js";
import { LoginUserUseCase, type LoginUserResponseDto } from "../../application/use-cases/login-user.usecase.js";
import type { ValidateEmailUseCase } from "../../application/use-cases/validate-email.usecase.js";
import { CustomError } from "../../domain/errors/custom.error.js";
import { LoginUserDto } from "../../application/dtos/auth/login.user.dto.js";
import { RegisterUserDto } from "../../application/dtos/auth/register.user.dto.js";
import type { RefreshTokenUseCase } from "../../application/use-cases/refresh-token.usecase.js";

export class AuthController {


  constructor(

    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly validateEmailUseCase: ValidateEmailUseCase,
    private readonly  refreshTokenUseCase:RefreshTokenUseCase

  ) { }


  private handleError = (error: unknown, res: Response) => {

    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.log(error); // Loguear el error no esperado
    return res.status(500).json({ error: 'Internal Server Error' });

  }


  registerUser = (req: Request, res: Response) => {

    const [error, registerDto] = RegisterUserDto.create(req.body);
    if (error) return res.status(400).json({ error });


    this.registerUserUseCase.execute(registerDto!)
      .then(data => res.json(data))
      .catch(error => this.handleError(error, res));
  }


  // En el método loginUser de tu AuthController...

loginUser = (req: Request, res: Response) => {
    const [error, loginUserDto] = LoginUserDto.create(req.body);
    if (error) return res.status(400).json({ error });
  
    // ¡Esta parte ahora funcionará!
    this.loginUserUseCase.execute(loginUserDto!)
      .then(data => {
        res.json({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          user: data.user,
        });
      })
      .catch(error => this.handleError(error, res));
  }

  refreshToken = (req: Request, res: Response) => {
    // El cliente nos envía su "foto" (refreshToken) en el cuerpo de la petición.
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ error: 'No se proporcionó refresh token' });

    // Le pasamos la foto a nuestra lógica de renovación.
    this.refreshTokenUseCase.execute(refreshToken)
      .then(data => res.json(data)) // Le devolvemos el nuevo pase diario.
      .catch(error => this.handleError(error, res));
  }




  validateEmail = (req: Request, res: Response) => {

    const { token } = req.params;
    if (!token) {
      return res.status(400).json({ error: 'Token no proporcionado' });

    }

    this.validateEmailUseCase.execute({ token })
      .then(() => res.redirect('/validation-success.html'))
      .catch(error => this.handleError(error, res));

  }


}

/**
 * ==================================================================================================
 *                               CONTROLADOR DE AUTENTICACIÓN (AuthController)
 * ==================================================================================================
 *
 * @file src/presentation/controllers/auth_controller.ts
 * @description Este archivo contiene la clase `AuthController`, que actúa como el punto de entrada
 *              para todas las peticiones HTTP relacionadas con la autenticación. Su función es
 *              recibir la petición, validar los datos de entrada y orquestar la ejecución de los
 *              casos de uso correspondientes.
 *
 * @analogy El `AuthController` es como el recepcionista de un hotel. No realiza las tareas
 *          complejas (como limpiar una habitación o cocinar), pero recibe a los huéspedes (peticiones),
 *          verifica su información (DTOs) y coordina al personal adecuado (casos de uso) para
 *          atender sus necesidades.
 *
 *
 * --------------------------------------------------------------------------------------------------
 *                                          CONSTRUCTOR
 * --------------------------------------------------------------------------------------------------
 * @constructor
 * @description El constructor implementa la Inyección de Dependencias. Recibe instancias de los
 *              casos de uso que necesita para funcionar, desacoplando al controlador de la
 *              lógica de negocio.
 * @param {RegisterUserUseCase} registerUserUseCase - Caso de uso para registrar nuevos usuarios.
 * @param {LoginUserUseCase} loginUserUseCase - Caso de uso para el inicio de sesión.
 * @param {ValidateEmailUseCase} validateEmailUseCase - Caso de uso para validar el correo del usuario.
 *
 *
 * --------------------------------------------------------------------------------------------------
 *                                     MÉTODO `handleError` (Privado)
 * --------------------------------------------------------------------------------------------------
 * @method handleError
 * @description Método centralizado para el manejo de errores. Permite que los métodos públicos
 *              sean más limpios y delegan la lógica de qué hacer en caso de un error.
 * @param {unknown} error - El error capturado, que puede ser de cualquier tipo.
 * @param {Response} res - El objeto de respuesta de Express para enviar el error al cliente.
 *
 * @paso 1: Verificación de Error Personalizado
 *   - Comprueba si el error es una instancia de `CustomError`. Estos son errores de negocio
 *     esperados (ej. "Email ya existe", "Credenciales inválidas").
 *   - Si lo es, utiliza el `statusCode` y el mensaje del propio error para la respuesta.
 *
 * @paso 2: Manejo de Errores Inesperados
 *   - Si no es un `CustomError`, se asume que es un error inesperado del sistema.
 *   - Se loguea el error en la consola para depuración.
 *   - Se devuelve un error genérico `500 Internal Server Error` al cliente para no exponer
 *     detalles de implementación.
 *
 *
 * --------------------------------------------------------------------------------------------------
 *                                     MÉTODOS PÚBLICOS (Manejadores de Ruta)
 * --------------------------------------------------------------------------------------------------
 *
 * @method registerUser
 * @description Maneja la petición `POST /register`.
 * @paso 1: Creación del DTO (Data Transfer Object) a partir del `req.body`.
 * @paso 2: Si el DTO es inválido, retorna un error `400`.
 * @paso 3: Ejecuta el `registerUserUseCase`.
 * @paso 4: Si tiene éxito, responde con los datos del usuario creado.
 * @paso 5: Si falla, delega el manejo del error a `this.handleError`.
 *
 * @method loginUser
 * @description Maneja la petición `POST /login`.
 * @paso 1: Creación del DTO a partir del `req.body`.
 * @paso 2: Si el DTO es inválido, retorna un error `400`.
 * @paso 3: Ejecuta el `loginUserUseCase`.
 * @paso 4: Si tiene éxito, responde con el token de sesión.
 * @paso 5: Si falla, delega el manejo del error a `this.handleError`.
 *
 * @method validateEmail
 * @description Maneja la petición `GET /validate-email/:token`.
 * @paso 1: Extrae el `token` de los parámetros de la URL.
 * @paso 2: Si no hay token, retorna un error `400`.
 * @paso 3: Ejecuta el `validateEmailUseCase`.
 * @paso 4: Si tiene éxito, redirige al usuario a una página de éxito en el frontend.
 * @paso 5: Si falla, delega el manejo del error a `this.handleError`.
 *
 */