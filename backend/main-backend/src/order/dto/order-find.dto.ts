import { IsArray, IsBoolean, IsEthereumAddress, IsNumber, IsString, IsUrl, isNumber, isURL } from 'class-validator';

export class OrdersFindDto {
  @IsBoolean()
  source: boolean;

  @IsBoolean()
  target: boolean;

  @IsArray()
  status: Array<number>;

  @IsNumber()
  take: number;

  @IsNumber()
  page: number;
}
