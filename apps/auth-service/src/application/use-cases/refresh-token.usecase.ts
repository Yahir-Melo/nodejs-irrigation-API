import { UserRepository } from '../../domain/repositories/user.repository.js';
import { CustomError } from '../../domain/errors/custom.error.js';
import jwt from 'jsonwebtoken';
import { envs } from '../../config/plugins/envs.plugin.js';

// Esta lógica se encarga de recibir una "foto" (refreshToken) y entregar un "pase diario" nuevo.
export class RefreshTokenUseCase {

  constructor(
    private readonly userRepository: UserRepository
  ) {}

  async execute(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      // 1. Verificamos que la "foto" (refreshToken) sea real y no falsa.
      const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || "refresh_secret_super_segura") as { id: string };

      // 2. Buscamos al usuario dueño de esa foto.
      const user = await this.userRepository.findById(payload.id);
      if (!user) throw CustomError.unauthorized('Token inválido');

      // 3. Revisamos en nuestro archivero si esa "foto" sigue siendo válida.
      if (!user.refreshTokens.includes(refreshToken)) {
        throw CustomError.unauthorized('Token inválido o revocado');
      }

      // 4. Si todo está en orden, generamos un NUEVO pase diario.
      const newAccessToken = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        envs.JWT_ACCESS_SECRET || "access_secret",
        { expiresIn: "15m" }
      );

      return { accessToken: newAccessToken };

    } catch (error) {
      throw CustomError.unauthorized('Refresh Token inválido o expirado');
    }
  }
}