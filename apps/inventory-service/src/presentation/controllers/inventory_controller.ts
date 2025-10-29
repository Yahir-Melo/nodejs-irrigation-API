import type { NextFunction, Request, Response } from 'express';
import type { CreateProductUseCase } from '../../application/use-cases/create-product.usecase.js';
import { CustomError } from '../../domain/errors/custom.error.js';
import { CreateProductDto } from '../../application/dtos/create_product.dto.js';

export class InventoryController {

   constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    // (Aquí inyectarás tus otros casos de uso... GetProductsUseCase, etc.)
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








   getProducts() {
      throw new Error("Method not implemented.");
   }

   
  
   getProductById(){
    throw new Error("Method not implemented.");
   }

   updateProduct(){
    throw new Error("Method not implemented.");
   }

   deleteProduct(){
    throw new Error("Method not implemented.");
   }

   


}