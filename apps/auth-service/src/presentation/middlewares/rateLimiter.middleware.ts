// src/presentation/middlewares/rateLimiter.ts

import * as expressRateLimit from 'express-rate-limit';
import type { Request, Response } from 'express'; // <-- Importa Request y Response
 // <-- Importa Request y Response

// Middleware para la ruta de Login: Más estricto y CON REGISTRO DE IP
export const loginLimiter = expressRateLimit.rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        status: 429,
        message: 'Demasiados intentos de inicio de sesión desde esta IP. Por favor, inténtelo de nuevo mas tarde.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    
    // 👇 AQUÍ ESTÁ LA MAGIA: El handler personalizado
    handler: (req: Request, res: Response, next, options) => {
        // Registramos el intento de ataque en la consola del servidor
        console.warn(
            `[RATE LIMIT] Bloqueado intento de fuerza bruta a la ruta: ${req.originalUrl} desde la dirección IP: ${req.ip}`
        );

        // Enviamos la respuesta de error que definimos en `message`
        res.status(options.statusCode).json(options.message);
    },
});

// Middleware para la ruta de Registro con registro de IP también
export const registerLimiter = expressRateLimit.rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: {
        status: 429,
        message: 'Demasiadas cuentas creadas desde esta IP. Por favor, inténtelo de nuevo después de una hora.'
    },
    standardHeaders: true,
    legacyHeaders: false,

    // 👇 Añadimos el mismo handler aquí
    handler: (req: Request, res: Response, next, options) => {
        console.warn(
            `[RATE LIMIT] Bloqueado intento de creación masiva en la ruta: ${req.originalUrl} desde la dirección IP: ${req.ip}`
        );
        res.status(options.statusCode).json(options.message);
    },
});