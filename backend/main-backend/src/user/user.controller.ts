import { Controller, Get, Param, Post, Body, Req } from '@nestjs/common';

import { User } from './user.entity';
import { UserService } from './user.service';
import { Listing } from '../listings/listing.entity';
import { Private } from '../auth/decorator/auth.decorator';
import * as contract from '../../truffle/build/contracts/DealHandler.json';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUser(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Private()
  @Get('/abi')
  getAbi(@Req() request: any): any {
    return contract.abi;
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
  @Post('/favorite')
  async createFavorite(@Body() { listing_id }, @Req() request: any): Promise<boolean> {
    const { user } = request;
    if ((await this.userService.findFavorite(user.id_user, listing_id)) === undefined) {
      console.log('Adding favorite');
      console.log(listing_id);
      this.userService.addFavorite(user, listing_id);
      return true;
    } else {
      this.userService.removeFavorite(user, listing_id);
      return false;
    }
  }
}
