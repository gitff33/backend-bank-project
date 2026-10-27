import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { HttpCacheInterceptor } from 'src/common/interceptors/http-cache.interceptor';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EmailVerifiedGuard } from 'src/common/guards/email.verified.guard';
@Controller('analytics')
@UseInterceptors(HttpCacheInterceptor)
@UseGuards(AuthGuard('jwt'), EmailVerifiedGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('summary')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Общая аналитика всех данных пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Сводные данные аналитики успешно получены.',
  })
  @ApiResponse({ status: 401, description: 'Неавторизован' })
  async getSummary(@CurrentUser('id') userId: string) {
    return this.analyticsService.getSummary(userId);
  }
}
