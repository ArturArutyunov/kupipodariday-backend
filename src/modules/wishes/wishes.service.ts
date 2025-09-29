import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createWishDto: CreateWishDto, user: User): Promise<Wish> {
    const wish = this.wishesRepository.create({
      owner: user,
      ...createWishDto,
    });
    return this.wishesRepository.save(wish);
  }

  async getLast(): Promise<Wish[]> {
    const wishes = this.wishesRepository.find({
      order: { createdAt: 'DESC' },
      take: 40,
    });
    return wishes;
  }

  async getTop(): Promise<Wish[]> {
    const wishes = this.wishesRepository.find({
      order: { createdAt: 'DESC' },
      take: 20,
    });
    return wishes;
  }

  async findById(id: number, userId?: number): Promise<Wish> {
    const options = {
      where: { id },
      relations: ['owner', 'offers', 'offers.user', 'wishlists'],
    };
    const wish = await this.wishesRepository.findOne(options);
    if (userId && wish.owner) {
      wish.offers =
        wish.owner.id === userId
          ? wish.offers
          : wish.offers.filter((offer) => !offer.hidden);
    }
    return wish;
  }

  async update(
    id: number,
    updateWishDto: UpdateWishDto,
    userId,
  ): Promise<Wish> {
    const wish = await this.findById(id);
    if (wish.owner.id !== userId) {
      throw new ForbiddenException('Нельзя редактировать чужой подарок');
    }
    if (wish.offers.length === 0) {
      throw new BadRequestException(
        'Нельзя отредактировать подарок, если есть желающие скинуться',
      );
    }
    Object.assign(wish, updateWishDto);
    return await this.wishesRepository.save(wish);
  }

  async remove(id: number, userId: number): Promise<void> {
    const wish = await this.findById(id);
    if (wish.owner.id !== userId) {
      throw new ForbiddenException('Нельзя удалить чужой подарок');
    }
    await this.wishesRepository.delete(id);
  }

  async copy(id: number, user: User): Promise<Wish> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const wish = await this.wishesRepository.findOne({ where: { id } });
      wish.copied = wish.copied + 1;

      const copied = {
        name: wish.name,
        description: wish.description,
        link: wish.link,
        image: wish.image,
        price: wish.price,
        copied: 0,
        owner: user,
      };
      const result = this.wishesRepository.create(copied);
      await Promise.all([
        queryRunner.manager.save(wish),
        queryRunner.manager.save(result),
      ]);

      await queryRunner.commitTransaction();
      await queryRunner.release();
      return result;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new Error('Возникла ошибка при копировании');
    }
  }
}
