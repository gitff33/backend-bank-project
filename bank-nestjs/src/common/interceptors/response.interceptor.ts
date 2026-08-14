import { Injectable,NestInterceptor,ExecutionContext,CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";


export interface Response<T>{
    statusCode:number;
    executionTime:string;
    data:T
}

@Injectable()
export class ResponseInterceptor<T>
    implements NestInterceptor<T,Response<T>>
    {
        intercept(context: ExecutionContext, next: CallHandler<T>): Observable<Response<T>> {
                const startTime = Date.now();
                const statusCode = context.switchToHttp().getResponse().statusCode;

                return next.handle().pipe(
                    map((data)=>({
                        statusCode,
                        executionTime:`${Date.now() - startTime}ms`,
                        data,
                    })),
                )
            }
    }