import { IsBoolean, IsEthereumAddress, IsNumber, IsString, IsUrl, isNumber, isURL } from 'class-validator';

export class OrdersFindDto {
  @IsBoolean()
  source: boolean;

  @IsBoolean()
  target: boolean;

  @IsBoolean()
  confirmed: boolean;

  @IsBoolean()
  pending: boolean;

  @IsNumber()
  take: number;

  @IsNumber()
  page: number;
}
