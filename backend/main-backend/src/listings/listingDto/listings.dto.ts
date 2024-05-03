import { IsNumber, IsNumberString, IsString, IsUrl, isNumber, isURL } from 'class-validator';

export class ListingsDto {
  @IsString()
  category: string;
  @IsNumberString()
  take: number;
  @IsNumberString()
  page: number;
  @IsString()
  search: string;
}
