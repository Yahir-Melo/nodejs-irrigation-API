export class CreateProductDto {

  private constructor(
    public readonly name: string,
    public readonly sku: string,
    public readonly price: number,
    public readonly stock?: number,
    public readonly description?: string,
    public readonly category?: string,
  ) {}

  // 👇 ¡LA CORRECCIÓN ESTÁ EN ESTA LÍNEA!
  static create(props: { [key: string]: any }): [string , CreateProductDto | undefined] { // <-- Asegúrate de que CreateProductDto tenga el '?'
    
    const { name, sku, price, stock, description, category } = props;

    // Validaciones (¡Estas ya están correctas!)
    if (!name) return ['El nombre es requerido', undefined];
    if (!sku) return ['El SKU es requerido', undefined];
    if (!price) return ['El precio es requerido', undefined];
    
    let numPrice = +price;
    if (isNaN(numPrice) || numPrice <= 0) return ['El precio debe ser un número positivo', undefined];

    let numStock = stock ? +stock : undefined;
    if (numStock && (isNaN(numStock) || numStock < 0)) return ['El stock debe ser un número positivo', undefined];

    // Este retorno de éxito ya estaba bien
    return ['', new CreateProductDto(
      name,
      sku,
      numPrice,
      numStock,
      description,
      category
    )];
  }
}