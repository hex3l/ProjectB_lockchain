import { IsNumber, IsNumberString, IsString, IsUrl, isNumber, isURL } from 'class-validator';

export class ListingsDto {
  @IsNumberString()
  id_category: number;
  @IsNumberString()
  take: number;
  @IsNumberString()
  page: number;
  @IsString()
  search: string;
}
