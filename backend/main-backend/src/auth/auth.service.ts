import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private jwtService: JwtService,
    ) {}

    async validateUser(username: string, password: string): Promise<User | null> {
        const user = await this.usersService.findOneByUsername(username);
        if (user && user.password === password) {
            return user;
        }
        return null;
    }

    async login(user: User): Promise<{ access_token: string }> {
        const payload = { username: user.username, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
    async generateAccessToken(user: User): Promise<string> {
        const payload = { username: user.username, sub: user.id };
        return this.jwtService.sign(payload);
    }
}
