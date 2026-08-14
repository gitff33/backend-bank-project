import { Module } from "@nestjs/common";
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { UserModule } from "src/user/user.module";

@Module({
    imports:[
        UserModule,
        PassportModule,
        JwtModule.register({
            secret:process.env.JWT_SECRET || 'SUPER_SECRET_KEY',
            signOptions:{expiresIn:'1d'},
        }),
    ],
    controllers:[AuthController],
    providers:[AuthService,JwtStrategy],
    exports:[JwtStrategy,PassportModule],
})
export class AuthModule {}