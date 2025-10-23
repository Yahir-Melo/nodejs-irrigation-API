// src/infrastructure/datasources/prisma-user-datasource.ts
import { PrismaClient, Role as PrismaRole } from "../../generated/prisma/index.js";
import { UserEntity, Role as DomainRole } from "../../domain/entities/user.entity.js";
import { UserRepository } from "../../domain/repositories/user.repository.js";
import { CustomError } from "../../domain/errors/custom.error.js";

const prisma = new PrismaClient();

/**
 * REFACTORIZADO:
 * La clase ahora implementa el nuevo y más limpio UserRepository.
 * La lógica de negocio (bcrypt, jwt) ha sido eliminada.
 */
export class UserPrismaDatasource implements UserRepository {
  

  /**
   * NUEVO MÉTODO:
   * Implementa la lógica "inteligente" para crear o actualizar un usuario.
   * Utiliza `upsert` de Prisma para mayor eficiencia.
   */
  async save(user: UserEntity): Promise<UserEntity> {
    const data = {
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
      emailVerified: user.emailVerified,
      role: user.role === DomainRole.ADMIN ? PrismaRole.ADMIN : PrismaRole.USER,
      
      // Mapeo de verificación (ya lo tenías)
      verificationToken: user.verificationToken,
      verificationTokenExpires: user.verificationTokenExpires,
      
      // Mapeo de refresh (ya lo tenías)
      refreshTokens: user.refreshTokens,

      // 👇 ¡SOLUCIÓN! AÑADE ESTAS DOS LÍNEAS QUE FALTABAN
      passwordResetToken: user.passwordResetToken,
      passwordResetExpires: user.passwordResetExpires,
    };

    // Usamos el objeto 'data' limpio, no el 'cleanUserData' que tenías
    // El truco de JSON.parse(JSON.stringify(data)) es bueno para eliminar 'undefined'
    const cleanUserData = JSON.parse(JSON.stringify(data)); 

    // Si la entidad NO tiene un ID, es un usuario nuevo. Usamos 'create'.
    if (!user.id) {
      const newUser = await prisma.user.create({
        data: cleanUserData,
      });
      return UserEntity.fromObject(newUser);
    }

    // Si la entidad SÍ tiene un ID, es un usuario existente. Usamos 'update'.
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: cleanUserData,
    });

    return UserEntity.fromObject(updatedUser);
  }



  // MÉTODO NUEVO (aunque no se usa en register, es parte del contrato)
  async findById(id: string): Promise<UserEntity | null> {
    const user = await prisma.user.findUnique({ where: { id } });
    return user ? UserEntity.fromObject(user) : null;
  }

  /**
   * MÉTODO MODIFICADO:
   * Ahora busca y devuelve la entidad completa o null, en lugar de un booleano.
   */
  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    return user ? UserEntity.fromObject(user) : null;
  }

  // MÉTODO CONSERVADO (ya era correcto)
  async findByVerificationToken(token: string): Promise<UserEntity | null> {
    const user = await prisma.user.findFirst({
      where: { verificationToken: token },
    });
    return user ? UserEntity.fromObject(user) : null;
  }

  async findByPasswordResetToken(token: string): Promise<UserEntity | null> {
    const user = await prisma.user.findFirst({
      where: { passwordResetToken: token },
    });
    return user ? UserEntity.fromObject(user) : null;
  }

  // MÉTODOS ELIMINADOS DE ESTE ARCHIVO:
  // - registerUser
  // - verifyUserPassword
  // - createTokenUser
  // - checkVerifyEmail
  // - verifyEmail
}