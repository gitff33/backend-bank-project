import {
  Controller,
  UseGuards,
  Post,
  Body,
  UseInterceptors,
} from '@nestjs/common';
import { CreditService } from './credit.service';
import { CreateCreditDto } from './dto/create-credit.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ClearCacheInterceptor } from 'src/common/interceptors/clear-cache.interceptor';
import { InvalidateCache } from 'src/common/decorators/invalidate-cache.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('credit')
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(ClearCacheInterceptor)
export class CreditController {
  constructor(private readonly creditService: CreditService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Оформление кредита' })
  @ApiResponse({ status: 201, description: 'Кредит успешно оформлен.' })
  @ApiResponse({ status: 401, description: 'Ошибка. Неавторизован.' })
  @Post('apply')
  @InvalidateCache('/analytics/summary', '/user/profile')
  async applyForCredit(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateCreditDto,
  ) {
    return this.creditService.createCredit(userId, dto);
  }
}
