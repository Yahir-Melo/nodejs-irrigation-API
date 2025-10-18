// src/application/use-cases/validate-email.usecase.ts

import { CustomError } from "../../domain/errors/custom.error.js";
import type { UserRepository } from "../../domain/repositories/user.repository.js";

// Interfaces (sin cambios)
export interface ValidateEmailUseCaseInput {
  token: string;
}

export interface ValidateEmailUseCaseOutput {
  success: boolean;
  message: string;
}

/**
 * REFACTORIZADO:
 * El único cambio es usar el método genérico 'save' para persistir los cambios.
 */
export class ValidateEmailUseCase {
  
  constructor(
    private readonly userRepository: UserRepository 
  ) {}

  async execute(input: ValidateEmailUseCaseInput): Promise<ValidateEmailUseCaseOutput> {
    
    // 1. Buscar al usuario por el token (sin cambios, ya usaba un método correcto).
    const user = await this.userRepository.findByVerificationToken(input.token);

    if (!user) {
      throw CustomError.badRequest("Token de verificación inválido.");
    }

    // 2. Verificar si el token ha expirado (sin cambios).
    if (user.verificationTokenExpires && user.verificationTokenExpires < new Date()) {
      throw CustomError.badRequest("El token de verificación ha expirado.");
    }
    
    // 3. Si el usuario ya está verificado (sin cambios).
    if (user.emailVerified) {
      return { success: true, message: "El email ya había sido verificado." };
    }

    // 4. Modificar la entidad en memoria.
    user.emailVerified = true;
    user.verificationToken = null; // Limpiar el token para invalidarlo.
    user.verificationTokenExpires = null

    // 5. CAMBIO CLAVE: Usar el método 'save' para guardar la entidad actualizada.
    await this.userRepository.save(user);

    return { success: true, message: "Email verificado correctamente." };
  }
}