import { User } from '../../users/entities/user.entity';

export class CreateWishDto {
  name: string;
  description: string;
  link?: string;
  image?: string;
  price?: number;
  owner: User;
}
