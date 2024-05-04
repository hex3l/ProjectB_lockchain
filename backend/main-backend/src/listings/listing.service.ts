import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Like, Repository } from 'typeorm';
import { Listing } from './listing.entity';
import { User } from '../user/user.entity';
import { ListingWithFavoriteDto } from './listingDto/listing-with-favorite.dto';
import { Category } from './categories/category.entity';

@Injectable()
export class ListingService {
  constructor(
    @InjectRepository(Listing)
    private listingRepository: Repository<Listing>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(category: string, search: string, take: number, page: number, address: string): Promise<Listing[]> {
    const query: FindManyOptions<Listing> = { take, skip: take * (page - 1) };

    if (category || search || address) {
      query.where = {};
      if (category && category !== 'All') {
        const { id } = await this.categoryRepository.findOne({ where: { name: category } });
        query.where.id_category = id;
      }
      if (address) {
        const { id } = await this.userRepository.findOne({ where: { address } });
        query.where.id_creator = id;
      }
      if (search) query.where.title = Like(`%${search}%`);
    }

    return this.listingRepository.find({
      ...query,
      select: ['id', 'title', 'description', 'image', 'price', 'status', 'updated'],
    });
  }

  async findOne(id: number, id_user: number): Promise<ListingWithFavoriteDto> {
    const dbResult = await this.listingRepository.findOne({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        image: true,
        price: true,
        status: true,
        category: { id: true, name: true },
        updated: true,
        creator: { address: true, created: true, rating: true },
      },
      relations: ['creator', 'category'],
    });

    const result: Listing & { favorite: boolean } = { ...dbResult, favorite: false };

    if (!!id_user) {
      const favorite = await this.listingRepository.findOne({ where: { id, favorites: { id: id_user } } });

      result.favorite = !!favorite;
    }

    return result;
  }

  save(lisiting: any): Promise<Listing> {
    return this.listingRepository.save(lisiting);
  }

  findAllByCreator(id_creator: number, take: number, page: number): Promise<Listing[]> {
    return this.listingRepository.find({ where: { id_creator }, take, skip: take * (page - 1) });
  }

  //findbycategory

  async deleteById(id: number): Promise<void> {
    await this.listingRepository.delete(id);
  }
}
