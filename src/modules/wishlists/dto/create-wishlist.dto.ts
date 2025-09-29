import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

export class CreateWishlistDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 250, {
    message: 'Название должно содержать от 1 до 250 символов',
  })
  name: string;

  @IsString()
  @IsUrl({
    message: 'Ссылка на изображение должна быть валидным URL адресом',
  })
  @IsOptional()
  image?: string;

  @IsArray({ message: 'ID подарков должны быть переданы в массиве' })
  @IsNumber({}, { each: true, message: 'Каждый элемент должен быть числом' })
  itemsId: number[];
}
