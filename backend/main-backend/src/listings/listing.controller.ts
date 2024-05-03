import { Controller, Get, Query, Post, Param, Body, Req, HttpException, HttpStatus } from '@nestjs/common';

import { Listing } from './listing.entity';
import { ListingService } from './listing.service';
import { CategoryService } from './categories/category.service';
import { Category } from './categories/category.entity';
import { ValidateListingDto } from './listingDto/validate-listing.dto';
import { Private } from '../auth/decorator/auth.decorator';
import { ListingsDto } from './listingDto/listings.dto';
import { ListingWithFavoriteDto } from './listingDto/listing-with-favorite.dto';

@Controller('listing')
export class ListingController {
  constructor(
    private readonly listingService: ListingService,
    private readonly categoryService: CategoryService,
  ) {}

  @Get()
  getAllListings(@Query() listingsParams: ListingsDto): Promise<Listing[]> {
    const { category, take, page, search } = listingsParams;
    return this.listingService.findAll(category, search, take, page);
  }

  @Get('/categories')
  getCategories(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @Get('/:id')
  async getSingleListing(@Param() params: { id: number }, @Req() request: any): Promise<ListingWithFavoriteDto> {
    const { user } = request;
    const result = await this.listingService.findOne(params.id, user?.id_user);

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

  @Private()
  @Post()
  createListing(@Body() listingDto: ValidateListingDto, @Req() request: any): Promise<Listing> {
    const { user } = request;
    const listing = new Listing();
    listing.title = listingDto.title;
    listing.description = listingDto.description;
    listing.image = listingDto.image;
    listing.price = listingDto.price;
    listing.id_creator = user.id_user;
    listing.category = <any>{ id: listingDto.category };
    return this.listingService.save(listing);
  }
}
