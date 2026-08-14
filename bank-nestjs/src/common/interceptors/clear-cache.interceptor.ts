import { Injectable,NestInterceptor,ExecutionContext,CallHandler,Inject} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { CACHE_MANAGER,Cache} from "@nestjs/cache-manager";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { INVALIDATE_CACHE_KEY } from "../decorators/invalidate-cache.decorator";

@Injectable()
export class ClearCacheInterceptor implements NestInterceptor{
    constructor(
        @Inject(CACHE_MANAGER) private readonly cacheManager:Cache,
        private readonly reflector:Reflector,
    ) {}

    intercept(context:ExecutionContext,next:CallHandler):Observable<any>{
        const routes = this.reflector.get<string[]>(
            INVALIDATE_CACHE_KEY,
            context.getHandler(),
        );
        return next.handle().pipe(
            tap(async() =>{
                if(!routes || routes.length === 0) return;

                const request = context.switchToHttp().getRequest();
                const userId = request.user?.id;

                for(const route of routes){
                    const cacheKey = userId ? `${route}:user_${userId}` : route;
                    await this.cacheManager.del(cacheKey);
                }



            })
        )
    }
}