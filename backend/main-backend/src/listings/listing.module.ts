import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ListingController } from './listing.controller';
import { Listing } from './listing.entity';
import { ListingService } from './listing.service';
import { Category } from './categories/category.entity';
import { CategoryService } from './categories/category.service';

@Module({
  imports: [TypeOrmModule.forFeature([Listing, Category])],
  providers: [ListingService, CategoryService],
  controllers: [ListingController],
  exports: [],
})
export class ListingModule {}
