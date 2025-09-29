import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

export class CreateWishDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 250, {
    message: 'Название должно содержать от 1 до 250 символов',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 1024, {
    message: 'Описание должно содержать от 1 до 1024 символов',
  })
  description: string;

  @IsNotEmpty()
  @IsString()
  @IsUrl({
    message: 'Ссылка на магазин должна быть валидным URL адресом',
  })
  link: string;

  @IsNotEmpty()
  @IsString()
  @IsUrl({
    message: 'Ссылка на изображение должна быть валидным URL адресом',
  })
  image: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;
}
