import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class CreateCreditDto {
  @ApiProperty({
    description: 'CUID карты для зачисления кредитных средств',
    example: 'clh123abc000008l1g9gh4567',
  })
  @IsString()
  @IsNotEmpty()
  cardId!: string;

  @ApiProperty({
    description: 'Сумма кредита',
    example: 5000,
    minimum: 500,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @Min(500, { message: 'Минимальная сумма кредита - 500' })
  amount!: number;

  @ApiProperty({
    description: 'Процентная ставка (%)',
    example: 12.5,
    minimum: 0.1,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @Min(0.1, { message: 'Минимальная процентная ставка - 0.1%' })
  interestRate!: number;

  @ApiProperty({
    description: 'Срок кредита в месяцах',
    example: 12,
    minimum: 1,
  })
  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  @Min(1, { message: 'Минимальный срок кредита составляет 1 мес.' })
  termMonths!: number;
}
