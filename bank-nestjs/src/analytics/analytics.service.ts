import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AnalyticsService {
    constructor(private readonly prisma:PrismaService){}

    async getSummary(userId:string){


        // аккаунт и текущий баланс
        const account = await this.prisma.account.findUnique({
            where:{userId},
            select:{
                balance:true,
                currency:true,
            },
        });

        // количество карт юзера
        const totalCards = await this.prisma.card.count({
            where:{
                account:{
                    userId,
                },
            },
        });

        // кол-во кредитов пользователя
        const totalCredits = await this.prisma.credit.count({
            where:{
                account:{
                    userId:userId,
                },
            },
        });
        
        // общая сумма кредитов юзера(агрегация)
        const creditStats = await this.prisma.credit.aggregate({
            where:{
                account:{
                    userId:userId
                },
            },
            _sum:{amount:true},
            _avg:{amount:true},
        });

        // общее кол-во отпправленных переводов юзера
        const totalSentTransactions = await this.prisma.transaction.count({
            where:{
                fromAccount:{
                    userId:userId
                },
            },
        });


        // общая сумма отправленных переводов юзера
        const sentStats = await this.prisma.transaction.aggregate({
            where:{
                fromAccount:{
                    userId:userId,
                },
                status:'SUCCESS',
            },
            _sum:{amount:true}
        });

            return{
                accounts:{
                    currentBalance:account?.balance ? account.balance.toNumber() : 0,
                    currency:account?.currency || 'RUB',
                    totalCards,
                },
                credits:{
                    totalCount:totalCredits,
                    totalAmount:creditStats._sum.amount ? creditStats._sum.amount.toNumber() : 0,
                    averageAmount:creditStats._avg.amount ? creditStats._avg.amount.toNumber() : 0,
                },
                transactions:{
                    totalSentTransactions:totalSentTransactions,
                    totalSentAmount:sentStats._sum.amount ? sentStats._sum.amount.toNumber() : 0
                },
                };
            }



    }


