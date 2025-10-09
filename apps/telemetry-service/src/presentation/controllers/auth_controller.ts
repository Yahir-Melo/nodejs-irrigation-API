import type { Request, Response } from "express"
import { RegisterUserUseCase } from "../../application/use-cases/register-user.usecase.js";
import { RegisterUserDto } from "../../domain/dtos/auth/register.user.dto.js";
import { LoginUserDto } from "../../domain/dtos/auth/login.user.dto.js";
import { LoginUserUseCase } from "../../application/use-cases/login-user.usecase.js";


export class AuthController{
  
 
  //TODO implementar un borrado de correos no verificados y tambien la verificacionde los correos 
  //TODO 
  


constructor(
  private readonly registerUserUseCase: RegisterUserUseCase,
  private readonly loginUserUseCase: LoginUserUseCase
){}

registerUser = async (req: Request, res: Response) => {
  // 1️⃣ Validar entrada y crear DTO
  const [err, registerUserDto] = RegisterUserDto.create(req.body);
  if (err) return res.status(400).json({ error: err });

  // Asegurarse de que registerUserDto no sea undefined
  if (!registerUserDto) return res.status(400).json({ error: "Invalid registration data" });

  try {
    // 2️⃣ Ejecutar el caso de uso
    await this.registerUserUseCase.execute(registerUserDto);

    // 3️⃣ Retornar respuesta al cliente
    return res.status(201).json({
      message: "Usuario registrado correctamente"
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({
        message: "Error al registrar usuario",
        error: error.message
      });
    }
    return res.status(500).json({
      message: "Error al registrar usuario",
      
    });
  }
};


 

  
  loginUser =async (req:Request,res:Response)=>{
  

  const [err, loginUserUseCase] = LoginUserDto.create(req.body);
  if (err) return res.status(400).json({ error: err });


  // Asegurarse de que registerUserDto no sea undefined
  if (!loginUserUseCase) return res.status(400).json({ error: "Invalid registration data" });
   
  try{
    const tokenEntity = await this.loginUserUseCase.execute(loginUserUseCase);

    return res.status(200).json({
      message: "Usuario verificado Token Generado",
      token: tokenEntity
    });


  }catch(error:unknown){

    if (error instanceof Error) {
      return res.status(500).json({
        message: "Error al registrar usuario",
        error: error.message
      });
    }
    return res.status(500).json({
      message: "Error al registrar usuario",
      
    });
  }
};



  validateEmail =async (req:Request,res:Response)=>{

  }

}
