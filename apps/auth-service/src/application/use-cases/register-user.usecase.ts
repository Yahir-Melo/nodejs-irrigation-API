

// application/use-cases/register-user.use-case.ts
import { RegisterUserDto } from '../../domain/dtos/auth/register.user.dto.js';
import { UserEntity } from '../../domain/entities/user.entity.js';
import { UserRepository } from '../../domain/repositories/user.repository.js';
import bcrypt from 'bcryptjs';
import { EmailService } from '../../presentation/email/email.service.js';

export class RegisterUserUseCase {

  // Inyectamos la dependencia del Repositorio (no de Prisma directamente)
  constructor(

    private readonly userRepository: UserRepository

  ) {}

  async execute(dto: RegisterUserDto): Promise<UserEntity> {
    
    // 1. Validar si el email ya existe
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser === true ) { 
      throw new Error('El correo electrónico ya está en uso.');
    }

    // 2. Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);
    
    // sobreescribimos el dto para no crear uno nuevo
    dto.password = hashedPassword;

    // 3. Usar el método 'registerUser' del repositorio
    // El repositorio se encargará de crear y guardar la entidad
    const newUser = await this.userRepository.registerUser(dto);

    const verificationLink = `http://localhost:5900/api/auth/validate-email/${newUser.verificationToken}`;
    

    const emailService =new EmailService();
    await emailService.sendEmailWithValidateAccount(newUser.email, verificationLink,newUser.name || '');


    return newUser;
    
  }
}