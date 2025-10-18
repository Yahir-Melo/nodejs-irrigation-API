// src/application/use-cases/login-user.usecase.ts

import { LoginUserDto } from '../dtos/auth/login.user.dto.js';
import { UserRepository } from '../../domain/repositories/user.repository.js';
import { CustomError } from '../../domain/errors/custom.error.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export interface LoginUserResponseDto {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name?: string;
    email: string;
  };
}

export class LoginUserUseCase {

  constructor(
    private readonly userRepository: UserRepository
  ) {}

  async execute(dto: LoginUserDto): Promise<LoginUserResponseDto> {
    
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) { 
      throw CustomError.unauthorized('Credenciales inválidas.');
    }

    if (!user.emailVerified) { 
      throw CustomError.unauthorized('Correo electrónico no ha sido validado.');
    }

    const isPasswordCorrect = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordCorrect) {
      throw CustomError.unauthorized('Credenciales inválidas.'); 
    }

    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      "access_secret",
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      "refresh_secret_super_segura",
      { expiresIn: "7d" }
    );

    user.refreshTokens.push(refreshToken);
    await this.userRepository.save(user);

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
