// src/application/use-cases/register-user.use-case.ts
import { RegisterUserDto } from '../dtos/auth/register.user.dto.js';
import { UserEntity, Role } from '../../domain/entities/user.entity.js';
import { UserRepository } from '../../domain/repositories/user.repository.js';
import { EmailService } from '../../presentation/email/email.service.js';
import { CustomError } from '../../domain/errors/custom.error.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { envs } from '../../config/plugins/envs.plugin.js';


// NUEVO: Definimos un DTO de respuesta para no retornar la entidad completa.
export interface RegisterUserResponseDto {
  id: string;
  name?: string;
  email: string;
  message: string;
}

/**
 * REFACTORIZADO:
 * El Caso de Uso ahora tiene toda la responsabilidad de la lógica de negocio.
 */
export class RegisterUserUseCase {

  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService,
  ) {}

  async execute(dto: RegisterUserDto): Promise<RegisterUserResponseDto> {

    // 1. Validar si el email ya existe usando el repositorio corregido.
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw CustomError.badRequest('El correo electrónico ya está en uso.');
    }

    // 2. Hashear la contraseña (lógica de aplicación).
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    // 3. Generar el token de verificación (lógica de aplicación).
    const verificationToken = jwt.sign({}, envs.JWT_ACCESS_SECRET || 'secret_for_verification', { expiresIn: '1h' });
    const decodedToken: any = jwt.decode(verificationToken);
    const expirationDate = new Date(decodedToken.exp * 1000);

    // 4. Crear la Entidad del Dominio. El caso de uso es responsable de esto.
    const newUserEntity = new UserEntity(
      undefined, // id se genera en la BD
      dto.email,
      hashedPassword,
      new Date(),
      Role.USER,
      false,
      dto.name,
      [],
      new Date(),
      expirationDate,
      verificationToken,
     
    );

    // 5. Usar el método 'save' del repositorio para persistir la entidad.
    const savedUser = await this.userRepository.save(newUserEntity);

    // 6. Enviar el email de verificación usando los datos del "recibo" (savedUser).
    const verificationLink = `http://localhost:5900/api/auth/validate-email/${savedUser.verificationToken}`;
    await this.emailService.sendEmailWithValidateAccount(savedUser.email, verificationLink, savedUser.name || '');

    // 7. Mapear la entidad a un DTO de Respuesta seguro y retornarlo.
    return {
      id: savedUser.id! || '' ,
      name: savedUser.name || '',
      email: savedUser.email || '',
      message: 'Usuario registrado exitosamente. Por favor, revisa tu email para verificar tu cuenta.'
    };
  }
}