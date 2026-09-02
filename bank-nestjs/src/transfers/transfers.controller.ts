import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  Get,
} from '@nestjs/common';
import { TransferDto } from './dto/transfer.dto';
import { TransfersService } from './transfers.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ClearCacheInterceptor } from 'src/common/interceptors/clear-cache.interceptor';
import { InvalidateCache } from 'src/common/decorators/invalidate-cache.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('transfers')
@UseInterceptors(ClearCacheInterceptor)
@UseGuards(AuthGuard('jwt'))
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Перевод денежных средств пользователям' })
  @ApiResponse({ status: 201, description: 'Перевод успешно проведен' })
  @ApiResponse({ status: 401, description: 'Неавторизован' })
  @ApiResponse({
    status: 404,
    description: 'Счет получателя или отправителя не найден',
  })
  @Post('transfer')
  @InvalidateCache(
    '/analytics/summary',
    '/user/profile',
    '/user/total',
    '/transfers/history',
  )
  async makeTransfer(
    @CurrentUser('id') senderId: string,
    @Body() transferDto: TransferDto,
  ) {
    return this.transfersService.transfer(senderId, transferDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Просмотр истории переводов' })
  @ApiResponse({
    status: 201,
    description: 'История переводов успешно отображена.',
  })
  @ApiResponse({ status: 401, description: 'Неавторизован.' })
  @Get('history')
  async getTransferHistory(@CurrentUser('id') userId: string) {
    return this.transfersService.getHistory(userId);
  }
}
