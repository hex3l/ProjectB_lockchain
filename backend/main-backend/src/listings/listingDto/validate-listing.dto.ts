import { IsNumber, IsString, IsUrl, isNumber, isURL } from 'class-validator';
import { isRegExp } from 'util/types';
import { Category } from '../categories/category.entity';

export class ValidateListingDto {
  @IsString({
    message: 'Title not valid',
  })
  title: string;

  @IsUrl({}, { message: 'URL not valid' })
  image: string;

  @IsString({
    message: 'description not valid',
  })
  description: string;

  @IsNumber({}, { message: 'limit is not setted correctly' })
  limit: number;

  @IsNumber({}, { message: 'category not found' })
  category: number;
}
