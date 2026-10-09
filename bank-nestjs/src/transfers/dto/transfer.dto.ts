import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsPositive,
  Min,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TransferDto {
  @ApiProperty({
    description: 'Номер карты получателя',
    example: '4532015112830366',
  })
  @IsString()
  @IsNotEmpty({ message: 'Номер карты обязателен' })
  @Matches(/^\d{16}$/, {
    message: 'Номер карты должен состоять строго из 16 цифр.',
  })
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
