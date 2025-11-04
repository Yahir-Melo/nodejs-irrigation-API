import type { NextFunction, Request, Response } from 'express';
import type { CreateProductUseCase } from '../../application/use-cases/create-product.usecase.js';
import { CustomError } from '../../domain/errors/custom.error.js';
import { CreateProductDto } from '../../application/dtos/create_product.dto.js';
import type { GetProductByIdUseCase } from '../../application/use-cases/get-product-by-id.usecase.js';
import type { GetProductsUseCase } from '../../application/use-cases/get-products.usecase.js';
import { GetProductsDto } from '../../application/dtos/get-products.dto.js';

export class InventoryController {
   // (Aquí se inyectan otros casos de uso... GetProductsUseCase, etc.)
   constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    // 👇 Inyecta el nuevo caso de uso
    private readonly getProductByIdUseCase: GetProductByIdUseCase,
    
    private readonly getProductsUseCase: GetProductsUseCase
    
    
  ) {}




  // El manejador de errores que ya conoces
  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(error); 
    return res.status(500).json({ error: 'Internal Server Error' });
  }

  
  // El método para el endpoint
  createProduct = (req: Request, res: Response) => {
    // Validamos el DTO
    const [error, createProductDto] = CreateProductDto.create(req.body);
    if (error) return res.status(400).json({ error });

    // Ejecutamos el Caso de Uso
    this.createProductUseCase.execute(createProductDto!)
      .then(product => res.status(201).json(product)) // 201 Created es el código correcto
      .catch(error => this.handleError(error, res));
  }

   
  // 👇 AÑADE ESTE NUEVO MÉTODO
  
  getProductById = (req: Request, res: Response) => {
    // 1. Obtenemos el ID de los parámetros de la ruta (ej. /products/abc-123)
    const { id } = req.params;

    // (Opcional pero recomendado: validar que el ID no esté vacío)
    if (!id) {
      return res.status(400).json({ error: 'El ID del producto es requerido' });
    }

    // 2. Ejecutamos el Caso de Uso
    this.getProductByIdUseCase.execute(id)
      .then(product => res.json(product)) // Devolvemos el producto encontrado
      .catch(error => this.handleError(error, res)); // Manejamos errores (ej. 404 Not Found)
  }






   // 👇 AÑADE ESTE NUEVO MÉTODO PARA OBTENER LOS PRODUCTOS 
  getProducts = (req: Request, res: Response) => {
    // 1. Los filtros vienen de 'req.query' (ej. ?page=1&search=taza)
    const [error, getProductsDto] = GetProductsDto.create(req.query);

    // 2. Validamos el DTO
    if (error) return res.status(400).json({ error });

    // 3. Ejecutamos el Caso de Uso
    this.getProductsUseCase.execute(getProductsDto!)
      .then(products => res.json(products))
      .catch(error => this.handleError(error, res));
  }
   
  
  

   updateProduct(){
    throw new Error("Method not implemented.");
   }

   deleteProduct(){
    throw new Error("Method not implemented.");
   }

   


}