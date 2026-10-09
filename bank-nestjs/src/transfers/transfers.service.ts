import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TransferDto } from './dto/transfer.dto';
import { Prisma } from '@prisma/client';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class TransfersService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('MAIL-SERVICE') private readonly mailClient: ClientProxy,
  ) {}

  private generateTransactionReference(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = new String(date.getDate()).padStart(2, '0');

    const randomSuffix = Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase();

    return `TXN-${year}${month}${day}-${randomSuffix}`;
  }

  async transfer(senderId: string, dto: TransferDto) {
    const { toCardNumber, amount } = dto;

    const TransferAmount = new Prisma.Decimal(amount);
    const commission = this.сalculateCommission(TransferAmount);
    const totalDeduction = TransferAmount.plus(commission);

    const { transaction, senderEmail, senderName, receiverName } =
      await this.prisma.$transaction(async (tx) => {
        const senderAccount = await tx.account.findFirst({
          where: { userId: senderId },
          include: { user: true },
        });
        if (!senderAccount) {
          throw new NotFoundException('не удалось найти счет отправителя');
        }
        if (senderAccount.balance.lt(totalDeduction)) {
          throw new BadRequestException(
            'Недостаточно средств с учетом комиссии (3%)',
          );
        }
        const targetCard = await tx.card.findUnique({
          where: {
            number: toCardNumber,
          },
          include: {
            account: {
              include: { user: true },
            },
          },
        });
        if (!targetCard) {
          throw new NotFoundException('номер карты получателя не найден');
        }
        const receiverAccount = targetCard.account;
        if (senderAccount.id === receiverAccount.id) {
          throw new NotFoundException(
            'Нельзя переводить денежные средства самому себе.',
          );
        }
        await tx.account.update({
          where: { id: senderAccount.id },
          data: {
            balance: senderAccount.balance.minus(totalDeduction),
          },
        });
        await tx.account.update({
          where: { id: receiverAccount.id },
          data: {
            balance: receiverAccount.balance.plus(TransferAmount),
          },
        });

        const referenceNumber = this.generateTransactionReference();
        // запись в истории
        const newTransaction = await tx.transaction.create({
          data: {
            reference: referenceNumber,
            amount: TransferAmount,
            commission: commission,
            status: 'SUCCESS',
            fromAccountId: senderAccount.id,
            toAccountId: receiverAccount.id,
          },
        });

        const sName = `${senderAccount.user.LastName} ${senderAccount.user.FirstName[0]}.`;
        const rName = `${receiverAccount.user.LastName} ${receiverAccount.user.FirstName[0]}.`;

        return {
          reference: referenceNumber,
          transaction: newTransaction,
          senderEmail: senderAccount.user.email,
          senderName: sName,
          receiverName: rName,
        };
      });

    console.log('Отправка события в RabbitMQ', {
      transactionId: transaction.id,
      to: senderEmail,
    });

    this.mailClient.emit('transfer.completed', {
      reference: transaction.reference,
      status: transaction.status,
      senderId,
      senderName,
      receiverName,
      to: senderEmail,
      amount: TransferAmount.toNumber(),
      commission: commission.toNumber(),
      totalDeduction: totalDeduction.toNumber(),
      createdAt: transaction.createdAt,
    });

    return {
      message:
        'Перевод успешно выполнен. Чек c более подробной информацией отправлен на вашу электронную почту.',
      reference: transaction.reference,
      amount: transaction.amount,
      commission: transaction.commission,
      status: transaction.status,
      createdAt: transaction.createdAt,
    };
  }
  async getHistory(userId: string) {
    const userAccount = await this.prisma.account.findFirst({
      where: { userId },
    });

    if (!userAccount) return [];

    return await this.prisma.transaction.findMany({
      where: {
        OR: [
          { fromAccountId: userAccount.id },

          { toAccountId: userAccount.id },
        ],
      },

      orderBy: {
        createdAt: 'desc',
      },

      select: {
        id: true,

        amount: true,

        commission: true,

        status: true,

        createdAt: true,

        fromAccount: {
          select: {
            id: true,

            user: {
              select: {
                email: true,

                FirstName: true,

                LastName: true,
              },
            },
          },
        },
      },
    });
  }

  private сalculateCommission(amount: Prisma.Decimal): Prisma.Decimal {
    const COMMISSION_RATE = new Prisma.Decimal(0.03);
    return amount.mul(COMMISSION_RATE);
  }
}
