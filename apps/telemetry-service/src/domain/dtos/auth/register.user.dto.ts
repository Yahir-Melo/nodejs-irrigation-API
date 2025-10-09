
import { regularExps } from '../../../config/index.js'

export class RegisterUserDto{

 private constructor(

    public name:string,
    public email:string,
    public password:string,

  

 ){}

 static create(object:{[key:string]:any}):[string?,RegisterUserDto?]{

  const{name,email,password}=object;
  const emailEnMinusculas = email.toLowerCase(email);

  if(!name) return ['Missing name'];
  if(!emailEnMinusculas) return ['Missing email'];
  if(!password) return ['Missing password'];
  if(!regularExps.email.test(email)) return ['Invalid email'];
  if(password.length<6) return ['Password must be at least 6 characters'];
  
  return [,new RegisterUserDto(name,emailEnMinusculas,password)];

     
  
  
 }

}