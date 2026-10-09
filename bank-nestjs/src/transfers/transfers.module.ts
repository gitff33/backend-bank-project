import { Module } from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TransfersController } from './transfers.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
@Module({
  imports: [
    PrismaModule,
    ClientsModule.register([
      {
        name: 'MAIL-SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: 'mail-queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  providers: [TransfersService],
  controllers: [TransfersController],
})
export class TransfersModule {}
