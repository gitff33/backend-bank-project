import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { ClearCacheInterceptor } from 'src/common/interceptors/clear-cache.interceptor';
import { InvalidateCache } from 'src/common/decorators/invalidate-cache.decorator';
import { SendVerificationCodeDto } from './dto/send-verification-code.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
@ApiTags('Пользователи')
@Controller('user')
@UseInterceptors(ClearCacheInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @ApiResponse({ status: 201, description: 'Пользователь успешно создан.' })
  @ApiResponse({
    status: 401,
    description: 'Некорректные данные или Email занят.',
  })
  @Post('create')
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Авторизация пользователя' })
  @ApiResponse({
    status: 201,
    description: 'Успешная авторизация, вход выполнен',
  })
  @ApiResponse({ status: 401, description: 'Неверный Email или пароль' })
  @Post('login')
  async login(@Body() dto: LoginUserDto) {
    return await this.userService.login(dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Запрос кода подтверждения Email' })
  @ApiResponse({ status: 200, description: 'Код успешно отправлен.' })
  @ApiResponse({
    status: 400,
    description: 'Некорректный email или пользователь не найден',
  })
  @ApiResponse({ status: 401, description: 'Неавторизован' })
  @UseGuards(AuthGuard('jwt'))
  @Post('send-verification')
  @HttpCode(HttpStatus.OK)
  async SendVerificationCodeDto(@Body() dto: SendVerificationCodeDto) {
    return this.userService.sendVerificationCode(dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Подтверждение Email с помощью кода' })
  @ApiResponse({ status: 200, description: 'Email успешно подтвержден' })
  @ApiResponse({ status: 400, description: 'Неверный или истекший код' })
  @ApiResponse({ status: 401, description: 'Неавторизован' })
  @UseGuards(AuthGuard('jwt'))
  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.userService.verifyEmail(dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создание новой банковской карты для аккаунта' })
  @ApiResponse({ status: 201, description: 'Карта успешно создана' })
  @ApiResponse({ status: 401, description: 'Неавторизован' })
  @ApiResponse({ status: 409, description: 'Конфликт бизнес-логики' })
  @UseGuards(AuthGuard('jwt'))
  @Post('createcard')
  @InvalidateCache('/analytics/summary', '/user/profile', '/user/total')
  async createCard(@CurrentUser('id') userId: string) {
    return await this.userService.createCardForAccount(userId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Поиск пользователя по Email' })
  @ApiQuery({
    name: 'email',
    description: 'Email пользователя',
    example: 'user@example.com',
  })
  @ApiResponse({ status: 200, description: 'Пользователь успешно найден' })
  @ApiResponse({ status: 401, description: 'Неавторизован' })
  @ApiResponse({
    status: 404,
    description: 'Ошибка. Не удалось найти пользователя',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('search/email')
  async findByEmail(@Query('email') email: string) {
    return await this.userService.findByEmail(email);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение общего баланса пользователя' })
  @ApiResponse({ status: 200, description: 'Баланс успешно подсчитан' })
  @ApiResponse({ status: 401, description: 'Неавторизован' })
  @UseGuards(AuthGuard('jwt'))
  @Get('total')
  async getTotalBalance(@CurrentUser('id') userId: string) {
    return await this.userService.getTotalBalance(userId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение общей информации о пользователе' })
  @ApiResponse({
    status: 200,
    description: 'Общая информация о пользователе успешно получена.',
  })
  @ApiResponse({ status: 401, description: 'Неавторизован' })
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getProfile(@CurrentUser('id') userId: string) {
    return await this.userService.getProfile(userId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновление имя и фамилии пользователя' })
  @ApiResponse({ status: 200, description: 'Имя и фамилия успешно обновлены.' })
  @ApiResponse({ status: 401, description: 'Неавторизован' })
  @UseGuards(AuthGuard('jwt'))
  @Patch('update')
  async update(
    @CurrentUser('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.updateUser(userId, updateUserDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удаление аккаунта пользователя' })
  @ApiResponse({ status: 200, description: 'Пользователь успешно удален.' })
  @ApiResponse({ status: 401, description: 'Неавторизован' })
  @UseGuards(AuthGuard('jwt'))
  @Delete('delete')
  async delete(@CurrentUser('id') userId: string) {
    return await this.userService.deleteUser(userId);
  }
}
