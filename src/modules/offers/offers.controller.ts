import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../../guards/jwt.guard';
import { OffersService } from './offers.service';
import { CreateOffersDto } from './dto/create-offer.dto';

@UseGuards(JwtGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post('')
  async create(@Req() req, @Body() createOffersDto: CreateOffersDto) {
    return this.offersService.create(createOffersDto, req.user);
  }

  @Get('/:id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.offersService.findById(id);
  }

  @Get('')
  async getAll() {
    return this.offersService.findMany();
  }
}
