import { ProductEntity } from "../../domain/entities/product.entity.js";
import { CustomError } from "../../domain/errors/custom.error.js";
import type { ProductRepository } from "../../domain/repositories/product.repository.js";
import type { CreateProductDto } from "../dtos/create_product.dto.js";


export class CreateProductUseCase {

  constructor(
    private readonly productRepository: ProductRepository
  ) {}

  async execute(dto: CreateProductDto): Promise<ProductEntity> {
    // 1. Lógica de Negocio: Verificar si ya existe un producto con ese SKU
    const existingProduct = await this.productRepository.findBySku(dto.sku);
    if (existingProduct) {
      throw CustomError.badRequest('Un producto con este SKU ya existe.');
    }

    // 2. Determinar el estado inicial del stock
    const stock = dto.stock ?? 0;
    const status = stock > 10 ? 'En Stock' : (stock > 0 ? 'Bajo Stock' : 'Agotado');

    // 3. Crear la entidad
    // (Nota: el ID será 'undefined' aquí, lo que le indica a 'save' que es un 'create')
    const newProduct = new ProductEntity(
      undefined, // El ID se generará en la BD
      dto.name,
      dto.sku,
      dto.price,
      stock,
      dto.description || null,
      dto.category || null,
      status,
      new Date(), // createdAt
    );

    // 4. Guardar el producto
    const savedProduct = await this.productRepository.save(newProduct);
    
    return savedProduct;
  }
}