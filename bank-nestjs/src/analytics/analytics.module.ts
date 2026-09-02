import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { Reflector } from '@nestjs/core';
@Module({
  imports: [PrismaModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsService, Reflector],
})
export class AnalyticsModule {}
