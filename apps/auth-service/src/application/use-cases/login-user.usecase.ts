// src/application/use-cases/login-user.usecase.ts

import { LoginUserDto } from '../dtos/auth/login.user.dto.js';
import { UserRepository } from '../../domain/repositories/user.repository.js';
import { CustomError } from '../../domain/errors/custom.error.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// NUEVO: Define un DTO de respuesta para el login.
export interface LoginUserResponseDto {
  token: string;
  user: {
    id: string;
    name?: string;
    email: string;
  };
}

/**
 * REFACTORIZADO:
 * El Caso de Uso ahora es responsable de la lógica de autenticación.
 */
export class LoginUserUseCase {

  constructor(
    private readonly userRepository: UserRepository
  ) {}

  async execute(dto: LoginUserDto): Promise<LoginUserResponseDto> {
    
    // 1. Buscar al usuario por su email usando el repositorio limpio.
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) { 
      throw CustomError.unauthorized('Credenciales inválidas.'); // Error genérico por seguridad
    }

    // 2. Verificar si el correo está verificado directamente en la entidad.
    if (!user.emailVerified) { 
      throw CustomError.unauthorized('Correo electrónico no ha sido validado.');
    }

    // 3. Comparar la contraseña aquí, en el caso de uso.
    const isPasswordCorrect = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordCorrect) {
      throw CustomError.unauthorized('Credenciales inválidas.'); 
    }

    // 4. Generar el token de sesión JWT aquí.
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "mi_clave_super_segura",
      { expiresIn: "7d" }
    );

    // 5. Mapear la entidad a un DTO de respuesta seguro.
    return {
      token,
      user: {
        id: user.id! || '',
        name: user.name || '',
        email: user.email,
      }
    };
  }
}