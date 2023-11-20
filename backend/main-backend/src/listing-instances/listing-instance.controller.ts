import { Controller, Get, Param, Post, Body } from '@nestjs/common';

import { ListingInstance } from './listing-instance.entity';
import { ListingInstanceService } from './listing-instance.service';

@Controller('listingInstance')
export class ListingInstanceController {
  constructor(private readonly listing_instanceService: ListingInstanceService) {}

  @Get()
  getLisitng(): Promise<ListingInstance[]> {
    return this.listing_instanceService.findAll();
  }

  @Get('/:id')
  getSingleListingInstance(@Param() params: { id: number }): Promise<ListingInstance> {
    return this.listing_instanceService.findOne(params.id);
  }
}
