import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { UserRepository } from '../../domain/repositories/user.repository.js';
import { CustomError } from '../../domain/errors/custom.error.js';

// DTO para la entrada de este caso de uso
export interface ResetPasswordDto {
  token: string;
  newPassword: string;
}

export class ResetPasswordUseCase {

  constructor(
    private readonly userRepository: UserRepository
  ) {}

  async execute(dto: ResetPasswordDto): Promise<{ message: string }> {
    // 1. Hashear el token que nos llega del cliente (el que venía en la URL)
    const hashedToken = crypto.createHash('sha256').update(dto.token).digest('hex');

    // 2. Buscar al usuario por el token hasheado
    const user = await this.userRepository.findByPasswordResetToken(hashedToken);
    
    // 3. Validar el token y su expiración
    if (!user) {
      throw CustomError.badRequest('Token inválido');
    }
    if (!user.passwordResetExpires || user.passwordResetExpires < new Date()) {
      throw CustomError.badRequest('Token expirado. Por favor, solicita uno nuevo.');
    }

    // 4. Hashear la nueva contraseña (igual que en tu RegisterUseCase)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.newPassword, salt);

    // 5. Actualizar la entidad del usuario
    user.passwordHash = hashedPassword;
    user.passwordResetToken = null; // <-- ¡Limpiamos el token! (Un solo uso)
    user.passwordResetExpires = null;

    // 6. Guardar los cambios
    await this.userRepository.save(user);

    return { message: 'Contraseña actualizada correctamente' };
  
  
  }
}