import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthCache } from './auth.entity';
import { ethers } from 'ethers';
import { Console } from 'console';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthCache)
    private authCacheRepository: Repository<AuthCache>,
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async authenticateAuthCache(data: {
    ip: string;
    verify: { address: string; signedMessage: string };
  }): Promise<string> {
    // Obtain data from db cache
    const cache = await this.authCacheRepository.findOneBy({
      address: data.verify.address,
      ip_address: data.ip,
      deletedAt: null,
    });

    // Verify signature
    const signerAddress = ethers.verifyMessage(cache.nounce, data.verify.signedMessage);

    if (signerAddress !== cache.address) {
      return null;
    }

    let existingUser = await this.usersService.findOneByAddress(signerAddress);

    if (!existingUser) {
      // Create new user if doesn't exist
      existingUser = await this.usersService.save({ address: signerAddress });
    }

    return this.jwtService.sign({ id_user: existingUser.id, address: signerAddress });
  }

  async saveAuthCache(data: { address: string; nounce: string; ip: string }): Promise<void> {
    // Deletes old tokens
    const existing = await this.authCacheRepository.find({ where: { address: data.address, ip_address: data.ip } });
    if (existing.length > 0) this.authCacheRepository.delete(existing.map((cache) => cache.id));

    // Saves new token
    const authCache = new AuthCache();
    authCache.address = data.address;
    authCache.nounce = data.nounce;
    authCache.ip_address = data.ip;
    await this.authCacheRepository.save(authCache);
  }
}
