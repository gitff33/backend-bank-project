import {IsNotEmpty,IsNumber,IsString,IsPositive, IsCreditCard} from 'class-validator'

export class TransferDto{
    @IsString()
    @IsNotEmpty()
    @IsCreditCard({message:'неверный формат карты.'})
    toCardNumber!:string;
    
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    amount!:number;
}