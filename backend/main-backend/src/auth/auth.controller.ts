import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RealIP } from 'nestjs-real-ip';
import { RetriveAccessTokenDto } from './dto/request-token.dto';
import randomString from '../utils/randomString';
import { ValidateTokenDto } from './dto/validate-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('validate')
  async login(@Body() validateDto: ValidateTokenDto, @RealIP() ip: string) {
    const { address, signedToken } = validateDto;
    const accessToken = await this.authService.authenticateAuthCache({
      ip,
      verify: { address, signedMessage: signedToken },
    });
    if (!accessToken) {
      throw new UnauthorizedException('The verification process failed');
    }

    return { accessToken };
  }

  @Post('request')
  async retrieveAccessToken(@Body() bodyDto: RetriveAccessTokenDto, @RealIP() ip: string) {
    const { address } = bodyDto;
    const message =
      'WALLET AUTHENTICATION\n\nADDRESS: ' +
      address +
      '\n\nNOUNCE: ' +
      randomString(25) +
      '\n\nTIME: ' +
      Date.now().toString() +
      '\n\nIP: ' +
      ip;
    await this.authService.saveAuthCache({ address, nounce: message, ip });
    return { message };
  }
}
