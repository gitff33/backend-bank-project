import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendVerificationCodeDto {
  @ApiProperty({
    description: 'Email пользователя',
    example: 'user123@gmail.com',
  })
  @IsEmail({}, { message: 'Некорректный формат почты.' })
  @IsNotEmpty({ message: 'Это поле не должно быть пустым.' })
  @IsString()
  email!: string;
}
