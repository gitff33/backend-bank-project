import { Controller,Post,Body,Req, UseGuards,UsePipes,ValidationPipe, UseInterceptors } from '@nestjs/common';
import { TransferDto } from './dto/transfer.dto';
import { TransfersService } from './transfers.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ClearCacheInterceptor } from 'src/common/interceptors/clear-cache.interceptor';
import { InvalidateCache } from 'src/common/decorators/invalidate-cache.decorator';



@Controller('transfers')
@UseInterceptors(ClearCacheInterceptor)
@UseGuards(AuthGuard('jwt'))
export class TransfersController {
    constructor(private readonly transfersService:TransfersService){}
    @Post('transfer')
    @InvalidateCache('/analytics/summary','/user/profile','/user/total')
    async makeTransfer(
        @CurrentUser('id') senderId:string,
        @Body() transferDto:TransferDto,
    ) {
        return this.transfersService.transfer(senderId,transferDto)
    }
}
