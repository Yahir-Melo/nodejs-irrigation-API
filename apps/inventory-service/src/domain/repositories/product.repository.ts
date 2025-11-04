import type { GetProductsDto } from "../../application/dtos/get-products.dto.js";
import type { ProductEntity } from "../entities/product.entity.js";


export abstract class ProductRepository {

  // Usamos 'save' como en el auth-service para crear y actualizar
  abstract save(product: ProductEntity): Promise<ProductEntity>;

  // Necesitaremos esto para verificar que el SKU no se repita
  abstract findBySku(sku: string): Promise<ProductEntity | null>;
  abstract findById(id: string): Promise<ProductEntity | null>;
  
  // 👇 AÑADE ESTA LÍNEA (El nuevo contrato para la lista)
  abstract findAll(dto: GetProductsDto): Promise<ProductEntity[]>;
}