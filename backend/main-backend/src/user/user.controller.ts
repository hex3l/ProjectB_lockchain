import { Controller, Get, Param, Post, Body, Req } from '@nestjs/common';

import { User } from './user.entity';
import { UserService } from './user.service';
import { Listing } from '../listings/listing.entity';
import { ListingController } from '../listings/listing.controller';
import { ListingService } from '../listings/listing.service';
import { Private } from '../auth/decorator/auth.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUser(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Private()
  @Get('/favorites')
  getFavorites(@Req() request: any): Promise<Listing[]> {
    const { user } = request;
    return this.userService.findFavorites(user.id_user);
  }

  @Get('/:id')
  getSingleUser(@Param() params: { id: number }): Promise<User> {
    return this.userService.findOne(params.id);
  }

  @Private()
  @Get('/favorite/:id')
  getFavorite(@Param() params: { id: number }, @Req() request: any): Promise<Listing> {
    const { user } = request;
    return this.userService.findFavorite(user.id_user, params.id);
  }

  @Private()
  @Post('/remove')
  removeFavorite(@Body() { listing_id }, @Req() request: any): Promise<User> {
    const { user } = request;
    this.userService.removeFavorite(user, listing_id);
    return request.user;
  }

  @Private()
  @Post('/add')
  async createFavorite(@Body() { listing_id }, @Req() request: any): Promise<User> {
    const { user } = request;
    if ((await this.userService.findFavorite(user.id_user, listing_id)) === undefined) {
      console.log('Adding favorite');
      console.log(listing_id);
      this.userService.addFavorite(user, listing_id);
      return request.user;
    } else console.log('Already favorited');
    return request.user;
  }
}
