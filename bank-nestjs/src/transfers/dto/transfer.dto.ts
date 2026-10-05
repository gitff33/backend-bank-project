import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsPositive,
  IsCreditCard,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TransferDto {
  @ApiProperty({
    description: 'Номер карты получателя',
    example: '4532015112830366',
  })
  @IsString()
  @IsNotEmpty({ message: 'Номер карты обязателен' })
  @IsCreditCard({ message: 'неверный формат карты.' })
  toCardNumber!: string;

  @ApiProperty({
    description: 'Сумма перевода',
    example: 500,
    minimum: 5,
  })
  @IsNumber({}, { message: 'Сумма должна быть числом' })
  @IsPositive({ message: 'Сумма должна быть больше нуля' })
  @IsNotEmpty()
  @Min(5, { message: 'Минимальная сумма перевода - 5' })
  amount!: number;
}
