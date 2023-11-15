import { Controller, Get, Param, Post, Body } from '@nestjs/common';

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

  @Post('/create')
  createUser(@Body() user: User): UserCreateResult {
    const result: UserCreateResult = { errors: { email: undefined, username: undefined }, success: false };
    const emailExists = this.userService.findOneByEmail(user.email);
    const usernameExists = this.userService.findOneByUsername(user.username);

    if (emailExists) result.errors.email = true;
    if (usernameExists) result.errors.username = true;

    if (!result.errors.email && !result.errors.username) {
      this.userService.save(user);
      result.success = true;
    }

    return result;
  }
}

type UserCreateResult = {
  errors: {
    email: boolean | undefined;
    username: boolean | undefined;
  };
  success: boolean;
};
