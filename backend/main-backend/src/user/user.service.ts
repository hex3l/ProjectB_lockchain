import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Listing } from '../listings/listing.entity';

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

  async findFavorites(user: any): Promise<Listing[]> {
    const { favorites } = await this.userRepository.findOne({
      where: { id: user },
      relations: ['favorites'],
      select: ['favorites'],
    });
    return favorites;
  }

  save(user: any): Promise<User> {
    return this.userRepository.save(user);
  }

  addFavorite(user: any, listing: any): void {
    console.log(user);
    console.log(listing);
    this.userRepository.createQueryBuilder().relation(User, 'favorites').of(user.id_user).add(listing);
  }

  removeFavorite(user: any, listing: any): void {
    this.userRepository.createQueryBuilder().relation(User, 'favorites').of(user.id_user).remove(listing);
  }

  update(user: any): Promise<User> {
    return this.userRepository.save(user);
  }

  async findFavorite(user: any, listing: any): Promise<Listing> {
    const { favorites } = await this.userRepository.findOne({
      where: { id: user },
      relations: ['favorites'],
      select: ['favorites'],
    });
    return favorites.find((fav) => fav.id == listing);
  }

  async findOneByAddress(address: string): Promise<User> {
    return this.userRepository.findOneBy({ address });
  }

  async deleteById(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
