
import bcrypt from 'bcryptjs';


// application/use-cases/register-user.use-case.ts
import { LoginUserDto } from '../../domain/dtos/auth/login.user.dto.js';
import { UserEntity } from '../../domain/entities/user.entity.js';
import { UserRepository } from '../../domain/repositories/user.repository.js';



export class LoginUserUseCase {

  // Inyectamos la dependencia del Repositorio (no de Prisma directamente)
  constructor(
    private readonly userRepository: UserRepository
  ) {}

  async execute(dto: LoginUserDto): Promise<string> {
    
    // 1. Validar si el email ya existe
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (!existingUser === true ) { 
      throw new Error('Correo electrónico no registrado');
    }

    // 2. Comparar la contraseña

   const verificatePassword = await this.userRepository.verifyUserPassword(dto.password,dto.email);
    if (!verificatePassword) {
    throw new Error('Contraseña incorrecta'); 
      
    }

    const token = await this.userRepository.createTokenUser(dto);


    return token;

  }
}