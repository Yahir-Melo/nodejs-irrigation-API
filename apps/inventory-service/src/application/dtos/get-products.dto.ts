
export class GetProductsDto {

  private constructor(
    public readonly page: number,
    public readonly limit: number,
    public readonly category?: string,
    public readonly status?: string,
    public readonly search?: string,
  ) {}

  static create(props: { [key: string]: any }): [string, GetProductsDto | undefined] {
    // Asignamos valores por defecto para la paginación
    const { page = 1, limit = 10, category, status, search } = props;

    let numPage = +page;
    let numLimit = +limit;

    if (isNaN(numPage) || numPage <= 0) {
      return ['El parámetro "page" debe ser un número positivo', undefined];
    }
    if (isNaN(numLimit) || numLimit <= 0) {
      return ['El parámetro "limit" debe ser un número positivo', undefined];
    }

    return ['', new GetProductsDto(
      numPage,
      numLimit,
      category,
      status,
      search
    )];
  }
}