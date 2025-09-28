import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishList } from './entities/wishlist.entity';
import { Wish } from '../wishes/entities/wish.entity';
import { WishlistsService } from './wishlists.service';
import { WishlistsController } from './wishlists.controller';

@Module({
  imports: [TypeOrmModule.forFeature([WishList, Wish])],
  providers: [WishlistsService],
  controllers: [WishlistsController],
})
export class WishlistsModule {}
