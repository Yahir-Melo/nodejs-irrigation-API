import { Router } from "express";
import { InventoryController } from "../controllers/inventory_controller.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";
import { ProductPrismaDatasource } from "../../infraestructure/datasource/prisma-product.datasource.js";
import { CreateProductUseCase } from "../../application/use-cases/create-product.usecase.js";

export class InventoryRoutes {

   static get routes(): Router {
 
    const router = Router();
    

    // 1. Crear las dependencias
    const datasource = new ProductPrismaDatasource();
    const productRepository = datasource; // O un repositorio intermedio si tuvieras
    const createProductUseCase = new CreateProductUseCase(productRepository);



    // 2. Inyectar dependencias al controlador
    const controller = new InventoryController(createProductUseCase);

    // ✅ CREAR un nuevo producto
    router.post('/products',AuthMiddleware.validateJWT,controller.createProduct);

    // ✅ LEER todos los productos
    router.get('/products',controller.getProducts);

    // ✅ LEER un solo producto por su ID
    router.get('/products/:id',controller.getProductById);

    // ✅ ACTUALIZAR un producto por su ID
    router.put('/products/:id',controller.updateProduct);

    // ✅ BORRAR un producto por su ID
    router.delete('/products/:id',controller.deleteProduct);
    
   
    return router;
   
   }  
}