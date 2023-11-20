import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  save(user: any): Promise<User> {
    return this.userRepository.save(user);
  }

  async findOneByAddress(address: string): Promise<User> {
    return this.userRepository.findOneBy({ address });
  }

  async deleteById(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
