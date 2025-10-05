
import { RegisterUserDto } from '../dtos/auth/register.user.dto.js';
import { UserEntity } from '../entities/user.entity.js';


export abstract class UserRepository{
abstract registerUser(registerUserDto:RegisterUserDto):Promise<UserEntity>;
abstract findByEmail(email: string): Promise<UserEntity | null>;
}