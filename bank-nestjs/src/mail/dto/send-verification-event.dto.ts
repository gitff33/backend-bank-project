import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SendVerificationCodeEvent {
  @IsEmail({}, { message: 'Некорректный формат почты.' })
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  code!: string;
}
