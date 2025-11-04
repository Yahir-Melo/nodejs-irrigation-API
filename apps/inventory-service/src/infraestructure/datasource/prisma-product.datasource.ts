
import type { GetProductsDto } from '../../application/dtos/get-products.dto.js';
import { ProductEntity } from '../../domain/entities/product.entity.js';
import { ProductRepository } from '../../domain/repositories/product.repository.js';
import { Prisma, PrismaClient } from '../../generated/prisma/index.js';

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




  //IMPLEMENTACION DEL METODO PARA BUSCAR POR ID
  async findById(id: string): Promise<ProductEntity | null> {
    const product = await prisma.product.findUnique({
      where: { id: id }
    });

    // Si no se encuentra, devolvemos null
    if (!product) return null;

    // Si se encuentra, lo convertimos a nuestra entidad y lo devolvemos
    return ProductEntity.fromObject(product);
  }


  // 👇 IMPLEMENTA EL NUEVO MÉTODO PARA BUSCAR POR UN FILTRO
  async findAll(dto: GetProductsDto): Promise<ProductEntity[]> {
    const { page, limit, category, status, search } = dto;

    // Lógica de paginación
    const skip = (page - 1) * limit;

    // 1. Empezamos con un objeto 'where' vacío
    const where: Prisma.ProductWhereInput = {};

    // 2. Construimos el 'where' dinámicamente
    if (category) {
      where.category = category;
    }

    if (status) {
      where.status = status;
    }

    // 3. Lógica de búsqueda (para nombre o SKU)
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }

    // 4. Ejecutamos la consulta en la BD
    const products = await prisma.product.findMany({
      where: where,
      skip: skip,
      take: limit,
    });

    // 5. Mapeamos los resultados a nuestra entidad
    return products.map(product => ProductEntity.fromObject(product));
  }


  




}