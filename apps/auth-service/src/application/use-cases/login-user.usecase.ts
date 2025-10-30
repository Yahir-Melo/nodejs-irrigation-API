// src/application/use-cases/login-user.usecase.ts

import { LoginUserDto } from '../dtos/auth/login.user.dto.js';
import { UserRepository } from '../../domain/repositories/user.repository.js';
import { CustomError } from '../../domain/errors/custom.error.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { envs } from '../../config/plugins/envs.plugin.js';




// (Opcional pero recomendado) Define el tipo para el usuario
export interface User {
  id: string;
  name?: string;
  email: string;
}

// NUEVO: Define un DTO de respuesta para el login.
// ... (otras importaciones)

// ✅ VERIFICA ESTA INTERFAZ. ¡Este es el punto más importante!
// Asegúrate de que tenga accessToken, refreshToken y user.
export interface LoginUserResponseDto {
  accessToken: string;
  refreshToken: string;
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

    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      envs.JWT_ACCESS_SECRET, // Usa una variable de entorno
      { expiresIn: "15m" } // <-- Dura muy poco
    );

    // 4. Generar el refreshToken de sesión JWT aquí. larga duracion
    const refreshToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      envs.JWT_REFRESH_SECRET ,
      { expiresIn: "7d" }
    );

    // Añadimos el nuevo refreshToken a la lista de tokens del usuario.
    user.refreshTokens.push(refreshToken);
    await this.userRepository.save(user); // Guardamos el usuario actualizado

    // 5. Mapear la entidad a un DTO de respuesta seguro.
    return {
 
        accessToken,
        refreshToken,
    
      user: {
        id: user.id! || '',
        name: user.name || '',
        email: user.email,
      }
    };
  }
}