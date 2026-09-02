import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
export class LoginUserDto {
  @ApiProperty({
    description: 'Email пользователя',
    example: 'user123@gmail.com',
  })
  @IsEmail({}, { message: 'неккоректный формат почты' })
  @IsNotEmpty({ message: 'email не должен быть пустым' })
  email!: string;

  @ApiProperty({
    description: 'Пароль пользователя',
    example: 'superPassword123',
    minLength: 8,
  })
  @IsString()
  @MinLength(8, { message: 'пароль должен быть не менее 8 символов' })
  password!: string;
}
