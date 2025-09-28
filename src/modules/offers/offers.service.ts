import { Repository } from 'typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Wish } from '../wishes/entities/wish.entity';
import { CreateOffersDto } from './dto/create-offer.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  async create(createOfferDto: CreateOffersDto, user: User): Promise<Offer> {
    const wish = await this.wishesRepository.findOne({
      where: { id: createOfferDto.itemId },
      relations: ['owner'],
    });
    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }
    if (wish && wish.owner.id === user.id) {
      throw new BadRequestException(
        'Нельзя вносить деньги на собственные подарки',
      );
    }
    if (wish.raised >= wish.price) {
      throw new BadRequestException(
        'Средства на подарок собраны в полном объеме',
      );
    }
    if (wish.price - wish.raised < createOfferDto.amount) {
      throw new BadRequestException(
        'Сумма собранных средств не может превышать стоимость подарка',
      );
    }
    const offer = this.offersRepository.create({
      ...createOfferDto,
      user,
      item: wish,
    });
    return this.offersRepository.save(offer);
  }

  async findMany(): Promise<Offer[]> {
    return this.offersRepository.find();
  }

  async findById(id: number): Promise<Offer> {
    return this.offersRepository.findOne({
      where: { id },
    });
  }
}
