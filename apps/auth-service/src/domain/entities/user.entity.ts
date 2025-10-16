// Define tu enum de roles como lo tienes
export enum Role {
    USER,
    ADMIN,
}

export class UserEntity {

  constructor(
    public id: string | undefined,
    public email: string,
    public passwordHash: string,
    public createdAt: Date,
    public role: Role, // Nota: cambié "Role" a "role" para seguir la convención de minúsculas en propiedades
    public emailVerified: boolean,
    public name: string,
    public updatedAt?: Date,
    public verificationTokenExpires?: Date,
    public verificationToken?: string,
  ) {}


  /**
   * Factory Method para crear una instancia de UserEntity desde un objeto genérico.
   * Este método es el "puente" entre el objeto que viene de la base de datos (Prisma)
   * y nuestra entidad de dominio.
   * * @param object El objeto con los datos del usuario, típicamente de Prisma.
   * @returns Una nueva instancia de UserEntity.
   */
  public static fromObject(object: { [key: string]: any }): UserEntity {

    // 1. Desestructuramos las propiedades del objeto que nos llega.
    //    Separamos las que son obligatorias de las opcionales.
    const { 
      id, 
      email, 
      passwordHash, 
      createdAt, 
      role, 
      emailVerified,
      name,
      updatedAt,
      verificationTokenExpires,
      verificationToken
    } = object;

    // 2. Hacemos validaciones para los campos obligatorios.
    //    Esto asegura que nunca creemos una entidad en un estado inválido.
    if (!id) throw new Error('El ID es requerido');
    if (!email) throw new Error('El Email es requerido');
    if (!passwordHash) throw new Error('El PasswordHash es requerido');
    if (createdAt === undefined || createdAt === null) throw new Error('La fecha de creación es requerida');
    if (role === undefined || role === null) throw new Error('El Rol es requerido');
    if (emailVerified === undefined || emailVerified === null) throw new Error('El estado de verificación de email es requerido');
    
    // 3. Mapeo de datos: El 'role' de Prisma viene como un STRING ('USER' o 'ADMIN').
    //    Necesitamos convertirlo al tipo de nuestro ENUM (Role.USER o Role.ADMIN).
    let userRole: Role;
    if (role === 'ADMIN') {
      userRole = Role.ADMIN;
    } else {
      userRole = Role.USER; // Si no es ADMIN, por defecto será USER.
    }

    // 4. Creamos y retornamos la nueva instancia de nuestra entidad,
    //    pasando los datos ya limpios y validados al constructor.
    return new UserEntity(
      id,
      email,
      passwordHash,
      createdAt,
      userRole, // Pasamos el valor del enum, no el string
      emailVerified,
      name,
      updatedAt,
      verificationTokenExpires,
      verificationToken
    );
  }
}