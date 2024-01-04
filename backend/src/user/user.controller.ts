import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<{
    token: string;
  }> {
    const token = await this.userService.createUser(dto.login, dto.password);
    return {
      token,
    };
  }

  @Post('/login')
  async login(@Body() dto: CreateUserDto): Promise<{
    token: string;
  }> {
    const token = await this.userService.login(dto.login, dto.password);
    if (!token) {
      throw new NotFoundException('Invalid login or password');
    }
    return {
      token,
    };
  }
}
