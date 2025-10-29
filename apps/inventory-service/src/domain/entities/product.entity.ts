// Sencillo por ahora, puedes añadir validaciones después
export class ProductEntity {
  constructor(
    public id: string | undefined,
    public name: string,
    public sku: string,
    public price: number,
    public stock: number,
    public description: string | null,
    public category: string | null,
    public status: string,
    public createdAt: Date,
  ) {}

  public static fromObject(object: { [key: string]: any }): ProductEntity {
    const { id, name, sku, price, stock, description, category, status, createdAt } = object;
    // (Aquí puedes añadir validaciones si un objeto de la BD viene corrupto)
    return new ProductEntity(id, name, sku, price, stock, description, category, status, createdAt);
  }


}