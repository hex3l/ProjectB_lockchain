import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListingInstance } from './listing-instance.entity';
import { User } from '../user/user.entity';

@Injectable()
export class ListingInstanceService {
  constructor(
    @InjectRepository(ListingInstance)
    private listingInstanceRepository: Repository<ListingInstance>,
  ) {}

  findAll(): Promise<ListingInstance[]> {
    return this.listingInstanceRepository.find();
  }

  findOne(id: number): Promise<ListingInstance> {
    return this.listingInstanceRepository.findOneBy({ id });
  }

  save(lisiting: any): Promise<ListingInstance> {
    return this.listingInstanceRepository.save(lisiting);
  }

  findAllByCustomer(id_customer: User): Promise<ListingInstance[]> {
    return this.listingInstanceRepository.find({ where: { id_customer } });
  }

  async deleteById(id: number): Promise<void> {
    await this.listingInstanceRepository.delete(id);
  }
}
