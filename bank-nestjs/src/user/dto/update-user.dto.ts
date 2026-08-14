import {IsNotEmpty,IsOptional,IsString} from 'class-validator'
export class UpdateUserDto{
    @IsString()
    @IsNotEmpty({message:'имя обязательно для заполнения!'})
    @IsOptional()
    FirstName?:string

    @IsString()
    @IsNotEmpty({message:'фамилия обязательна для заполнения'})
    @IsOptional()
    LastName?:string;
}