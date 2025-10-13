
import type { LoginUserDto } from '../dtos/auth/login.user.dto.js';
import { RegisterUserDto } from '../dtos/auth/register.user.dto.js';
import { UserEntity } from '../entities/user.entity.js';


export abstract class UserRepository{

abstract registerUser(registerUserDto:RegisterUserDto):Promise<UserEntity>;
abstract findByEmail(email: string): Promise<boolean>;

abstract createTokenUser(loginUserDto:LoginUserDto):Promise<string>;
abstract verifyUserPassword(passwordTocheck: string,email:string): Promise<boolean>;

abstract findVerificationToken(token:string):Promise<UserEntity | null>
abstract verifyEmail(userId:string):Promise<UserEntity>
abstract checkVerifyEmail(userId:string):Promise<boolean>

}