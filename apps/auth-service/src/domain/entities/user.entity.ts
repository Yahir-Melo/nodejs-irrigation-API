import { Role } from './role.enum.js';

export class UserEntity {

  constructor(
    public id: string | undefined,
    public email: string,
    public passwordHash: string,
    public createdAt: Date,
    public role: Role,
    public emailVerified: boolean,
    public name: string,
    public refreshTokens: string[],
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
      refreshTokens = [], 
    } = object;

    if (!id) throw new Error('El ID es requerido');
    if (!email) throw new Error('El Email es requerido');
    if (!passwordHash) throw new Error('El PasswordHash es requerido');
    if (!createdAt) throw new Error('La fecha de creación es requerida');
    if (role === undefined || role === null) throw new Error('El Rol es requerido');
    if (emailVerified === undefined || emailVerified === null) throw new Error('El estado de verificación de email es requerido');
    
    let userRole: Role;
    if (role === 'ADMIN') {
      userRole = Role.ADMIN;
    } else {
      userRole = Role.USER;
    }

    return new UserEntity(
      id,
      email,
      passwordHash,
      createdAt,
      userRole,
      emailVerified,
      name,
      refreshTokens,
      updatedAt,
      verificationTokenExpires,
      verificationToken
    );
  }
}
