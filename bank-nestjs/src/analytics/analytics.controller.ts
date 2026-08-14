import { Controller,Get,Req,UseGuards, UseInterceptors } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { HttpCacheInterceptor } from 'src/common/interceptors/http-cache.interceptor';
@Controller('analytics')
@UseInterceptors(HttpCacheInterceptor)
@UseGuards(AuthGuard('jwt'))
export class AnalyticsController {

    constructor(private readonly analyticsService:AnalyticsService){}

    @Get('summary')
    async getSummary(@CurrentUser('id')userId:string){
        return this.analyticsService.getSummary(userId);
    }
}
