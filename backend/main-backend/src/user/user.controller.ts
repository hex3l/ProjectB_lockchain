import { Controller, Get, Param } from '@nestjs/common';

import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUser(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get('/:id')
  getSingleUser(@Param() params: { id: number }): Promise<User> {
    return this.userService.findOne(params.id);
  }
}
