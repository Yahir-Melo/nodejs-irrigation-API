import { type NextFunction, type Request, type Response } from 'express';
import jwt from 'jsonwebtoken';
import { envs } from '../../config/plugins/envs.plugin.js';

export class AuthMiddleware {

  static validateJWT(req: Request, res: Response, next: NextFunction) {
    // 1. Leer el token de la cabecera 'Authorization'
    const authorization = req.header('Authorization');
    if (!authorization) {
      return res.status(401).json({ error: 'No se proporcionó token' });
    }
    if (!authorization.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token Bearer inválido' });
    }

    // Extraemos el token quitando el "Bearer " del principio
    const token = authorization.split(' ').at(1) || '';

    try {
      // 2. Verificar el token con nuestro secreto
      const payload = jwt.verify(
        token,
        envs.JWT_ACCESS_SECRET 
      );

      // 3. Si es válido, adjuntamos el payload a la petición
      // para que las rutas posteriores puedan saber qué usuario hizo la petición.
     // --- 👇 CAMBIO CLAVE AQUÍ ---
      // Adjuntamos el payload directamente a 'req', no a 'req.body'.
      // Usamos '(req as any)' para evitar errores de TypeScript por ahora.
      (req as any).user = payload;

      // 4. Dejar pasar al siguiente middleware o a la ruta final.
      next();

    } catch (error) {
      console.error(error);
      return res.status(401).json({ error: 'Token inválido' });
    }
  }
}