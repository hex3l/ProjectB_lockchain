import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  And,
  FindManyOptions,
  ILike,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Repository,
  UpdateResult,
} from 'typeorm';
import { Listing } from './listing.entity';
import { ListingWithFavoriteDto } from './listingDto/listing-with-favorite.dto';
import { Category } from './categories/category.entity';
import { UserService } from '../user/user.service';
import { ListingStatus } from './static/listing-status.enum';

@Injectable()
export class ListingService {
  constructor(
    @InjectRepository(Listing)
    private listingRepository: Repository<Listing>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private userService: UserService,
  ) {}

  async findAll({
    category,
    search,
    take,
    page,
    address,
    states,
    lowerPrice,
    higherPrice,
    orderByDirection,
    orderByType,
    favorite,
    myorders,
    userId,
  }: {
    category?: string;
    search?: string;
    take: number;
    page: number;
    address?: string;
    states?: string;
    lowerPrice?: string;
    higherPrice?: string;
    orderByDirection?: 'ASC' | 'DESC';
    orderByType?: string;
    favorite?: boolean;
    myorders?: boolean;
    userId?: number;
  }): Promise<Listing[]> {
    const query: FindManyOptions<Listing> = { take, skip: take * (page - 1) };
    query.relations = ['category'];
    query.select = {
      id: true,
      title: true,
      image: true,
      description: true,
      category: { name: true },
      price: true,
      status: true,
      updated: true,
      favorites: true,
    };

    query.where = {};
    if (category && category !== 'All') {
      const cat = await this.categoryRepository.findOne({ where: { name: category } });
      query.where.id_category = cat?.id;
    }
    if (address) {
      const addr = await this.userService.findOneByAddress(address);
      console.log(addr);
      query.where.id_creator = addr?.id;
    }
    if (search) query.where.title = ILike(`%${search}%`);
    if (higherPrice || lowerPrice)
      query.where.price = And(
        MoreThanOrEqual(parseFloat(lowerPrice ?? '0')),
        LessThanOrEqual(parseFloat(higherPrice ?? '99999')),
      );
    let orderColumn;
    switch (orderByType) {
      case 'Title':
        orderColumn = 'title';
        break;
      case 'Price':
        orderColumn = 'price';
        break;
      default:
        orderColumn = 'updated';
    }
    const orderDirection = orderByDirection ?? 'DESC';

    switch (states) {
      case 'all':
        break;
      default:
        query.where.status = ListingStatus.PUBLISHED;
    }

    if (myorders && userId) query.where.orders = { id_creator: userId };

    if (favorite && userId) query.where.favorites = { id: userId };

    if (userId) {
      query.select.favorites = { id: true };
      query.relations.push('favorites');
    }

    return this.listingRepository.find({
      ...query,
      order: { [orderColumn]: orderDirection },
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

  update(id: any, lisiting: any): Promise<UpdateResult> {
    return this.listingRepository.update({ id }, lisiting);
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
