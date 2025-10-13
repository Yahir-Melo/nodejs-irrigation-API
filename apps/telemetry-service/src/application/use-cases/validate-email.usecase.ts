import { CustomError } from "../../domain/errors/custom.error.js";
import type { UserRepository } from "../../domain/repositories/user.repository.js";

// Interfaz para la entrada del caso de uso
export interface ValidateEmailUseCaseInput {
  token: string;
}

// Interfaz para la salida del caso de uso
export interface ValidateEmailUseCaseOutput {
  success: boolean;
  message: string;
}

export class ValidateEmailUseCase {
  
  constructor(
    // Inyectamos el repositorio para poder hablar con la base de datos
    private readonly userRepository: UserRepository 
  ) {}

  async execute(input: ValidateEmailUseCaseInput): Promise<ValidateEmailUseCaseOutput> {
    
    // 1. Buscar al usuario por el token de verificación usando el repositorio
    const user = await this.userRepository.findVerificationToken(input.token);

    // 2. Si no se encuentra un usuario, el token es inválido
    if (!user) {
      throw CustomError.badRequest("Token de verificación inválido.");
    }

    // 3. Opcional pero recomendado: verificar si el token ha expirado
    if (!user.verificationTokenExpires || user.verificationTokenExpires < new Date()) {
      throw CustomError.badRequest("El token de verificación ha expirado. Por favor, solicita uno nuevo.");
    }
    
    // 4. Si el usuario ya está verificado, no hacemos nada más
    if (user.emailVerified) {
      return { success: true, message: "El email ya había sido verificado." };
    }

    // 5. Si todo está en orden, actualizamos al usuario
    await this.userRepository.verifyEmail(user.id);

    return { success: true, message: "Email verificado correctamente." };
  }
}