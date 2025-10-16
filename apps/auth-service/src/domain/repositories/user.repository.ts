// src/domain/repositories/user.repository.ts
import { UserEntity } from '../entities/user.entity.js';

/**
 * REFACTORIZADO:
 * Este es el nuevo contrato. Es simple, agnóstico y solo opera con entidades del dominio.
 * - Se eliminaron: registerUser, createTokenUser, verifyUserPassword, checkVerifyEmail.
 * - Se añadió: save y findById.
 * - Se modificó: findByEmail ahora devuelve la entidad o null.
 */
export abstract class UserRepository {

  /**
   * Guarda o actualiza una entidad de usuario.
   * @param user La entidad de usuario a persistir.
   */
  abstract save(user: UserEntity): Promise<UserEntity>;

  /**
   * Busca un usuario por su ID único.
   * @param id El ID del usuario.
   */
  abstract findById(id: string): Promise<UserEntity | null>;

  /**
   * Busca un usuario por su dirección de email.
   * @param email El email del usuario.
   */
  abstract findByEmail(email: string): Promise<UserEntity | null>;

  /**
   * Busca un usuario por su token de verificación.
   * @param token El token de verificación.
   */
  abstract findByVerificationToken(token: string): Promise<UserEntity | null>;
}