import { Controller, Get, Post, Body, Patch, Param, Delete,Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { ClearCacheInterceptor } from 'src/common/interceptors/clear-cache.interceptor';
import { InvalidateCache } from 'src/common/decorators/invalidate-cache.decorator';
@Controller('user')
@UseInterceptors(ClearCacheInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Post('login')
  async login(@Body() dto:LoginUserDto){
    return await this.userService.login(dto)
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('createcard/:AccountId')
  @InvalidateCache('/analytics/summary','/user/profile','/user/total')
  async createCard(@Param('AccountId') accountId:string){
    return await this.userService.createCardForAccount(accountId);
  } 

  @UseGuards(AuthGuard('jwt'))
  @Get('search/email')
  async findByEmail(@Query('email')email:string){
    return await this.userService.findByEmail(email)
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('total/:id')
  async getTotalBalance(@Param('id') id:string){
    return await this.userService.getTotalBalance(id)
  }
  
  @UseGuards(AuthGuard('jwt'))
  @Get('profile/:id')
    async getProfile(@Param('id') id:string){
      return await this.userService.getProfile(id)
    }
  
    @UseGuards(AuthGuard('jwt'))
  @Get(':id')
 async findOne(@Param('id') id: string) {
    return await this.userService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('update/:id')
 async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await  this.userService.updateUser(id, updateUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('delete/:id')
  async deleteUser(@Param('id') id: string) {
    return await this.userService.deleteUser(id);
  }


}
