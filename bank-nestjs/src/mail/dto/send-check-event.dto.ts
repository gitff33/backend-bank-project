import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SendCheckReceiptDto {
  @IsString()
  @IsNotEmpty()
  reference!: string;

  @IsString()
  @IsNotEmpty()
  status!: string;

  @IsString()
  @IsNotEmpty()
  senderName!: string;

  @IsString()
  @IsNotEmpty()
  receiverName!: string;

  @IsString()
  @IsNotEmpty()
  senderId!: string;

  @IsEmail()
  to!: string;

  @IsNumber()
  amount!: number;

  @IsNumber()
  commission!: number;

  @IsNumber()
  totalDeduction!: number;

  @Type(() => Date)
  @IsDate()
  createdAt!: Date;
}
