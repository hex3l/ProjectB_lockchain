import { IsArray, IsBoolean, IsEthereumAddress, IsNumber, IsString, IsUrl, isNumber, isURL } from 'class-validator';

export class OrdersCreateDto {
  @IsNumber()
  id_listing: number;

  @IsNumber()
  price: number;
}
