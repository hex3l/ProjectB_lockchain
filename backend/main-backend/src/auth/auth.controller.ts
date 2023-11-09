import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        const { username, password } = loginDto;
        const user = await this.authService.validateUser(username, password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const accessToken = await this.authService.generateAccessToken(user);
        return { accessToken };
    }
}
