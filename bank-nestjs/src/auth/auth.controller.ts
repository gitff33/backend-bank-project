import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Регистрация пользователя',
    description:
      'Создает новый аккаунт пользователя и возвращает JWT-токен для доступа.',
  })
  @ApiResponse({
    status: 201,
    description: 'Пользователь успешно зарегистрирован, возвращен JWT-токен',
  })
  @ApiResponse({
    status: 400,
    description: 'Некорректные входные данные (ошибка валидации DTO)',
  })
  @ApiResponse({
    status: 409,
    description: 'Пользователь с таким Email уже существует.',
  })
  register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }
  @Post('login')
  @ApiOperation({
    summary: 'Авторизация пользователя (вход в систему)',
    description: 'Проверяет учетные данные и выдает JWT-токен для аунтефикации',
  })
  @ApiResponse({
    status: 200,
    description: 'Успешный вход, возвращен JWT-токен',
  })
  @ApiResponse({
    status: 400,
    description: 'Некорректные входные данные (dto) ',
  })
  @ApiResponse({ status: 401, description: 'Неверный email или пароль' })
  login(@Body() dto: LoginUserDto) {
    return this.authService.login(dto);
  }
}
