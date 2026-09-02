import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { TransfersModule } from './transfers/transfers.module';
import { CreditModule } from './credit/credit.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: 'localhost',
            port: 6379,
          },
          ttl: 60 * 1000,
        }),
      }),
    }),

    UserModule,
    PrismaModule,
    TransfersModule,
    AuthModule,
    AnalyticsModule,
    CreditModule,
  ],
  providers: [],
})
export class AppModule {}
