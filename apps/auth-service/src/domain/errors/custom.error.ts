/**
 * Representa un error personalizado con un código de estado HTTP y un mensaje específicos.
 * Esta clase se utiliza para crear respuestas de error estandarizadas en toda la aplicación.
 */
export class CustomError extends Error {

    /**
     * @param statusCode El código de estado HTTP asociado con el error.
     * @param message El mensaje de error.
     */
    private constructor(
        public readonly statusCode: number,
        public readonly message: string,
    ) { 
        super(message); 
    }

    /**
     * Crea un error 400 Bad Request (Petición Incorrecta).
     * Usar para errores del lado del cliente, como datos de entrada inválidos.
     * @param message El mensaje de error.
     * @returns Una nueva instancia de CustomError.
     */
    static badRequest(message: string): CustomError {
        return new CustomError(400, message);
    }

    /**
     * Crea un error 401 Unauthorized (No Autorizado).
     * Usar cuando se requiere autenticación pero ha fallado o no se ha proporcionado.
     * @param message El mensaje de error.
     * @returns Una nueva instancia de CustomError.
     */
    static unauthorized(message: string): CustomError {
        return new CustomError(401, message);
    }

    /**
     * Crea un error 403 Forbidden (Prohibido).
     * Usar cuando el cliente está autenticado pero no tiene permisos para acceder al recurso.
     * @param message El mensaje de error.
     * @returns Una nueva instancia de CustomError.
     */
    static forbidden(message: string): CustomError {
        return new CustomError(403, message);
    }

    /**
     * Crea un error 404 Not Found (No Encontrado).
     * Usar cuando el recurso solicitado no se pudo encontrar en el servidor.
     * @param message El mensaje de error.
     * @returns Una nueva instancia de CustomError.
     */
    static notFound(message: string): CustomError {
        return new CustomError(404, message);
    }

    /**
     * Crea un error 500 Internal Server Error (Error Interno del Servidor).
     * Usar para errores inesperados del lado del servidor.
     * @param message El mensaje de error.
     * @returns Una nueva instancia de CustomError.
     */
    static internalServerError(message: string = 'Error Interno del Servidor'): CustomError {
        return new CustomError(500, message);
    }

}