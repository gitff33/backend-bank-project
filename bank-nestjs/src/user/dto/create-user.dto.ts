import {IsEmail,IsNotEmpty,IsString,MinLength} from 'class-validator'
export class CreateUserDto {
    @IsEmail({},{message:'неккоректный формат почты...'})
    @IsNotEmpty({message:'Email не должен быть пустым!'})
    email!:string;

    @IsString()
    @MinLength(8,{message:"Длина пароля должна быть не меньше 8 символов!"})
    password!:string;


    @IsString()
    @IsNotEmpty({message:'Имя должно быть обязательно заполнено.'})
    FirstName?: string;

    @IsString()
    @IsNotEmpty({message:'Фамилия должна быть обязательно заполнена.'})
    LastName?:string;
}
