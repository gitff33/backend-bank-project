import { CacheInterceptor, CACHE_MANAGER } from '@nestjs/cache-manager';
import { ExecutionContext, Injectable, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request as ExpressRequest } from 'express';
@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
  constructor(@Inject(CACHE_MANAGER) cacheManager: any, reflector: Reflector) {
    super(cacheManager, reflector);
  }

  trackBy(context: ExecutionContext): string | undefined {
    const request = context
      .switchToHttp()
      .getRequest<ExpressRequest & { user?: { id: string } }>();

    if (request.method !== 'GET') {
      return undefined;
    }

    const userId = request.user?.id;
    const url = String(request.originalUrl || request.url);

    // Уникальный ключ! у каждого юзера свой отдельный кеш.
    if (userId) {
      return `${url}:user_${userId}`;
    }
    return url;
  }
}
