import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  AfterLoad,
  JoinColumn,
} from 'typeorm';

import { IsString, Length, IsNotEmpty, IsUrl, IsNumber } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { WishList } from '../../wishlists/entities/wishlist.entity';
import { roundToHundreds } from '../../../utils';

@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 250)
  name: string;

  @Column()
  @IsString()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column()
  @IsNumber()
  price: number;

  @Column({
    default: 0,
  })
  @IsNumber()
  copied: number;

  @Column({
    type: 'text',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 1024)
  description: string;

  @ManyToOne(() => User, (user) => user.wishes, {
    eager: true,
  })
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @OneToMany(() => Offer, (offer) => offer.item, {
    eager: true,
  })
  offers: Offer[];

  @ManyToMany(() => WishList, (wishlist) => wishlist.items, {
    eager: true,
  })
  @JoinTable()
  wishlists: WishList[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  raised: number;

  @AfterLoad()
  calculateFields() {
    if (this.offers && this.offers.length > 0) {
      this.raised = roundToHundreds(
        this.offers.reduce((sum, item) => sum + item.amount, 0),
      );
    } else {
      this.raised = 0;
    }
  }
}
