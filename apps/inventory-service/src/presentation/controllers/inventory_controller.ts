import type { Request, Response } from 'express';

export class InventoryController {

    profile(req: Request, res: Response) {
        // Envía una respuesta con estado 200 (OK) y un cuerpo JSON
        return res.status(200).json({
            success: true,
            message: 'Perfil obtenido exitosamente'
        });
    }

}