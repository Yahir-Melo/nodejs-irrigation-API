

// application/use-cases/register-user.use-case.ts
import { RegisterUserDto } from '../../dtos/auth/register.user.dto.js';
import { UserEntity } from '../../entities/user.entity.js';
import { UserRepository } from '../../datasources/repositories/user.repository.js';
import bcrypt from 'bcryptjs';

export class RegisterUserUseCase {

  // Inyectamos la dependencia del Repositorio (no de Prisma directamente)
  constructor(
    private readonly userRepository: UserRepository
  ) {}

  async execute(dto: RegisterUserDto): Promise<UserEntity> {
    
    // 1. Validar si el email ya existe
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) { 
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

    return newUser;
  }
}