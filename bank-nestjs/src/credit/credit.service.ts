import { Injectable,NotFoundException,ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCreditDto } from './dto/create-credit.dto';


@Injectable()
export class CreditService {
    constructor(private readonly prisma:PrismaService){}
    
    async createCredit(userId:string, dto:CreateCreditDto){
        
        return this.prisma.$transaction(async(tx)=>{

        

        const card = await tx.card.findUnique({
            where:{id:dto.cardId},
            include:{account:true}
            });

            if(!card){
                throw new NotFoundException("Указанная карта не найдена")
            }

            if(card.account.userId !== userId){
                throw new ForbiddenException('Нельзя оформлять кредит на чужую карту.')
            }

            const credit = await tx.credit.create({

                data:{
                    accountId:card.accountId,
                    amount:dto.amount.toString(),
                    interestRate:dto.interestRate.toString(),
                    termMonths:dto.termMonths,
                    status:'PENDING',
                },
            });

            return credit;

            });
        }

    }
