import type { ProductEntity } from "../../domain/entities/product.entity.js";
import { CustomError } from "../../domain/errors/custom.error.js";
import type { ProductRepository } from "../../domain/repositories/product.repository.js";


export class GetProductByIdUseCase {

  constructor(
    private readonly productRepository: ProductRepository
  ) {}

  async execute(id: string): Promise<ProductEntity> {
    // 1. Llamamos al repositorio para buscar el producto
    const product = await this.productRepository.findById(id);

    // 2. Si no se encontró, lanzamos un error claro
    if (!product) {
      throw CustomError.notFound(`Producto con ID ${id} no encontrado.`);
    }

    // 3. Si se encontró, lo devolvemos
    return product;
  }

  
}
