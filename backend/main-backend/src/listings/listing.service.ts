import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOperator, FindOptionsWhere, Repository } from 'typeorm';
import { Listing } from './listing.entity';

@Injectable()
export class ListingService {
  constructor(
    @InjectRepository(Listing)
    private listingRepository: Repository<Listing>,
  ) {}

  findAll(id_category: number, take: number, page: number): Promise<Listing[]> {
    const query: FindManyOptions<Listing> = { take, skip: take * (page - 1) };

    if (id_category) {
      query.where = { id_category };
    }

    return this.listingRepository.find(query);
  }

  findOne(id: number): Promise<Listing> {
    return this.listingRepository.findOneBy({ id });
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
