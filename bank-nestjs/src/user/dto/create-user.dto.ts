import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
export class CreateUserDto {
  @ApiProperty({
    description: 'Электронная почта пользователя',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'неккоректный формат почты...' })
  @IsNotEmpty({ message: 'Email не должен быть пустым!' })
  email!: string;

  @ApiProperty({
    description: 'Пароль пользователя (от 8 символов)',
    example: 'Lockpassword123',
    minLength: 8,
  })
  @IsString()
  @MinLength(8, { message: 'Длина пароля должна быть не меньше 8 символов!' })
  password!: string;

  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Mike',
    minLength: 2,
  })
  @IsString()
  @MinLength(2, { message: 'Минимальная длина имени - 2 символа' })
  @IsNotEmpty({ message: 'Имя должно быть обязательно заполнено.' })
  FirstName!: string;

  @ApiProperty({
    description: 'Фамилия пользователя',
    example: 'Ratford',
    minLength: 2,
  })
  @IsString()
  @MinLength(2, { message: 'Минимальная длина фамилии - 2 символа' })
  @IsNotEmpty({ message: 'Фамилия должна быть обязательно заполнена.' })
  LastName!: string;
}
