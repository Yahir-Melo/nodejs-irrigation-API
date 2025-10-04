import type { Request, Response } from "express"
import { RegisterUserDto } from "../domain/dtos/auth/register.user.dto.js";
import type { RegisterUserUseCase } from "../domain/use-cases/auth/register-user.use-case.js";



export class AuthController{

constructor( private registerUserUseCase: RegisterUserUseCase){}

register = (req: Request, res: Response) => {
    
    console.log('--- AuthController: Register method reached ---');
    console.log('Request Body:', req.body);

    // 1. Validar la entrada usando el DTO
    const [error, registerUserDto] = RegisterUserDto.create(req.body);
    if (error) {
      console.log('DTO validation error:', error);
      return res.status(400).json({ message: error });
    }

    console.log('DTO created successfully. Executing use case...');
    // 2. Llama al Caso de Uso y maneja la respuesta con .then() y .catch()
    this.registerUserUseCase.execute(registerUserDto!)
      .then(newUser => {
        console.log('Use case executed successfully. Sending response.');
        // Preparamos una respuesta segura (¡NUNCA devuelvas el passwordHash!)
        const responseUser = {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.Role,
          createdAt: newUser.createdAt
        };
        res.status(201).json(responseUser);
      })
      .catch(error => {
        console.error('--- ERROR in Use Case Execution ---', error); 

        if (error instanceof Error && error.message.includes('en uso')) {
          return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: 'Error interno del servidor' });
      });
  }



loginUser = (req:Request,res:Response)=>{
    res.json('loginUser');
}

validateEmail = (req:Request,res:Response)=>{
    res.json('validateEmail');
}



}