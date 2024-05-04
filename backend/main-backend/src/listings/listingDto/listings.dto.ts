import { IsNumber, IsNumberString, IsString, IsUrl, isNumber, isURL } from 'class-validator';

export class ListingsDto {
  category: string | undefined | null;
  @IsNumberString()
  take: number;
  @IsNumberString()
  page: number;
  search: string | undefined | null;
}
