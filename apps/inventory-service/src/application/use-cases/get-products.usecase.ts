import type { ProductEntity } from "../../domain/entities/product.entity.js";
import type { ProductRepository } from "../../domain/repositories/product.repository.js";
import type { GetProductsDto } from "../dtos/get-products.dto.js";

export class GetProductsUseCase {

  constructor(
    private readonly productRepository: ProductRepository
  ) {}

  async execute(dto: GetProductsDto): Promise<ProductEntity[]> {
    // Simplemente llamamos al repositorio con los filtros
    const products = await this.productRepository.findAll(dto);
    return products;
  }
}