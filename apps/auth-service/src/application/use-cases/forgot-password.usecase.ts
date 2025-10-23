import crypto from 'crypto'; // Usamos 'crypto' (nativo de Node) para un token de un solo uso. Es más seguro que JWT para esto.
import { UserRepository } from '../../domain/repositories/user.repository.js';
import { EmailService } from '../../presentation/email/email.service.js';
import { CustomError } from '../../domain/errors/custom.error.js';
import { envs } from '../../config/plugins/envs.plugin.js';

export class ForgotPasswordUseCase {

  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService,
  ) {}

  async execute(email: string): Promise<{ message: string }> {
    // 1. Buscar al usuario por email
    const user = await this.userRepository.findByEmail(email);

    // 🚨 ¡IMPORTANTE! Medida de seguridad contra "enumeración de usuarios"
    // Nunca le confirmes al atacante si un email existe o no.
    // Siempre devuelve un mensaje genérico.
    if (!user) {
      return { message: 'Si una cuenta con este correo existe, se enviará un enlace de reseteo.' };
    }

    // 2. Generar un token de reseteo simple y seguro
    const resetToken = crypto.randomBytes(32).toString('hex');
    // Guardamos una versión "hasheada" en la BD. Es más seguro.
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // 3. Establecer la expiración (ej. 15 minutos)
    const expirationDate = new Date(Date.now() + 15 * 60 * 1000);

    // 4. Actualizar la entidad de usuario en memoria
    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = expirationDate;

    // 5. Guardar los cambios en la base de datos
    await this.userRepository.save(user);

    // 6. Crear el enlace y enviar el email
    // ¡IMPORTANTE! Enviamos el token original (resetToken), NO el hasheado.
    const resetLink = `http://localhost:5900/reset-password.html?token=${resetToken}`;
    
    // Deberás crear este nuevo método en tu EmailService
    await this.emailService.sendPasswordResetEmail(
      user.email, 
      resetLink, 
      user.name || 'Usuario'
    );

    // 7. Devolver el mismo mensaje genérico
    return { message: 'Si una cuenta con este correo existe, se enviará un enlace de reseteo.' };
  }
}