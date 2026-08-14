import { Injectable,UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from 'src/user/dto/login-user.dto';


@Injectable()
export class AuthService {
    constructor(
        private readonly userService:UserService,
        private readonly jwtService:JwtService,
    ){}


    async register(dto:any){
        const user = await this.userService.create(dto)

        return this.generateToken(user);
    }

    async login(dto:LoginUserDto){
        const user = await this.userService.login(dto)

        return this.generateToken(user)
    }

    private generateToken(user:any){
        const payload = {sub:user.id,email:user.email};
        return{
            access_token: this.jwtService.sign(payload) // подпишем токен секретом из модуля
        }

    };

}
