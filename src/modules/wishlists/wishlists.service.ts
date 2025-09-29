import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WishList } from './entities/wishlist.entity';
import { In, Repository } from 'typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishListDto } from './dto/update-wishlist.dto';
import { User } from '../users/entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(WishList)
    private wishlistsRepository: Repository<WishList>,
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  async create(
    createWishlistDto: CreateWishlistDto,
    user: User,
  ): Promise<WishList> {
    const wishes = await this.wishesRepository.find({
      where: { id: In(createWishlistDto.itemsId) },
    });
    const wishlist = this.wishlistsRepository.create({
      ...createWishlistDto,
      owner: user,
      items: wishes,
    });
    return this.wishlistsRepository.save(wishlist);
  }

  async findAll(): Promise<WishList[]> {
    return this.wishlistsRepository.find();
  }

  async findById(id: number): Promise<WishList> {
    return this.wishlistsRepository.findOne({
      where: { id },
      relations: ['items', 'owner'],
    });
  }

  async update(
    id: number,
    updateWishlistDto: UpdateWishListDto,
    userId: number,
  ): Promise<WishList> {
    const wishlist = await this.findById(id);
    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException('Нельзя редактировать чужой вишлист');
    }
    Object.assign(wishlist, updateWishlistDto);
    return await this.wishlistsRepository.save(wishlist);
  }

  async remove(id: number, userId: number): Promise<WishList> {
    const wishlist = await this.findById(id);
    if (!wishlist) {
      throw new NotFoundException('Не удалось найти вишлист');
    }
    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException('Нельзя удалить чужой вишлист');
    }
    await this.wishlistsRepository.delete(id);

    return wishlist;
  }
}
