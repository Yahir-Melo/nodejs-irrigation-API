
import { regularExps } from '../../../config/index.js'

export class LoginUserDto{

 private constructor(

    
    public email:string,
    public password:string,

  

 ){}

 static create(object:{[key:string]:any}):[string?,LoginUserDto?]{

  const{email,password}=object;
  const emailEnMinusculas = email.toLowerCase(email);
  if(!email) return ['Missing email'];
  if(!password) return ['Missing password'];
  if(!regularExps.email.test(email)) return ['Invalid email'];
  if(password.length<6) return ['Password must be at least 6 characters'];
  
  return [,new LoginUserDto(emailEnMinusculas,password)];

     
  
  
 }

}