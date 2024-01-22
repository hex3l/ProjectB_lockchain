import { IsNumber, IsString, IsUrl, isNumber, isURL } from 'class-validator';

export class ListingsDto {
  @IsNumber()
  id_category: number;
  @IsNumber()
  take: number;
  @IsNumber()
  page: number;
}
