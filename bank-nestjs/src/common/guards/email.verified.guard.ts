import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';

import { PrismaService } from 'src/prisma/prisma.service';

interface JwtPayload {
  sub: string;
  email?: string;
}

interface RequestWithUser extends Request {
  user: JwtPayload;
}
@Injectable()
export class EmailVerifiedGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user; // попадает сюда после JwtAuthGuard!

    if (!user || !user.sub) {
      throw new ForbiddenException('Пользователь не авторизован.');
    }

    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.sub },
      select: { isEmailVerified: true },
    });

    if (!dbUser || !dbUser.isEmailVerified) {
      throw new ForbiddenException(
        'Пожалуйста подтвердите адрес электронной почты для данного действия',
      );
    }

    return true;
  }
}
