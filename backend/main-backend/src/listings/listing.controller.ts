import { Controller, Get, Param, Post, Body, Req, HttpException, HttpStatus } from '@nestjs/common';

import { Listing } from './listing.entity';
import { ListingService } from './listing.service';
import { CategoryService } from './categories/category.service';
import { Category } from './categories/category.entity';
import { ValidateListingDto } from './listingDto/validate-listing.dto';
import { Private } from '../auth/decorator/auth.decorator';
import { ListingsDto } from './listingDto/listings.dto';

@Controller('listing')
export class ListingController {
  constructor(
    private readonly listingService: ListingService,
    private readonly categoryService: CategoryService,
  ) {}

  @Get()
  getListings(@Param() listingsParams: ListingsDto): Promise<Listing[]> {
    const { id_category, take, page } = listingsParams;
    return this.listingService.findAll(id_category, take, page);
  }

  @Get('/:id')
  async getSingleListing(@Param() params: { id: number }): Promise<Listing> {
    const result = await this.listingService.findOne(params.id);

    if (!result)
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: 'No listing found with the given id',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
        {
          cause: 'No listing found with the given id',
        },
      );

    return result;
  }

  @Get('/categories')
  getCategories(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @Private()
  @Post()
  createListing(@Body() listingDto: ValidateListingDto, @Req() request: any): Promise<Listing> {
    const { user } = request;
    const listing = new Listing();
    listing.title = listingDto.title;
    listing.description = listingDto.description;
    listing.image = listingDto.image;
    listing.id_creator = user.id;
    listing.category = <any>{ id: listingDto.category };
    return this.listingService.save(listing);
  }
}
