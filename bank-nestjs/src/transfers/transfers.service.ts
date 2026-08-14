import { Injectable,NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TransferDto } from './dto/transfer.dto';
import {Prisma} from '@prisma/client';


@Injectable()
export class TransfersService {
    constructor(private readonly prisma:PrismaService){}

    async transfer(senderId:string,dto:TransferDto){
        const {toCardNumber,amount} = dto;

        const TransferAmount = new Prisma.Decimal(amount);

        return await this.prisma.$transaction(async(tx)=>{
            const senderAccount = await tx.account.findFirst({
                where:{
                    userId:senderId
                }
            });
            if(!senderAccount){
                throw new NotFoundException('не удалось найти счет отправителя')
            }
            if(senderAccount.balance.lt(TransferAmount)){
                throw new NotFoundException('Недостаточно средств на счете...')
            }
            const targetCard = await tx.card.findUnique({
                where:{
                    number:toCardNumber
                },
                include:{
                    account:true
                }
            });
            if(!targetCard){
                throw new NotFoundException('номер карты получателя не найден')
            }
            const receiverAccount = targetCard.account
            if(senderAccount.id === receiverAccount.id){
                throw new NotFoundException('Нельзя переводить денежные средства самому себе.')
            }
            await tx.account.update({
                where:{id:senderAccount.id},
                    data:{
                        balance:senderAccount.balance.minus(TransferAmount)
                    }
                
            })
            await tx.account.update({
                where:{id:receiverAccount.id},
                data:{
                    balance:receiverAccount.balance.plus(TransferAmount),
                }
            });
            // запись в истории 
            const transaction = await tx.transaction.create({
                data:{
                    amount:TransferAmount,
                    status:'SUCCESS',
                    fromAccountId:senderAccount.id,
                    toAccountId:receiverAccount.id,
                },
            });
            return transaction
        })

    }

}
