import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    const savedUser = await this.usersRepository.save(user);
    const { password, ...result } = savedUser;

    return result as User;
  }

  async findById(id: number, withRelations = false): Promise<User> {
    const options: FindOneOptions = { where: { id } };
    if (withRelations) {
      options.relations = ['wishes', 'offers', 'wishlists'];
    }
    const user = await this.usersRepository.findOne(options);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return user;
  }

  async findByUsername(
    username: string,
    withRelations = false,
    withPassword = false,
  ): Promise<User> {
    const options: FindOneOptions = {
      select: {
        id: true,
        username: true,
        about: true,
        avatar: true,
        email: true,
        password: withPassword,
      },
      where: { username },
    };
    if (withRelations) {
      options.relations = ['wishes', 'offers', 'wishlists'];
    }
    const user = await this.usersRepository.findOne(options);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return user;
  }

  async findMany(search: string): Promise<User[]> {
    return this.usersRepository.find({
      where: [
        { email: Like(`%${search}%`) },
        { username: Like(`%${search}%`) },
      ],
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    Object.assign(user, updateUserDto);
    return await this.usersRepository.save(user);
  }
}
