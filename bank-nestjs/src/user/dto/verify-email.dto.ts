import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty, Length } from 'class-validator';

export class VerifyEmailDto {
  @ApiProperty({
    description: 'Email пользователя который подтверждает почту.',
    example: 'user123@gmail.com',
  })
  @IsEmail({}, { message: 'Некорректный формат почты.' })
  @IsString()
  @IsNotEmpty({ message: 'Это поле должно быть заполнено.' })
  email!: string;

  @ApiProperty({
    description: 'Код подтверждения, отправленный на почту',
    example: '123456',
  })
  @IsString({ message: 'Код должен быть строкой.' })
  @IsNotEmpty({ message: 'Код подтверждения обязателен.' })
  @Length(6, 6, { message: 'Код должен состоять ровно из 6 символов.' })
  code!: string;
}
