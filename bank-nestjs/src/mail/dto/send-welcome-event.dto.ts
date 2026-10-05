import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendWelcomeEventDto {
  @IsEmail({}, { message: 'Некорректный формат почты' })
  @IsNotEmpty({ message: 'Email обязателен для отправки приветствия' })
  email!: string;
}
