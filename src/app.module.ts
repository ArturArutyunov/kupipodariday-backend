import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';

import { User } from './modules/users/entities/user.entity';
import { Wish } from './modules/wishes/entities/wish.entity';
import { WishList } from './modules/wishlists/entities/wishlist.entity';
import { Offer } from './modules/offers/entities/offer.entity';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { WishlistsModule } from './modules/wishlists/wishlists.module';
import { WishesModule } from './modules/wishes/wishes.module';
import { OffersModule } from './modules/offers/offers.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'student',
      password: 'student',
      database: 'kupipodariday',
      entities: [User, Wish, WishList, Offer],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    WishlistsModule,
    WishesModule,
    OffersModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
