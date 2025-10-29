
import { ProductEntity } from '../../domain/entities/product.entity.js';
import { ProductRepository } from '../../domain/repositories/product.repository.js';
import { PrismaClient } from '../../generated/prisma/index.js';

const prisma = new PrismaClient(); // Instancia de Prisma

export class ProductPrismaDatasource implements ProductRepository {

  // Implementamos el método 'save' "inteligente"
  async save(product: ProductEntity): Promise<ProductEntity> {
    const data = {
      name: product.name,
      sku: product.sku,
      price: product.price,
      stock: product.stock,
      description: product.description,
      category: product.category,
      status: product.status,
    };
    
    // Si la entidad no tiene ID, es un 'create'
    if (!product.id) {
      const newProduct = await prisma.product.create({ data });
      return ProductEntity.fromObject(newProduct);
    }

    // Si tiene ID, es un 'update'
    const updatedProduct = await prisma.product.update({
      where: { id: product.id },
      data,
    });
    return ProductEntity.fromObject(updatedProduct);
  }

  // Implementamos el método de búsqueda por SKU
  async findBySku(sku: string): Promise<ProductEntity | null> {
    const product = await prisma.product.findUnique({
      where: { sku: sku }
    });
    if (!product) return null;
    return ProductEntity.fromObject(product);
  }
}