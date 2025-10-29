import type { ProductEntity } from "../entities/product.entity.js";


export abstract class ProductRepository {

  // Usamos 'save' como en el auth-service para crear y actualizar
  abstract save(product: ProductEntity): Promise<ProductEntity>;

  // Necesitaremos esto para verificar que el SKU no se repita
  abstract findBySku(sku: string): Promise<ProductEntity | null>;
  abstract findById(id: string): Promise<ProductEntity | null>;
  
}