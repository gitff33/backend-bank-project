import {IsNotEmpty,IsNumber,IsString,IsPositive,Min} from 'class-validator'

export class CreateCreditDto{
    @IsString()
    @IsNotEmpty()
    cardId!:string;

    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    amount!:number;


    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    interestRate!:string;


    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    termMonths!:number;




}