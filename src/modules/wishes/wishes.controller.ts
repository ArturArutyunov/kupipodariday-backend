import {
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Body,
  Req,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../../guards/jwt.guard';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Get('/last')
  async getLast() {
    return this.wishesService.getLast();
  }

  @Get('/top')
  async getTop() {
    return this.wishesService.getTop();
  }

  @UseGuards(JwtGuard)
  @Post('')
  async create(@Req() req, @Body() createWishDto: CreateWishDto) {
    return this.wishesService.create(createWishDto, req.user);
  }

  @UseGuards(JwtGuard)
  @Get('/:id')
  async getById(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this.wishesService.findById(id, req.user.id);
  }

  @UseGuards(JwtGuard)
  @Patch('/:id')
  async update(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    return this.wishesService.update(id, updateWishDto, req.user.id);
  }

  @UseGuards(JwtGuard)
  @Delete('/:id')
  async remove(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this.wishesService.remove(id, req.user.id);
  }

  @UseGuards(JwtGuard)
  @Post('/:id/copy')
  async copy(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this.wishesService.copy(id, req.user);
  }
}
