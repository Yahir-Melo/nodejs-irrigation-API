


enum Role{
    USER,
    ADMIN,
}
export class UserEntity{

  constructor(
    public id: string,
    public email:string,
    public passwordHash:string,
    public createdAt: Date,
    public Role:Role,
    public verificatedEmail:boolean,
    public updatedAt?:Date | null,
    public name?:string |'User' 
  
){}


}