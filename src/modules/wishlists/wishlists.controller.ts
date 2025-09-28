import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../../guards/jwt.guard';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishListDto } from './dto/update-wishlist.dto';

@UseGuards(JwtGuard)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post('')
  async create(@Req() req, @Body() createWishlistDto: CreateWishlistDto) {
    return this.wishlistsService.create(createWishlistDto, req.user);
  }

  @Get('')
  async getAll() {
    return this.wishlistsService.findAll();
  }

  @Get('/:id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.wishlistsService.findById(id);
  }

  @Patch('/:id')
  async update(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWishListDto: UpdateWishListDto,
  ) {
    return this.wishlistsService.update(id, updateWishListDto, req.user.id);
  }

  @Delete('/:id')
  async remove(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this.wishlistsService.remove(id, req.user.id);
  }
}
