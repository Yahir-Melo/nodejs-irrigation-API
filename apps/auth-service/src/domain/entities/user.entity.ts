import { Role } from './role.enum.js';

export class UserEntity {

  // CORREGIDO: Se movieron los parámetros opcionales al final para seguir las convenciones
  // y evitar errores de orden. 'refreshTokens' ahora es el último parámetro requerido.
  constructor(
    public id: string | undefined,
    public email: string,
    public passwordHash: string,
    public createdAt: Date,
    public role: Role,
    public emailVerified: boolean,
    public name: string,
    public refreshTokens: string[], // Ahora está aquí
    public updatedAt?: Date,
    public verificationTokenExpires?: Date | null,
    public verificationToken?: string | null,
  ) {}

  public static fromObject(object: { [key: string]: any }): UserEntity {

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
      verificationToken,
      // CORREGIDO: Se asigna un array vacío por defecto si la propiedad no existe.
      refreshTokens = [], 
    } = object;

    // Validaciones de campos obligatorios (sin cambios)
    if (!id) throw new Error('El ID es requerido');
    if (!email) throw new Error('El Email es requerido');
    if (!passwordHash) throw new Error('El PasswordHash es requerido');
    if (!createdAt) throw new Error('La fecha de creación es requerida');
    if (role === undefined || role === null) throw new Error('El Rol es requerido');
    if (emailVerified === undefined || emailVerified === null) throw new Error('El estado de verificación de email es requerido');
    
    // ELIMINADO: Esta validación era incorrecta. Un usuario puede no tener tokens.
    // if (refreshTokens === undefined || refreshTokens=== null) throw new Error('se necesita un refreshToken');
    
    let userRole: Role;
    if (role === 'ADMIN') {
      userRole = Role.ADMIN;
    } else {
      userRole = Role.USER;
    }

    // CORREGIDO: El orden de los argumentos ahora coincide con el nuevo constructor.
    return new UserEntity(
      id,
      email,
      passwordHash,
      createdAt,
      userRole,
      emailVerified,
      name,
      refreshTokens, // 8º
      updatedAt,     // 9º (opcional)
      verificationTokenExpires, // 10º (opcional)
      verificationToken,        // 11º (opcional)
    );
  }
}