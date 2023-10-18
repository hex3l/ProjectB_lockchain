import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './User';

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

  async deleteById(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
