import { UserRepository } from '../../domain/repositories/user.repository.js';
import { CustomError } from '../../domain/errors/custom.error.js';
import jwt from 'jsonwebtoken';
import { envs } from '../../config/plugins/envs.plugin.js';

export class LogoutUserUseCase {

  constructor(
    private readonly userRepository: UserRepository
  ) {}

  async execute(refreshToken: string): Promise<{ success: boolean }> {
    try {
      // 1. Verificar el token para asegurarnos de que es válido y obtener el ID
      const payload = jwt.verify(refreshToken, envs.JWT_REFRESH_SECRET || 'refresh_secret') as { id: string };

      // 2. Buscar al usuario por su ID
      const user = await this.userRepository.findById(payload.id);
      if (!user) {
        // Aunque el token sea válido, el usuario podría no existir.
        throw CustomError.unauthorized('Usuario no encontrado');
      }

      // 3. Filtrar la lista de tokens, eliminando el que se usó para logout
      // Esto crea un nuevo array sin el refreshToken específico.
      user.refreshTokens = user.refreshTokens.filter(token => token !== refreshToken);

      // 4. Guardar al usuario con la lista de tokens actualizada
      await this.userRepository.save(user);

      return { success: true };

    } catch (error) {
      // Si el token ya es inválido (expirado, malformado), simplemente lo ignoramos.
      // El resultado deseado (que el token no se pueda usar) ya se cumple.
      // Pero por seguridad, podemos lanzar un error si lo preferimos.
      throw CustomError.unauthorized('Token de refresh inválido o expirado');
    }
  }
}