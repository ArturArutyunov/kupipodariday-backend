import { PartialType } from '@nestjs/mapped-types';
import { CreateWishlistDto } from './create-wishlist.dto';

export class UpdateWishListDto extends PartialType(CreateWishlistDto) {}
