import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { JwtGuard } from '../../guards/jwt.guard';
import { Wish } from '../wishes/entities/wish.entity';
import { SearchUserDto } from './dto/search-user.dto';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@Req() req): Promise<User> {
    const user = req.user;
    return user;
  }

  @Patch('me')
  async patchMe(
    @Req() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(req.user.id, updateUserDto);
  }

  @Get('me/wishes')
  async getMyWishes(@Req() req): Promise<Wish[]> {
    const user = await this.usersService.findById(req.user.id, true);
    return user.wishes;
  }

  @Get(':username')
  async getByUsername(@Param('username') username: string): Promise<User> {
    return this.usersService.findByUsername(username, false, false);
  }

  @Get(':username/wishes')
  async getWishesByUsername(
    @Param('username') username: string,
  ): Promise<Wish[]> {
    const user = await this.usersService.findByUsername(username, true, false);
    return user.wishes;
  }

  @Post('find')
  async getByEmailOrUsername(
    @Body() { query }: SearchUserDto,
  ): Promise<User[]> {
    return this.usersService.findMany(query);
  }
}
