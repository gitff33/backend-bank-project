import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

interface JwtPayload {
  sub: string;
  email: string;
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // если токен просрочен сразу сброситься
      secretOrKey: process.env.JWT_SECRET || 'SUPER_SECRET_KEY', // <- Секретный ключ, которым сервер подписал токен!
    });
  }
  // автоматически выполнится когда паспорт успешно проверит токен(подпись)!
  validate(payload: JwtPayload) {
    return { id: payload.sub, email: payload.email };
  }
}
