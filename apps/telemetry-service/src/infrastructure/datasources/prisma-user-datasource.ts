// infrastructure/repositories/user.prisma.repository.ts

import { PrismaClient } from "../../generated/prisma/index.js";
import { UserEntity } from "../../domain/entities/user.entity.js";
import { UserRepository } from "../../domain/repositories/user.repository.js";
import { RegisterUserDto } from "../../domain/dtos/auth/register.user.dto.js";  

const prisma = new PrismaClient();

export class UserPrismaDatasource implements UserRepository {


  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null;

    return new UserEntity(
      user.id,
      user.email,
      user.passwordHash,
      user.createdAt,
      user.role as any,
      user.verificatedEmail,
      user.updatedAt,
      user.name || undefined
    );
  }

  // ESTE ES EL MÉTODO IMPORTANTE
  async registerUser(registerUserDto: RegisterUserDto): Promise<UserEntity> {
    
    // 1. Sacamos los datos del DTO que nos manda el Caso de Uso.
    const { name, email, password } = registerUserDto;

    // 2. Usamos esos datos para crear el usuario en la base de datos con Prisma.
    //    La contraseña (password) ya viene hasheada desde el Caso de Uso.
    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        passwordHash: password, 
      }
    });

    // 3. Creamos una UserEntity a partir de los datos del usuario recién creado y la retornamos.
    return new UserEntity(
      newUser.id,
      newUser.email,
      newUser.passwordHash,
      newUser.createdAt,
      newUser.role as any,
      newUser.verificatedEmail,
      newUser.updatedAt,
      newUser.name || undefined
    );
  }
}