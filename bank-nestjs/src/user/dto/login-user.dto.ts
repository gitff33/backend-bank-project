import {IsEmail,IsNotEmpty,IsString,MinLength} from 'class-validator'
export class LoginUserDto{
    @IsEmail({},{message:'неккоректный формат почты'})
    @IsNotEmpty({message:'email не должен быть пустым'})
    email!:string;

    @IsString()
    @MinLength(8,{message:'пароль должен быть не менее 8 символов'})
    password!:string;
}