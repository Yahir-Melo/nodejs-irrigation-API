import { Router } from "express";
import { InventoryController } from "../controllers/inventory_controller.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";

export class InventoryRoutes {

   static get routes(): Router {
 
    const router = Router();
    const controller = new InventoryController();

    // ✅ CREAR un nuevo producto
    router.post('/products', AuthMiddleware.validateJWT, controller.createProduct);

    // ✅ LEER todos los productos
    router.get('/products', AuthMiddleware.validateJWT, controller.getProducts);

    // ✅ LEER un solo producto por su ID
    router.get('/products/:id', AuthMiddleware.validateJWT, controller.getProductById);

    // ✅ ACTUALIZAR un producto por su ID
    router.put('/products/:id', AuthMiddleware.validateJWT, controller.updateProduct);

    // ✅ BORRAR un producto por su ID
    router.delete('/products/:id', AuthMiddleware.validateJWT, controller.deleteProduct);

     return router;
   }  
}