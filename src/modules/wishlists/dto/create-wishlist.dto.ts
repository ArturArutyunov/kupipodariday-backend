import { User } from '../../users/entities/user.entity';

export class CreateWishlistDto {
  name: string;
  image?: string;
  itemsId: number[];
  owner: User;
}
