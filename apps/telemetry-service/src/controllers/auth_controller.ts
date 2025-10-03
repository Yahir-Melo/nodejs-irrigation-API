import type { Request, Response } from "express"
import { RegisterUserDto } from "../domain/dtos/auth/register.user.dto.js";



export class AuthController{

constructor(){}

registerUser = (req:Request,res:Response)=>{
    const [err, registerUserDto]=RegisterUserDto.create(req.body);
    if(err) return res.status(400).json(err)

    
    res.json(registerUserDto);

}

loginUser = (req:Request,res:Response)=>{
    res.json('loginUser');
}

validateEmail = (req:Request,res:Response)=>{
    res.json('validateEmail');
}



}