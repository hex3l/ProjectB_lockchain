import { Controller, Get, Param, Post, Body } from '@nestjs/common';

import { Listing } from './listing.entity';
import { ListingService } from './listing.service';
import { CategoryService } from './categories/category.service';
import { Category } from './categories/category.entity';
import { ValidateListingDto } from './listingDto/validate-listing.dto';

@Controller('listing')
export class ListingController {
  constructor(
    private readonly listingService: ListingService,
    private readonly categoryService: CategoryService,
  ) {}

  @Get()
  getLisitng(): Promise<Listing[]> {
    return this.listingService.findAll();
  }

  @Get('/:id')
  getSingleListing(@Param() params: { id: number }): Promise<Listing> {
    return this.listingService.findOne(params.id);
  }

  @Get('/categories')
  getCategories(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @Post()
  createListing(@Body() listingDto: ValidateListingDto): Promise<Listing> {
    const listing = new Listing();
    listing.title = listingDto.title;
    listing.description = listingDto.description;
    listing.image = listingDto.image;
    //TODO:listing.id_creator = Middleware.getId;
    listing.category = <any>{ id: listingDto.category };
    return this.listingService.save(listing);
  }
}
