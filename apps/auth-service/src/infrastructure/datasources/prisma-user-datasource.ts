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

    if (user ) {
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


    const token = jwt.sign(
      {},
      process.env.JWT_SECRET || "mi_clave_super_segura",
      { expiresIn: "15m" } // <-- ¡Así de simple!
    );


    const decodedToken: any = jwt.decode(token);

    const expirationDate = new Date(decodedToken.exp * 1000);

    // 2. Usamos esos datos para crear el usuario en la base de datos con Prisma.
    //    La contraseña (password) ya viene hasheada desde el Caso de Uso.
    const newUser = await prisma.user.create({
      data: {
        verificationToken: token,
        verificationTokenExpires: expirationDate,
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
      newUser.emailVerified,
      newUser.updatedAt,
      newUser.name || undefined,
      newUser.verificationTokenExpires || undefined,
      newUser.verificationToken || undefined

    );
  }


  // Añade este método para buscar por token
  async findVerificationToken(token: string): Promise<UserEntity | null> {
    const user = await prisma.user.findFirst({
      where: { verificationToken: token },
    });

    if (!user) return null;

    // Convierte el resultado de Prisma a tu UserEntity
    return UserEntity.fromObject(user);

  }


  //? Investigar como borrar despues de un tiempo los usarios no verificados de la base de datos 
  async checkVerifyEmail(email:string): Promise<boolean> {
    
    const userEmail = await prisma.user.findUnique({
    where: {
      email: email,
    },
    select: {
      emailVerified: true, // Solo trae este campo de la base de datos
    },
  });


  if (!userEmail) {
    throw new Error('Usuario no encontrado');
  }

  return userEmail.emailVerified;
   


  }



  // Añade este método para realizar la actualización final
  async verifyEmail(userId: string): Promise<UserEntity> {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {

        emailVerified: true,
        verificationToken: null, // ¡Limpiamos el token!
        verificationTokenExpires: null, // ¡Limpiampos la expiración!
      },
    });

    return UserEntity.fromObject(updatedUser);
  }

}

/**
 * ==================================================================================================
 *                        FUENTE DE DATOS DE USUARIO CON PRISMA (DataSource)
 * ==================================================================================================
 *
 * @file src/infrastructure/datasources/prisma-user-datasource.ts
 * @description Este archivo contiene la implementación concreta del `UserRepository` utilizando
 *              Prisma como ORM. Es la capa más baja de la arquitectura, responsable de interactuar
 *              directamente con la base de datos.
 *
 * @analogy Esta clase es como el "traductor" final que habla el idioma de la base de datos (SQL, a
 *          través de Prisma). El resto de la aplicación le da órdenes en un idioma común (la interfaz
 *          `UserRepository`), y esta clase las traduce y ejecuta en la base de datos.
 *
 *
 * --------------------------------------------------------------------------------------------------
 *                                          CLASE UserPrismaDatasource
 * --------------------------------------------------------------------------------------------------
 * @class UserPrismaDatasource
 * @implements {UserRepository}
 * @description Implementación del repositorio de usuarios que utiliza Prisma para las operaciones CRUD.
 *
 * @property {PrismaClient} prisma - Instancia del cliente de Prisma, disponible a nivel de módulo.
 *
 *
 * --------------------------------------------------------------------------------------------------
 *                                     MÉTODOS DE LA IMPLEMENTACIÓN
 * --------------------------------------------------------------------------------------------------
 *
 * @method registerUser
 * @description Crea un nuevo usuario en la base de datos.
 * @param {RegisterUserDto} registerUserDto - DTO con los datos del usuario a registrar.
 * @returns {Promise<UserEntity>} - La entidad del usuario recién creado.
 * @paso 1: Genera un token de verificación con una expiración de 15 minutos.
 * @paso 2: Utiliza `prisma.user.create` para guardar el nuevo usuario en la base de datos,
 *          incluyendo el token y su fecha de expiración.
 * @paso 3: Mapea manualmente el objeto de Prisma resultante a una `UserEntity` y la retorna.
 *
 * @method findByEmail
 * @description Verifica si un usuario existe en la base de datos basado en su email.
 * @returns {Promise<boolean>} - `true` si el usuario existe, `false` en caso contrario.
 *
 * @method verifyUserPassword
 * @description Compara una contraseña en texto plano con el hash almacenado para un usuario.
 * @returns {Promise<boolean>} - `true` si la contraseña coincide, `false` si no.
 * @paso 1: Busca al usuario por su email.
 * @paso 2: Si no existe, retorna `false`.
 * @paso 3: Utiliza `bcrypt.compare` para hacer la comparación segura y retorna el resultado.
 *
 * @method createTokenUser
 * @description Genera un token de sesión (JWT) para un usuario después de un login exitoso.
 * @param {LoginUserDto} loginUserDto - DTO con el email y la contraseña del usuario.
 * @returns {Promise<string>} - El token JWT firmado.
 * @throws {Error} - Si el usuario no existe o la contraseña es incorrecta.
 * @paso 1: Busca al usuario por email.
 * @paso 2: Compara la contraseña proporcionada con la almacenada.
 * @paso 3: Si las credenciales son válidas, firma un nuevo JWT con los datos del usuario y una
 *          expiración de 7 días.
 *
 * @method findVerificationToken
 * @description Busca a un usuario por su token de verificación de correo.
 * @returns {Promise<UserEntity | null>} - La entidad del usuario si se encuentra, o `null`.
 *
 * @method verifyEmail
 * @description Marca la cuenta de un usuario como verificada en la base de datos.
 * @param {string} userId - El ID del usuario a actualizar.
 * @returns {Promise<UserEntity>} - La entidad del usuario ya actualizado.
 * @paso 1: Utiliza `prisma.user.update` para cambiar `emailVerified` a `true`.
 * @paso 2: Limpia los campos `verificationToken` y `verificationTokenExpires` para invalidar el token.
 * @paso 3: Retorna la entidad del usuario actualizado.
 *
 */