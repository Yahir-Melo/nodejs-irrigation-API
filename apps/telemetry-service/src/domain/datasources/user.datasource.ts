
import { RegisterUserDto } from '../dtos/auth/register.user.dto.js';
import type { UserEntity } from '../entities/user.entity.js';


export abstract class UserDatasource{
abstract registerUser(registerUserDto:RegisterUserDto):Promise<UserEntity>;

}