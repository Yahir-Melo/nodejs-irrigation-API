import { Router } from "express";
import { InventoryController } from "../controllers/inventory_controller.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";
import { ProductPrismaDatasource } from "../../infraestructure/datasource/prisma-product.datasource.js";
import { CreateProductUseCase } from "../../application/use-cases/create-product.usecase.js";
import { get } from "http";
import { GetProductByIdUseCase } from "../../application/use-cases/get-product-by-id.usecase.js";
import { GetProductsUseCase } from "../../application/use-cases/get-products.usecase.js";

export class InventoryRoutes {

   static get routes(): Router {
 
    const router = Router();
    

    // 1. Crear las dependencias
    const datasource = new ProductPrismaDatasource();
    const productRepository = datasource; // O un repositorio intermedio si tuvieras
    const createProductUseCase = new CreateProductUseCase(productRepository);
    const getProductByIdUseCase = new GetProductByIdUseCase(productRepository);
    const getProductsUseCase = new GetProductsUseCase(productRepository);


    // 2. Inyectar dependencias al controlador
    const controller = new InventoryController(createProductUseCase,getProductByIdUseCase,getProductsUseCase );

    // ✅ CREAR un nuevo producto
    router.post('/products',AuthMiddleware.validateJWT,controller.createProduct);

    // ✅ LEER un solo producto por su ID
    router.get('/products/:id',AuthMiddleware.validateJWT,controller.getProductById);

    // ✅ LEER todos los productos
    router.get('/products',AuthMiddleware.validateJWT,controller.getProducts);

    // ✅ ACTUALIZAR un producto por su ID
    router.put('/products/:id',controller.updateProduct);

    // ✅ BORRAR un producto por su ID
    router.delete('/products/:id',controller.deleteProduct);
    
   
    return router;
   
   }  
}