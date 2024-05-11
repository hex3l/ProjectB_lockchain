import { IsNumber, IsNumberString, IsString, IsUrl, isNumber, isURL } from 'class-validator';

export class ListingsDto {
  @IsNumberString()
  take: number;
  @IsNumberString()
  page: number;

  search: string | undefined | null;
  category: string | undefined | null;
  address: string | undefined | null;
  states: string | undefined | null;
}
