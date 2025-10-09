// infrastructure/repositories/user.prisma.repository.ts

import { PrismaClient } from "../../generated/prisma/index.js";
import { UserEntity } from "../../domain/entities/user.entity.js";
import { UserRepository } from "../../domain/repositories/user.repository.js";
import { RegisterUserDto } from "../../domain/dtos/auth/register.user.dto.js";
import bcrypt from "bcryptjs";
import { LoginUserDto } from "../../domain/dtos/auth/login.user.dto.js";
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export class UserPrismaDatasource implements UserRepository {
  

  async verifyUserPassword(passwordToCheck: string, email: string): Promise<boolean> {
    // 1. Busca al usuario por su email para obtener su hash guardado
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    // 2. Si el usuario no existe o no tiene hash, la contraseña no es válida
    if (!user || !user.passwordHash) {
      return false;
    }

    // 3. Compara la contraseña del login (dto.password) con el hash de la BD
    // bcrypt.compare es la función clave para esto.
    const isMatch = await bcrypt.compare(passwordToCheck, user.passwordHash);

    // 4. Retorna el resultado: true si coinciden, false si no
    return isMatch;
  }



  async findByEmail(email: string): Promise<boolean> {
    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      return true;
    } else {
      return false;
    }
  }

    async createTokenUser(loginUserDto: LoginUserDto): Promise<string> {
    // 1️⃣ Buscar al usuario
    const user = await prisma.user.findUnique({
      where: { email: loginUserDto.email },
    });

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    // 2️⃣ Verificar contraseña
    const passwordOk = await bcrypt.compare(loginUserDto.password, user.passwordHash);
    if (!passwordOk) {
      throw new Error("Contraseña incorrecta");
    }

    // 3️⃣ Generar el token JWT
    const token = jwt.sign(
      {
        id: user.id,       // id del usuario real en BD
        email: user.email, // email real
        role: user.role,   // rol (admin, user, etc.)
      },
      process.env.JWT_SECRET || "mi_clave_super_segura",
      { expiresIn: "7d" }
    );
     

    // Retornar token con los datos del usuario
    return token;
   

    
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